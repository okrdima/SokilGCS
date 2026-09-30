module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/apps/gcs-frontend/postcss.config.mjs { CONFIG => \"[project]/apps/gcs-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/node_modules__pnpm_0q5gz_g._.js",
  "chunks/[root-of-the-server]__10j5_2b._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/apps/gcs-frontend/postcss.config.mjs { CONFIG => \"[project]/apps/gcs-frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];