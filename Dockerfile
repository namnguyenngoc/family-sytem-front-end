# step 1: build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

# step 2: run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 30901
CMD ["yarn", "start"]

# docker build -t itnguyennam276/fsys-frontend-app:latest .