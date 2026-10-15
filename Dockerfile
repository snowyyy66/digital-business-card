FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@11.25.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN sed -i 's/\r$//' scripts/start-container.sh \
    && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/digital_card?schema=public" pnpm prisma:generate \
    && pnpm build

EXPOSE 3000
CMD ["sh", "scripts/start-container.sh"]
