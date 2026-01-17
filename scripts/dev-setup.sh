#!/bin/bash

# VitalOps Development Setup Script
# This script automates the setup process for development

set -e  # Exit on error

echo "🚀 VitalOps Development Setup"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL CLI not found${NC}"
    echo "Make sure PostgreSQL is installed or use Supabase"
else
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
fi

echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""

# Setup backend
echo "⚙️  Setting up backend..."
cd apps/backend-api

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit apps/backend-api/.env with your database credentials${NC}"
    echo "Press Enter after you've configured the .env file..."
    read
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

cd ../..

echo ""
echo -e "${GREEN}✨ Setup completed successfully!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Start backend:    npm run backend"
echo "2. Start admin web:  npm run admin"
echo "3. Start mobile app: npm run mobile"
echo ""
echo "🔑 Default credentials:"
echo "   Admin:      admin@vitalops.com / admin123"
echo "   Manager:    manager@vitalops.com / manager123"
echo "   Technician: tech@vitalops.com / tech123"
echo ""
echo "🌐 URLs:"
echo "   Backend API: http://localhost:5000"
echo "   Admin Web:   http://localhost:3000"
echo "   Health:      http://localhost:5000/health"
echo ""
echo "Happy coding! 🎉"



