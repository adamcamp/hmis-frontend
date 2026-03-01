# Build stage
FROM node:20.19.5 as builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (HUSKY=0 skips git hooks setup which fails without a .git dir)
RUN HUSKY=0 yarn install --frozen-lockfile

# Copy source
COPY . .

# Build for production
RUN yarn build

# Runtime stage - use nginx to serve built assets
FROM nginx:alpine

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
