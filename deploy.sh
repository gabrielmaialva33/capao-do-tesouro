#!/bin/bash

# Capão do Tesouro - Deploy Script
# Deploys the application to the production server

set -e  # Exit on error

# Configuration
SERVER_USER="root"
SERVER_HOST="162.12.204.30"
SERVER_PATH="/opt/capao-do-tesouro"
CONTAINER_NAME="capao-app"
IMAGE_NAME="capao-do-tesouro"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Capão do Tesouro - Deploy Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Check if .env.production exists
echo -e "\n${YELLOW}[1/7]${NC} Checking environment configuration..."
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production not found!${NC}"
    echo "Please create .env.production with your Firebase credentials"
    exit 1
fi
echo -e "${GREEN}✓ Environment file found${NC}"

# Step 2: Build locally to verify (optional but recommended)
echo -e "\n${YELLOW}[2/7]${NC} Building application locally..."
pnpm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Local build successful${NC}"
else
    echo -e "${RED}✗ Local build failed${NC}"
    exit 1
fi

# Step 3: Create deployment package
echo -e "\n${YELLOW}[3/7]${NC} Creating deployment package..."
DEPLOY_FILES=(
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
    ".dockerignore"
    ".env.production"
    "package.json"
    "pnpm-lock.yaml"
    "tsconfig.json"
    "tsconfig.app.json"
    "vite.config.ts"
    "tailwind.config.js"
    "postcss.config.js"
    "index.html"
    "src"
    "public"
)

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Temporary directory: $TEMP_DIR"

# Copy files to temp directory
for file in "${DEPLOY_FILES[@]}"; do
    if [ -e "$file" ]; then
        cp -r "$file" "$TEMP_DIR/"
    fi
done

# Rename .env.production to .env in temp directory
cp .env.production "$TEMP_DIR/.env"

echo -e "${GREEN}✓ Deployment package created${NC}"

# Step 4: Create archive
echo -e "\n${YELLOW}[4/7]${NC} Creating deployment archive..."
tar -czf capao-deploy.tar.gz -C "$TEMP_DIR" .
echo -e "${GREEN}✓ Archive created: capao-deploy.tar.gz${NC}"

# Step 5: Transfer to server
echo -e "\n${YELLOW}[5/7]${NC} Transferring files to server..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
scp capao-deploy.tar.gz ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Files transferred successfully${NC}"
else
    echo -e "${RED}✗ File transfer failed${NC}"
    rm -rf "$TEMP_DIR"
    rm capao-deploy.tar.gz
    exit 1
fi

# Step 6: Extract and deploy on server
echo -e "\n${YELLOW}[6/7]${NC} Deploying on server..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'EOF'
    cd /opt/capao-do-tesouro

    echo "Extracting files..."
    tar -xzf capao-deploy.tar.gz
    rm capao-deploy.tar.gz

    echo "Stopping existing container..."
    docker-compose down 2>/dev/null || true

    echo "Building Docker image..."
    docker-compose build --no-cache

    echo "Starting container..."
    docker-compose up -d

    echo "Cleaning up old images..."
    docker image prune -f

    echo "Deployment complete!"
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    rm -rf "$TEMP_DIR"
    rm capao-deploy.tar.gz
    exit 1
fi

# Step 7: Verify deployment
echo -e "\n${YELLOW}[7/7]${NC} Verifying deployment..."
sleep 5  # Wait for container to start

ssh ${SERVER_USER}@${SERVER_HOST} "docker ps | grep ${CONTAINER_NAME}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container is running${NC}"
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deployment completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "\nApplication URL: ${YELLOW}http://${SERVER_HOST}:8080${NC}"
else
    echo -e "${RED}✗ Container is not running${NC}"
    echo "Check logs with: ssh ${SERVER_USER}@${SERVER_HOST} 'docker logs ${CONTAINER_NAME}'"
fi

# Cleanup
echo -e "\n${YELLOW}Cleaning up local files...${NC}"
rm -rf "$TEMP_DIR"
rm capao-deploy.tar.gz
echo -e "${GREEN}✓ Cleanup complete${NC}"

echo -e "\n${GREEN}Done!${NC}"
