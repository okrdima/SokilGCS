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
RUN pnpm --filter @sokil/gcs-frontend build

# 3. Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/gcs-frontend/.next/standalone ./
COPY --from=builder /app/apps/gcs-frontend/.next/static ./apps/gcs-frontend/.next/static
COPY --from=builder /app/apps/gcs-frontend/public ./apps/gcs-frontend/public

EXPOSE 3000
CMD ["node", "apps/gcs-frontend/server.js"]
