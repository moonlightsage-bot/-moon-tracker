#!/bin/bash

# 🌙 MoonlightSage Moon Tracker - Deployment Script
# Automates testing, building, and deployment to Vercel

set -e  # Exit on error

echo "🌙 MoonlightSage Moon Tracker - Deployment Script"
echo "=================================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the moon-tracker directory"
    exit 1
fi

# Function to print colored status
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Test build locally"
echo "2) Build and preview locally"
echo "3) Deploy to Vercel (preview)"
echo "4) Deploy to Vercel (production)"
echo "5) Full workflow (test, build, deploy)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        print_status "Running local build test..."
        ;;
    2)
        print_status "Building and starting preview server..."
        ;;
    3)
        print_status "Deploying to Vercel (preview)..."
        ;;
    4)
        print_status "Deploying to Vercel (production)..."
        ;;
    5)
        print_status "Running full deployment workflow..."
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""

# Step 1: Check for node_modules
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed (skipping)"
fi

echo ""

# Step 2: Build
print_status "Building production version..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build successful!"
else
    print_error "Build failed"
    exit 1
fi

echo ""

# Check build output
if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    print_success "Build output: ${DIST_SIZE} in dist/ folder"
else
    print_error "dist/ folder not found after build"
    exit 1
fi

echo ""

# Additional actions based on choice
if [ "$choice" == "2" ]; then
    print_status "Starting preview server..."
    echo ""
    print_warning "Preview will open at http://localhost:4173"
    print_warning "Press Ctrl+C to stop the server"
    echo ""
    npm run preview
    exit 0
fi

if [ "$choice" == "3" ] || [ "$choice" == "4" ] || [ "$choice" == "5" ]; then
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    fi
    
    echo ""
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel"
        print_status "Please log in to Vercel..."
        vercel login
    fi
    
    echo ""
    
    # Deploy
    if [ "$choice" == "3" ] || [ "$choice" == "5" ]; then
        print_status "Deploying to Vercel (preview)..."
        vercel
        print_success "Preview deployment complete!"
        echo ""
        print_warning "To promote this to production, run:"
        echo "  vercel --prod"
    fi
    
    if [ "$choice" == "4" ]; then
        print_status "Deploying to Vercel (production)..."
        vercel --prod
        print_success "Production deployment complete!"
        echo ""
        print_success "Your Moon Tracker is live! 🌕✨"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Deployment workflow complete!"
echo ""
echo "📋 Helpful Commands:"
echo "  • Test locally:      npm run dev"
echo "  • Build:             npm run build"
echo "  • Preview build:     npm run preview"
echo "  • Deploy preview:    vercel"
echo "  • Deploy prod:       vercel --prod"
echo "  • View logs:         vercel logs"
echo "  • Rollback:          vercel rollback"
echo ""
echo "📚 Documentation:"
echo "  • Full Guide:        VERCEL_DEPLOYMENT_GUIDE.md"
echo "  • Quick Checklist:   DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🌙 The Moon awaits your seekers! ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
