# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production=false

# COPY . .
# RUN npx prisma generate
# RUN npm run build

# EXPOSE 3001

# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
# CMD ["node", "dist/main"]
CMD ["sh", "-c", "echo DATABASE_URL=$DATABASE_URL && node dist/main"]