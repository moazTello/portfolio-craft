FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/

EXPOSE 3001

CMD ["node", "dist/src/main"]