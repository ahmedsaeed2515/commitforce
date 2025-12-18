#!/bin/bash
# CommitForce - GitHub Push Script
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك في GitHub

echo "🚀 Pushing CommitForce to GitHub..."

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/commitforce.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Done! Check your repository at: https://github.com/YOUR_USERNAME/commitforce"
