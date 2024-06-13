FROM node:21-bookworm AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /echo-server-ui

COPY package.json package-lock.json* ./

RUN npm ci

COPY app ./app
COPY components ./components
COPY public ./public

COPY next.config.mjs .
COPY next-env.d.ts .

COPY postcss.config.js .
COPY tailwind.config.ts .
COPY tsconfig.json .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL
ENV NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL=${NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

ENV NODE_ENV=production

COPY --from=builder /echo-server-ui/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /echo-server-ui/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /echo-server-ui/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL
ENV NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL=${NEXT_PUBLIC_ECHO_SERVER_API_BASE_URL}

# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

ENV PORT 3000
ENV HOSTNAME 0.0.0.0
CMD ["node", "server.js"]