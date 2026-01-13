# 1️⃣ Base image (Node already installed)
FROM node:20-alpine

    # 2️⃣ Set working directory
WORKDIR /app    

# 3️⃣ Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 5️⃣ Copy the rest of your app
COPY . .

# 6️⃣ Build the Next.js app
RUN npm run build

# 7️⃣ Expose the port Next.js runs on
EXPOSE 3000

# 8️⃣ Start the app
CMD ["npm", "start"]