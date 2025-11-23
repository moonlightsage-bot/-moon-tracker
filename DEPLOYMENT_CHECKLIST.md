# 🌙 Moon Tracker - Quick Deployment Checklist

## Pre-Deployment (Do Once)

### 1. GitHub Repository Setup
```bash
cd moon-tracker
git init
git add .
git commit -m "Initial commit - Moon Tracker"
git remote add origin https://github.com/YOUR_USERNAME/moon-tracker.git
git push -u origin main
```

### 2. Vercel Account
- [ ] Create account at vercel.com
- [ ] Connect GitHub account
- [ ] Verify email

---

## First Deployment (Choose One Method)

### Option A: Dashboard (Easiest)
1. [ ] Go to vercel.com/dashboard
2. [ ] Click "Add New..." → "Project"
3. [ ] Import `moon-tracker` repository
4. [ ] Verify settings (auto-detected from vercel.json)
5. [ ] Click "Deploy"
6. [ ] Wait ~2 minutes
7. [ ] Visit your preview URL
8. [ ] Test all features

### Option B: CLI (Faster for Updates)
```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
cd moon-tracker
vercel           # Creates preview
vercel --prod    # Promotes to production
```

---

## Custom Domain Setup

### If You Own moonlightsage.co
1. [ ] Vercel Dashboard → Project → Domains
2. [ ] Add `moonlightsage.co`
3. [ ] Configure DNS (choose one):

**Option A: A Record**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP)
```

**Option B: CNAME**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

4. [ ] Wait for DNS propagation (5-60 min)
5. [ ] Verify SSL certificate (automatic)

---

## Testing Checklist

### Before Production Deploy
- [ ] Run `npm run build` locally (no errors)
- [ ] Test `npm run preview` (works in browser)
- [ ] Verify moon phase displays
- [ ] Check zodiac sign shows correctly
- [ ] Test on mobile device
- [ ] Check console (F12) - no errors
- [ ] Verify all fonts load
- [ ] Test archetypal wisdom text

### After Deployment
- [ ] Visit production URL
- [ ] Test on different devices
- [ ] Verify custom domain works
- [ ] Check HTTPS/SSL active
- [ ] Test all interactive elements
- [ ] Verify responsive design

---

## Future Updates Workflow

```bash
# 1. Make changes locally
# 2. Test
npm run dev

# 3. Commit
git add .
git commit -m "Description of changes"

# 4. Push (auto-deploys if GitHub connected)
git push origin main

# OR deploy via CLI
vercel --prod
```

---

## Emergency Rollback

If deployment breaks something:

**Via Dashboard:**
1. Vercel Dashboard → Deployments
2. Find last working version
3. "..." → "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

---

## Common Issues & Fixes

### Build Fails
```bash
# Test locally first
npm install
npm run build
```

### 404 on Routes
- Check `vercel.json` has rewrites section
- Verify `outputDirectory: "dist"`

### Assets Not Loading
- Run `npm run build` 
- Check `dist/` folder created
- Verify `dist/assets/` has files

### Domain Not Working
- Wait 24 hours for DNS
- Verify DNS records
- Check Vercel domain status

---

## Quick Commands Reference

```bash
# Local Development
npm run dev              # Start dev server
npm run build            # Test production build
npm run preview          # Preview production build

# Vercel Deployment
vercel                   # Deploy preview
vercel --prod            # Deploy production
vercel logs              # View deployment logs
vercel domains           # Manage domains
vercel env               # Manage environment variables
vercel rollback          # Rollback to previous deployment

# Git Workflow
git status               # Check changes
git add .                # Stage all changes
git commit -m "msg"      # Commit with message
git push origin main     # Push to GitHub (auto-deploys)
```

---

## Environment Variables (If Needed)

```bash
# Add via CLI
vercel env add VARIABLE_NAME

# Or via Dashboard
# Settings → Environment Variables → Add
```

**Note:** Prefix with `VITE_` for client-side access.

---

## Performance Monitoring

### Via Vercel Dashboard
- Real-time analytics
- Page load times
- Visitor statistics
- Build history
- Error tracking

### Enable Analytics (Optional)
1. Project Settings → Analytics
2. Enable Vercel Analytics
3. Add to your code (if desired):
```jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

---

## 🌙 Ready to Deploy?

### First Time
1. Choose your deployment method (Dashboard recommended)
2. Follow the steps above
3. Test thoroughly
4. Configure custom domain
5. Share with the world!

### Updates
1. Make changes
2. Test locally
3. Push to GitHub (auto-deploys)
4. Verify deployment

---

**The Moon is patient. Take your time to deploy with intention.** 🌕✨
