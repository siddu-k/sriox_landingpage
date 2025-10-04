# Sriox.com Domain Deployment Guide

## 🌐 Domain Setup for sriox.com

### **Prerequisites:**
- ✅ Domain purchased and owned: `sriox.com`
- ✅ Website files ready in this repository
- ✅ SEO optimized for sriox.com domain

### **Deployment Options:**

#### **Option 1: Traditional Web Hosting (Recommended)**
1. **Choose a Web Host:**
   - Bluehost, SiteGround, HostGator, or similar
   - Ensure they support static websites and SSL certificates

2. **Upload Files:**
   - Upload all files from this repository to your hosting root directory
   - Maintain the exact folder structure
   - Ensure `index.html` is in the root directory

3. **Configure Domain:**
   - Point your domain nameservers to your hosting provider
   - Set up SSL certificate (most hosts provide free SSL)
   - Configure any necessary redirects (www to non-www or vice versa)

#### **Option 2: GitHub Pages with Custom Domain**
1. **Enable GitHub Pages:**
   - Repository Settings → Pages → Deploy from branch `main`
   
2. **Add Custom Domain:**
   - In Pages settings, add `sriox.com` as custom domain
   - GitHub will create a `CNAME` file automatically

3. **Configure DNS:**
   - Add CNAME record: `www.sriox.com` → `siddu-k.github.io`
   - Add A records for `sriox.com` pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

#### **Option 3: Netlify (Easy & Fast)**
1. **Connect Repository:**
   - Sign up at netlify.com
   - Connect your GitHub repository
   - Set build command: (leave empty for static sites)
   - Set publish directory: `/` (root)

2. **Configure Custom Domain:**
   - In site settings, add `sriox.com` as custom domain
   - Follow Netlify's DNS configuration instructions
   - SSL certificate will be automatically provided

#### **Option 4: Vercel**
1. **Deploy from GitHub:**
   - Sign up at vercel.com
   - Import your GitHub repository
   - Automatic deployments on every push

2. **Add Custom Domain:**
   - Project settings → Domains → Add `sriox.com`
   - Configure DNS as instructed by Vercel

### **DNS Configuration (General):**

#### **For Most Hosting Providers:**
```
Type    Name    Value                           TTL
A       @       [Your hosting IP address]       3600
CNAME   www     sriox.com                       3600
```

#### **For CDN/Static Hosting:**
```
Type    Name    Value                           TTL
A       @       [Provider's IP addresses]       3600
CNAME   www     [Provider's domain]             3600
```

### **Post-Deployment Checklist:**

#### **✅ Technical Verification:**
- [ ] Website loads at `https://sriox.com`
- [ ] All pages are accessible
- [ ] SSL certificate is active (🔒 green lock)
- [ ] Favicon displays correctly
- [ ] All images and assets load properly
- [ ] Forms work correctly
- [ ] Mobile responsiveness is maintained

#### **✅ SEO Verification:**
- [ ] Submit sitemap to Google Search Console: `https://sriox.com/sitemap.xml`
- [ ] Verify robots.txt is accessible: `https://sriox.com/robots.txt`
- [ ] Test social media sharing (Facebook, Twitter, LinkedIn)
- [ ] Verify structured data with Google's Rich Results Test
- [ ] Check page loading speed with Google PageSpeed Insights

#### **✅ Analytics Setup:**
- [ ] Install Google Analytics 4 (follow `SEO_SETUP_INSTRUCTIONS.html`)
- [ ] Set up Google Search Console for `sriox.com`
- [ ] Configure goal tracking for contact forms and job applications
- [ ] Set up conversion tracking for business inquiries

### **Performance Optimization:**

#### **Recommended CDN Setup:**
- **Cloudflare** (Free tier available):
  - Automatic SSL
  - Global CDN
  - DDoS protection
  - Performance optimization
  - Analytics

#### **Speed Optimizations:**
- Enable GZIP compression
- Set proper cache headers
- Optimize images (already done)
- Minify CSS/JS (optional for static sites)
- Use HTTP/2 (most modern hosts support this)

### **Security Recommendations:**

#### **SSL/HTTPS:**
- ✅ Force HTTPS redirects
- ✅ Set HSTS headers
- ✅ Use strong SSL ciphers

#### **Additional Security Headers:**
```
Content-Security-Policy: default-src 'self' https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### **Maintenance & Updates:**

#### **Regular Tasks:**
- Monitor website uptime
- Update sitemap when adding new pages
- Review and update SEO meta tags quarterly
- Check for broken links monthly
- Monitor Core Web Vitals performance
- Review analytics and adjust content strategy

#### **Content Updates:**
- Keep job listings current
- Update testimonials regularly
- Refresh service offerings as needed
- Maintain blog/news section (if added)

### **Support & Monitoring:**

#### **Recommended Tools:**
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Analytics:** Google Analytics 4, Google Search Console
- **Performance:** Google PageSpeed Insights, GTmetrix
- **SEO:** SEMrush, Ahrefs, or Moz (optional)

---

## 🚀 Quick Start Commands

### **If using hosting with cPanel/FTP:**
```bash
# Compress files for easy upload
zip -r sriox-website.zip . -x "*.git*" "node_modules/*"
# Upload and extract in hosting root directory
```

### **If using command line deployment:**
```bash
# Example for rsync deployment
rsync -avz --delete ./ user@yourserver.com:/path/to/web/root/
```

---

**🎯 Goal:** Professional, fast-loading website at `https://sriox.com` that ranks well in search engines and converts visitors into clients!

**📧 Need Help?** Most hosting providers offer free migration and setup assistance.