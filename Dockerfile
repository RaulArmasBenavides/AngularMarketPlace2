# Frontend Angular 21 con SSR (Angular SSR + Express).
# Build en una etapa y runtime mínimo en otra.

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist/my-app ./dist/my-app
EXPOSE 4000
# NG_ALLOWED_HOSTS: hosts por los que se acepta la petición (Host header). Ajustar al dominio real.
ENV NG_ALLOWED_HOSTS=localhost,127.0.0.1
CMD ["node", "dist/my-app/server/server.mjs"]
