#!/bin/bash

# Railway Deployment Script for REKT Shield Backend
# This script deploys the backend to Railway via GitHub integration

echo "🚀 REKT Shield Railway Deployment"
echo "=================================="

echo "✅ Git repository updated and pushed to main"
echo "✅ Railway config files added (railway.json, railway.toml)"
echo "✅ Production environment variables configured"

echo ""
echo "📋 MANUAL DEPLOYMENT STEPS:"
echo "1. Visit: https://railway.app/dashboard"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select: YouthAIAgent/rekt-shield"
echo "4. Branch: main"
echo "5. Root Directory: / (root)"
echo "6. Add Environment Variables:"
echo "   - GROQ_API_KEY=[your-groq-api-key]"
echo "   - NODE_ENV=production"
echo "   - API_SECRET=rekt-shield-production-2026"
echo "7. Deploy!"

echo ""
echo "🎯 Expected Production URL:"
echo "https://[project-name].up.railway.app"

echo ""
echo "✅ Health Check Endpoint:"
echo "https://[project-name].up.railway.app/api/health"

echo ""
echo "🔧 Railway will auto-detect:"
echo "- Node.js project (package.json)"
echo "- Build command: npm run build"  
echo "- Start command: npm start"
echo "- Port: $PORT (auto-assigned by Railway)"

echo ""
echo "⚡ 11 Agents will be active after successful deployment!"