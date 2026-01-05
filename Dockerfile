# Base image: Kali Linux (Rolling) for authentic tools, or Ubuntu with manual install.
# Kali is heavy but includes everything. Ubuntu is lighter.
# Let's use a standard Node.js image based on Debian/Ubuntu so we can install tools easily.
FROM node:18-bullseye

# Set environment variables
ENV PORT=3000

# Install basic security tools and dependencies
RUN apt-get update && apt-get install -y \
    nmap \
    python3 \
    python3-pip \
    net-tools \
    iputils-ping \
    curl \
    wget \
    git \
    vim \
    nano \
    # Add sqlmap from git or apt if available (often requires kali repos or manual git clone)
    && rm -rf /var/lib/apt/lists/*

# Install SQLMap manually (lightweight)
RUN git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git /opt/sqlmap
ENV PATH="/opt/sqlmap:${PATH}"

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including production ones)
RUN npm install

# Copy source code
COPY . .

# Build the frontend (React)
RUN npm run build

# Set production environment for runtime
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Run the server (this runs the Node.js backend which serves the React app and handles API)
# IMPORTANT: Adjust 'start' script in package.json to run the production server
CMD ["npm", "start"]
