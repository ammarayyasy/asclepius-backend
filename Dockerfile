FROM node:18

# Set working directory
WORKDIR /backend

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh proyek ke dalam image
COPY . .

# Set variabel lingkungan untuk kredensial Google Cloud
ENV GOOGLE_APPLICATION_CREDENTIALS=/backend/credentials.json

# Expose port aplikasi
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["node", "index.js"]
