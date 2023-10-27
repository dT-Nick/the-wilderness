# base node image
FROM node:18-bookworm-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y fuse3 openssl ca-certificates

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV FLY="true"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/public /myapp/public

ADD . .

CMD ["npm", "run", "start"]
