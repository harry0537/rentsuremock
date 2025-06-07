# RentSure - Smart Property Management Platform

RentSure is a modern, cloud-based property management platform that streamlines the rental process for landlords and tenants. Built with Next.js, TypeScript, and Tailwind CSS, it offers a seamless experience for managing properties, maintenance requests, and tenant communications.

## 🌟 Key Features

### For Landlords
- **Property Management Dashboard**
  - Overview of all properties
  - Maintenance request tracking
  - Financial analytics
  - Tenant communication hub

- **Maintenance Management**
  - Real-time maintenance request tracking
  - Calendar view for scheduling
  - Cost tracking and budgeting
  - Vendor management

- **Tenant Portal**
  - Secure document storage
  - Maintenance request submission
  - Payment tracking
  - Communication tools

### For Tenants
- **Easy Maintenance Requests**
  - Photo upload capability
  - Real-time status updates
  - Communication with landlords
  - Maintenance history

- **Document Management**
  - Lease agreements
  - Maintenance records
  - Payment history
  - Important notices

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Email Service**: SendGrid
- **Deployment**: Vercel

## 🛠️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/harry0537/rentsuremock.git
   cd rentsure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   SENDGRID_API_KEY=your_sendgrid_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Demo Access

For demo purposes, you can use these test accounts:

**Landlord Account:**
- Email: demo@rentsure.com
- Password: Demo@123

**Tenant Account:**
- Email: tenant@rentsure.com
- Password: Demo@123

## 🔒 Security Features

- End-to-end encryption for sensitive data
- Role-based access control
- Secure file storage
- Regular security audits
- GDPR compliance

## 📈 Business Model

RentSure operates on a subscription-based model:
- Basic Plan: $29/month per property
- Professional Plan: $49/month per property
- Enterprise Plan: Custom pricing

## 🎯 Future Roadmap

- Mobile applications (iOS & Android)
- AI-powered maintenance prediction
- Blockchain-based lease agreements
- Integration with smart home devices
- Advanced analytics dashboard

## 🤝 Contact

For business inquiries or demo requests:
- Email: contact@rentsure.com
- Website: https://rentsure.com
- LinkedIn: [RentSure](https://linkedin.com/company/rentsure)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 