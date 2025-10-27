FROM node:22.20.0-alpine3.22 
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY next.config.ts next.config.ts
COPY postcss.config.mjs postcss.config.mjs
COPY tsconfig.json tsconfig.json
COPY public ./public
COPY src ./src
COPY .env* .env

CMD [ "npm", "run", "dev" ]