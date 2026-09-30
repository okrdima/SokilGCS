import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '..', 'src');

// Helper to read all .ts files in a directory (recursively) except declaration files.
function walk(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && full.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

// Parse export names from a file.
function extractExports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportRegex = /\bexport\b\s+((?:type|interface|class|function|const|let|var)\s+(\w+)|\{\s*([\w\s,]+)\s*\})/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = exportRegex.exec(content))) {
    if (m[2]) {
      names.push(m[2]);
    } else if (m[3]) {
      const parts = m[3].split(',').map((p) => p.trim().split(' as ')[0]);
      names.push(...parts.map((n) => n.trim()));
    }
  }
  // Also capture type-only exports e.g., export type Foo = ...;
  const typeRegex = /\bexport\s+type\s+(\w+)/g;
  while ((m = typeRegex.exec(content))) {
    names.push(m[1]);
  }
  return names;
}

// Collect duplicates across the entire repo.
const allExports = new Map<string, string>(); // name -> file
let duplicateFound = false;

const dtoAndTypesDirs = ['dto', 'types'];
for (const sub of dtoAndTypesDirs) {
  const glob = path.join(SRC_DIR, '**', sub, '**', '*.ts');
  const files = walk(SRC_DIR).filter((p) => p.includes(`/${sub}/`));
  for (const file of files) {
    const names = extractExports(file);
    for (const name of names) {
      const key = `export:${name}`;
      if (allExports.has(key)) {
        console.error(`Duplicate exported type '${name}' found in both '${allExports.get(key)}' and '${file}'`);
        duplicateFound = true;
      } else {
        allExports.set(key, file);
      }
    }
  }
}

// Validate barrel exports: each src/**/index.ts should export all names from its sibling folders.
const indexFiles = walk(SRC_DIR).filter((p) => p.endsWith('index.ts'));
for (const idx of indexFiles) {
  const dir = path.dirname(idx);
  const exportLines = fs.readFileSync(idx, 'utf8').split(/\r?\n/);
  for (const line of exportLines) {
    const match = line.match(/export\s+\*\s+from\s+['"](.+)['"]/);
    if (match) {
      const relPath = match[1];
      const targetDir = path.resolve(dir, relPath);
      const targetFiles = walk(targetDir).filter((p) => p.endsWith('.ts'));
      const exportedNames = [];
      for (const tgFile of targetFiles) {
        exportedNames.push(...extractExports(tgFile));
      }
      // Ensure that barrel imports all names (basic check):
      const barrelExports = extractExports(idx);
      for (const name of exportedNames) {
        if (!barrelExports.includes(name)) {
          console.error(`Barrel ${idx} does not export '${name}' from ${relPath}`);
          duplicateFound = true;
        }
      }
    }
  }
}

if (duplicateFound) {
  process.exit(1);
} else {
  console.log('Export checks passed. No duplicate types or missing barrel exports detected.');
  process.exit(0);
}
