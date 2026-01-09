# Use Node.js 18 LTS Alpine image for smaller size
FROM node:18-alpine AS base

# Install security updates and necessary packages
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create app directory with proper permissions
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Dependencies stage
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev && npm cache clean --force; \
    else \
      npm install --omit=dev && npm cache clean --force; \
    fi

# Build stage (for any build steps if needed)
FROM base AS build

# Accept build cache buster argument
ARG CACHE_BUST=1

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies if needed)
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Copy application source code
COPY . .

# ✨ CRITICAL: Add cache buster to force fresh code copy
RUN echo "Cache bust: ${CACHE_BUST}" > /tmp/cache-bust.txt

# Production stage
FROM base AS production

# Set default environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=5001
ENV RATE_LIMIT_WINDOW_MS=900000
ENV RATE_LIMIT_MAX_REQUESTS=100

# Note: The following environment variables should be set at runtime via CapRover:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - JWT_EXPIRES_IN
# - JWT_REFRESH_EXPIRES_IN
# - CLIENT_URL

# Copy production dependencies from dependencies stage
COPY --from=dependencies --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy application files from build stage
COPY --from=build --chown=nodeuser:nodejs /app/server.js ./
COPY --from=build --chown=nodeuser:nodejs /app/package.json ./
COPY --from=build --chown=nodeuser:nodejs /app/config ./config
COPY --from=build --chown=nodeuser:nodejs /app/middleware ./middleware
COPY --from=build --chown=nodeuser:nodejs /app/models ./models
COPY --from=build --chown=nodeuser:nodejs /app/routes ./routes
COPY --from=build --chown=nodeuser:nodejs /app/utils ./utils

# Remove unnecessary files for production
RUN rm -rf \
    .git \
    .gitignore \
    .env.example \
    *.md \
    .dockerignore \
    Dockerfile \
    create_test_users.js \
    seed.js

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 5001

# ✅ HEALTH CHECK - Check localhost inside container
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
