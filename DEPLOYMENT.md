# 🚀 RentSure Deployment Guide

This guide covers deploying the RentSure rental property platform to production.

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Git repository
- Domain name (for production)
- Email service (optional but recommended)

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=RentSure
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentsure
MONGODB_DB=rentsure

# Authentication
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

### Optional Environment Variables

```bash
# Email (Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all required variables from the list above

3. **Custom Domain**
   - Add your domain in Vercel Dashboard > Domains
   - Configure DNS records as instructed

### Netlify

1. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set environment variables in Site Settings
   - Deploy from main branch

### Railway

1. **Deploy**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway deploy
   ```

### DigitalOcean App Platform

1. **App Spec**
   ```yaml
   name: rentsure
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/rentsure
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Configure network access (0.0.0.0/0 for all IPs)

2. **Create User**
   - Go to Database Access
   - Create new user with read/write permissions
   - Note the username and password

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/rentsure?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Connection string
mongodb://localhost:27017/rentsure
```

## 📧 Email Configuration

### Gmail SMTP

1. **Enable 2FA** on your Google account
2. **Generate App Password**
   - Google Account Settings > Security > 2-Step Verification > App passwords
   - Generate password for "Mail"

3. **Configure**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### SendGrid

1. **Create Account** at [SendGrid](https://sendgrid.com)
2. **Generate API Key**
3. **Configure**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

## 🖼️ File Upload Setup (Cloudinary)

1. **Create Account** at [Cloudinary](https://cloudinary.com)
2. **Get Credentials** from Dashboard
3. **Create Upload Preset**
   - Settings > Upload > Upload presets
   - Create unsigned preset
   - Configure folder and transformations

## 🔒 Security Checklist

### Environment Security
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Restrict CORS origins
- [ ] Enable HTTPS only
- [ ] Set secure headers

### Database Security
- [ ] Use MongoDB authentication
- [ ] Restrict network access
- [ ] Regular backups
- [ ] Monitor connections

### Application Security
- [ ] Input validation (Zod schemas)
- [ ] Rate limiting
- [ ] Error handling
- [ ] Security headers

## 📊 Monitoring & Analytics

### Error Monitoring (Sentry)

1. **Create Project** at [Sentry](https://sentry.io)
2. **Get DSN** from project settings
3. **Configure**
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### Analytics (Google Analytics)

1. **Create Property** at [Google Analytics](https://analytics.google.com)
2. **Get Tracking ID**
3. **Configure**
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

## 🚀 Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### CDN Setup

1. **Cloudflare** (Recommended)
   - Add domain to Cloudflare
   - Enable caching and minification
   - Configure SSL

2. **Vercel Edge Network** (if using Vercel)
   - Automatically enabled
   - Global CDN included

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Testing Before Production

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection working
- [ ] Email sending functional
- [ ] File uploads working
- [ ] Search functionality operational
- [ ] Authentication flow tested
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Error handling tested
- [ ] SEO meta tags configured

### Load Testing

```bash
# Install k6
npm install -g k6

# Run load test
k6 run load-test.js
```

## 🔧 Maintenance

### Regular Tasks

1. **Database Backup**
   ```bash
   mongodump --uri="$MONGODB_URI" --out backup/
   ```

2. **Update Dependencies**
   ```bash
   npm audit
   npm update
   ```

3. **Monitor Performance**
   - Check Vercel Analytics
   - Review Sentry errors
   - Monitor database performance

### Scaling Considerations

- **Horizontal Scaling**: Multiple app instances
- **Database Sharding**: For large datasets
- **CDN Caching**: Static assets and images
- **Redis Caching**: Session and API responses

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify Node.js version
   - Clear cache: `npm run clean`

2. **Database Connection**
   - Verify MongoDB URI
   - Check network access
   - Test connection locally

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check spam folders
   - Test with email service directly

4. **Images Not Loading**
   - Verify Cloudinary configuration
   - Check upload preset settings
   - Test file size limits

### Support

- GitHub Issues: [Report bugs and issues](https://github.com/your-repo/issues)
- Documentation: [Full documentation](https://docs.rentsure.com)
- Community: [Discord/Slack community](https://discord.gg/rentsure)

---

## 🎉 Deployment Complete!

Your RentSure platform should now be live and fully functional. Monitor the application for the first few days and be ready to address any issues that arise.

For additional support and advanced configurations, refer to the [Advanced Deployment Guide](ADVANCED_DEPLOYMENT.md). 