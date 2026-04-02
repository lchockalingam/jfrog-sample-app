# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

COPY app/package*.json ./
# When using JFrog as npm registry, npm install resolves from Artifactory:
#   npm config set registry https://<INSTANCE>.jfrog.io/artifactory/api/npm/<REPO>/
RUN npm ci --omit=dev

COPY app/ .

# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

LABEL org.opencontainers.image.title="jfrog-sample-app"
LABEL org.opencontainers.image.description="Sample app for JFrog platform trial"
LABEL org.opencontainers.image.version="1.0.0"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Copy only production dependencies + source
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/index.js ./
COPY --from=builder /build/package.json ./

# Non-root user for security scanning demo (Xray checks for this)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
