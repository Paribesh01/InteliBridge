FROM node

WORKDIR /app

RUN npm install -g turbo

RUN npm install -g ts-node 

RUN npm install -g typescript

RUN npm install -g tsx

COPY . .

RUN npm install
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

RUN npm run build


EXPOSE 3000 8081 5173 5174 3232 8000

# add db push here
CMD ["sh", "-c", "npm run db:push && npm run dev"]
