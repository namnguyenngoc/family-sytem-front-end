# step 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
# Inject biến tại build-time
ARG NEXT_PUBLIC_GRAPHQL_URI
ENV NEXT_PUBLIC_GRAPHQL_URI=$NEXT_PUBLIC_GRAPHQL_URI

RUN yarn install && yarn build

# step 2: run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 30901
CMD ["npx", "next", "start", "-p", "30901"]

# docker build -t itnguyennam276/fsys-frontend-app:latest .