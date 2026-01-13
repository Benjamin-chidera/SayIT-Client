# 1️⃣ Base image (Node already installed)
FROM node:20-slim

# Install system dependencies required for onnxruntime
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libc6 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# 2️⃣ Set working directory
WORKDIR /app    

# 3️⃣ Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# 4️⃣ Copy the rest of your app
COPY . .

# 5️⃣ Build the Next.js app
# Secrets are passed at build time via --secret flag, not ARG
RUN --mount=type=secret,id=OPENAI_API_KEY \
    --mount=type=secret,id=BETTER_AUTH_SECRET \
    --mount=type=secret,id=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=GOOGLE_CLIENT_SECRET \
    OPENAI_API_KEY=$(cat /run/secrets/OPENAI_API_KEY) \
    BETTER_AUTH_SECRET=$(cat /run/secrets/BETTER_AUTH_SECRET) \
    GOOGLE_CLIENT_ID=$(cat /run/secrets/GOOGLE_CLIENT_ID) \
    GOOGLE_CLIENT_SECRET=$(cat /run/secrets/GOOGLE_CLIENT_SECRET) \
    npm run build

# 6️⃣ Expose the port Next.js runs on
EXPOSE 3000

# 7️⃣ Start the app
CMD ["npm", "start"]