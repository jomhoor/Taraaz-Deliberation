# ---- Dependencies (production only) ----
FROM node:22.22.0-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace-docker.yaml ./pnpm-workspace.yaml
COPY patches ./patches
RUN pnpm install --frozen-lockfile --prod

# ---- Build ----
FROM node:22.22.0-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace-docker.yaml ./pnpm-workspace.yaml
COPY patches ./patches
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

# ---- Production ----
FROM node:22.22.0-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    tini \
    chromium \
    fonts-freefont-ttf \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 \
    libxtst6 libnss3 libcups2 libxrandr2 libasound2 libatk1.0-0 \
    libatk-bridge2.0-0 libpangocairo-1.0-0 libgtk-3-0 libgbm1 \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY src/assets ./dist/assets
COPY package.json esm-loader-lodash-fix.mjs ./
RUN chown -R node:node /app
USER node
EXPOSE 8080
ENTRYPOINT ["tini", "--"]
CMD ["node", "--loader", "esm-module-alias/loader", "--loader", "./esm-loader-lodash-fix.mjs", "--no-warnings", "dist/index.js"]
