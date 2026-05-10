FROM node:18-alpine

RUN apk add --no-cache openssl chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/src/main"]