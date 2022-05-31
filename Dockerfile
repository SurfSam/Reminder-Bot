FROM node:latest

WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .

# Start the bot.
CMD ["node", "main.js"]