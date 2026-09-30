# 1. Base Stage
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. Build Stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @sokil/contracts build
RUN pnpm --filter @sokil/backend build

# Втягуємо лише продакшн-артефакти для бекенду
RUN pnpm --filter @sokil/backend --prod deploy /prod/backend

# 3. Production Stage (Lightweight Run)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /prod/backend/dist ./dist
COPY --from=builder /prod/backend/node_modules ./node_modules
COPY --from=builder /prod/backend/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]
