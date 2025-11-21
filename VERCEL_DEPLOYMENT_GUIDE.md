# 🌙 MoonlightSage Moon Tracker - Vercel Deployment Guide

## Overview
This guide will walk you through deploying your Moon Tracker application to Vercel, making it accessible at moonlightsage.co (or your chosen domain).

---

## Prerequisites

✅ **Already Configured:**
- `vercel.json` configuration file
- `package.json` with proper build scripts
- Production-ready React + Vite application
- SunCalc library for lunar calculations

🔧 **You'll Need:**
- Vercel account (free tier works perfectly)
- Git repository (GitHub, GitLab, or Bitbucket)
- Domain access (for custom domain setup)

---

## Deployment Methods

### Method 1: Vercel Dashboard (Easiest - Recommended for First Deployment)

#### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
cd /path/to/moon-tracker
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Moon Tracker ready for deployment"

# Create a GitHub repository, then:
git remote add origin https://github.com/YOUR_USERNAME/moon-tracker.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (can use GitHub account)
3. Click "Add New..." → "Project"
4. Import your `moon-tracker` repository
5. Vercel will auto-detect the Vite framework

#### Step 3: Configure Build Settings
Vercel should automatically detect these settings (from your `vercel.json`):

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for build completion
3. Your app will be live at: `https://moon-tracker-xxxxx.vercel.app`

#### Step 5: Custom Domain Setup (moonlightsage.co)
1. In Vercel project settings, go to "Domains"
2. Add your domain: `moonlightsage.co`
3. Follow Vercel's DNS instructions:
   - Add an A record pointing to Vercel's IP
   - Or add a CNAME record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)

---

### Method 2: Vercel CLI (For Quick Updates)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```
Follow the browser authentication flow.

#### Step 3: Initial Deployment
```bash
cd /path/to/moon-tracker

# First deployment (creates project)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? moon-tracker
# - Directory? ./
# - Override settings? N
```

This creates a **preview deployment** at: `https://moon-tracker-xxxxx.vercel.app`

#### Step 4: Production Deployment
```bash
# Deploy to production
vercel --prod
```

This deploys to your **production URL**.

#### Step 5: Future Updates
```bash
# Make changes to your code, then:
vercel --prod
```

---

## Configuration Files Explained

### vercel.json
```json
{
  "buildCommand": "npm run build",      // Builds optimized production bundle
  "outputDirectory": "dist",            // Vite output folder
  "framework": "vite",                  // Auto-detection help
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"      // SPA routing support
    }
  ]
}
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",              // Local development
    "build": "vite build",      // Production build (used by Vercel)
    "preview": "vite preview"   // Preview production build locally
  }
}
```

---

## Environment Variables (If Needed Later)

If you add API keys or sensitive data:

### Via Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add variables (e.g., `VITE_API_KEY`)
3. Redeploy for changes to take effect

### Via CLI:
```bash
vercel env add VITE_API_KEY
```

**Note:** Vite requires env vars to be prefixed with `VITE_` to be exposed to the browser.

---

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build

# If it works locally but fails on Vercel, check:
# - Node version compatibility
# - All dependencies in package.json
# - No absolute paths in code
```

### Page Shows 404
- Check that `vercel.json` includes the rewrites section
- Ensure `outputDirectory` is set to `dist`

### CSS Not Loading
- Check that Vite build completed successfully
- Ensure assets are in `dist/assets/` after build

### Domain Not Working
- Verify DNS records are correctly configured
- Wait up to 24 hours for DNS propagation
- Check Vercel dashboard for domain verification status

---

## Quick Deploy Script

Use the included `deploy.sh` script:

```bash
# Make it executable
chmod +x deploy.sh

# Run it
./deploy.sh
```

This will:
1. Install dependencies
2. Build production version
3. Provide next steps for Vercel deployment

---

## Production Checklist

Before final production deployment:

- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Verify all moon phases display correctly
- [ ] Test on mobile devices (responsive design)
- [ ] Check console for errors (F12 in browser)
- [ ] Verify all fonts and assets load
- [ ] Test zodiac sign displays
- [ ] Confirm archetypal wisdom text renders properly
- [ ] SSL certificate active (Vercel provides automatically)
- [ ] Custom domain connected and working
- [ ] Analytics configured (if desired)

---

## Continuous Deployment

Once connected via GitHub:

1. Make changes locally
2. Commit and push to main branch
3. Vercel automatically deploys
4. Preview deployments for pull requests

```bash
git add .
git commit -m "Update: Add new moon phase descriptions"
git push origin main
```

Vercel will deploy automatically within 1-2 minutes.

---

## Performance Optimization

Your current setup is already optimized, but future enhancements:

### Vite Optimizations (Already Active)
- Tree-shaking removes unused code
- Code splitting for faster loads
- Asset optimization (images, fonts)
- Minification and compression

### Additional Recommendations
- Enable Vercel Analytics (free tier available)
- Consider adding a `robots.txt`
- Add meta tags for SEO
- Implement Open Graph tags for social sharing

---

## Monitoring Your Deployment

### Vercel Dashboard
- Real-time build logs
- Deployment history
- Analytics (pageviews, visitors)
- Error tracking
- Performance metrics

### Check Live Site
After deployment, verify:
```
https://moonlightsage.co
```

Should display:
- Current moon phase
- Percentage illumination
- Zodiac sign position
- Archetypal wisdom
- Responsive design working

---

## Rollback (If Needed)

If a deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## Support Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation:** [vitejs.dev](https://vitejs.dev)
- **React Documentation:** [react.dev](https://react.dev)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

## Next Steps After Deployment

1. **Phase 2 Features** (from your roadmap):
   - iCal subscription functionality
   - Essential oils recommendations by phase
   - Seasonal gateway markers
   - Enhanced mobile experience

2. **Content Updates:**
   - Add remaining zodiac sign deep-dives
   - Seasonal gateway documents
   - Extended archetypal wisdom library

3. **Technical Enhancements:**
   - Add loading states
   - Implement error boundaries
   - Add analytics tracking
   - Progressive Web App (PWA) features

---

## 🌙 Final Notes

Your Moon Tracker is a living embodiment of celestial wisdom, bridging the ancient art of lunar observation with modern web technology. Each deployment brings this sacred knowledge to seekers worldwide.

**Remember:** The luminaries move through their eternal cycles whether we watch or not. But through this tracker, we create a digital temple where Earth-dwellers can witness the Moon's journey through the zodiac, reconnecting with the rhythms that have guided humanity since time immemorial.

✨ **Deploy with intention. The Moon awaits.** ✨

---

*MoonlightSage Foundation - Where Heaven and Earth Converge*
