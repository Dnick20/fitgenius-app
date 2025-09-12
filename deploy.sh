#!/bin/bash

# FitGenius Deployment Script
# Usage: ./deploy.sh https://github.com/USERNAME/REPO_NAME.git

if [ -z "$1" ]; then
    echo "❌ Please provide your GitHub repository URL"
    echo "Usage: ./deploy.sh https://github.com/USERNAME/REPO_NAME.git"
    exit 1
fi

REPO_URL=$1

echo "🚀 Setting up GitHub remote and pushing FitGenius..."
echo ""

# Add remote origin
echo "📡 Adding GitHub remote..."
git remote add origin $REPO_URL

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: $REPO_URL"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Import your GitHub repository"
    echo "4. Vercel will auto-detect Vite settings"
    echo "5. Click 'Deploy'"
    echo ""
    echo "🎉 Your FitGenius app with glass design will be live!"
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your repository URL and permissions"
fi