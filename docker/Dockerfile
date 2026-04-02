# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

COPY app/package*.json ./
# Force public npm registry for local builds
RUN npm install --omit=dev --registry https://registry.npmjs.org

COPY app/ .

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

LABEL org.opencontainers.image.title="jfrog-sample-app"
LABEL org.opencontainers.image.description="Sample app for JFrog platform trial"
LABEL org.opencontainers.image.version="1.0.0"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/index.js ./
COPY --from=builder /build/package.json ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
