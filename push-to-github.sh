#!/bin/bash
# GitHub Push Script for Capstone2

echo "╔════════════════════════════════════════╗"
echo "║   Capstone2 - GitHub Push Script      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found!"
    echo "Initialize with: git init"
    exit 1
fi

# Show current status
echo "📊 Current Status:"
echo "─────────────────"
git status --short | wc -l | xargs echo "   Files changed:"
echo ""

# Verify no sensitive files
echo "🔐 Security Check:"
echo "──────────────────"
if git ls-files | grep -E "\.env|\.key|secret"; then
    echo "❌ Sensitive files found! Do not push!"
    exit 1
else
    echo "   ✅ No .env or secret files tracked"
fi
echo ""

# Show what will be pushed
echo "📦 Files to be pushed:"
echo "──────────────────────"
git status --short | head -20
echo ""

# Ask for confirmation
read -p "Proceed with push? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 1
fi

# Stage all changes
echo ""
echo "📝 Staging files..."
git add -A
echo "✅ Files staged"
echo ""

# Create commit
echo "💬 Creating commit..."
git commit -m "Capstone2: RBAC implementation with HRD role, enhanced task management, and comprehensive testing

- Implemented JWT authentication with secure .env configuration
- Added role-based access control (5 roles: admin, hrd, manager, supervisor, worker)
- Created HRD dashboard for employee management
- Enhanced task management with priority, due dates, and completion tracking
- Added comprehensive API endpoints with role-based filtering
- Created 5 role-specific dashboards in Android frontend
- Implemented full testing suite (10 API tests, all passing)
- Added database seeding script with 6 test users
- Created comprehensive documentation (10 guides)
- All security vulnerabilities fixed"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║        ✅ PUSH SUCCESSFUL!             ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "Your project is now on GitHub!"
    echo "View it at: https://github.com/[your-org]/capstone2"
else
    echo ""
    echo "❌ Push failed. Check your connection and try again."
    exit 1
fi
