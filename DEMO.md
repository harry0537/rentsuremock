# RentSure Demo Guide

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables

3. Seed the database:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Flow

### 1. Introduction (2-3 minutes)
- Open the application at `http://localhost:3000`
- Show the landing page and key features
- Highlight the modern UI and responsive design

### 2. Authentication (1-2 minutes)
- Demonstrate the login page
- Show both landlord and tenant login flows
- Highlight the secure authentication system

### 3. Landlord Dashboard (3-4 minutes)
- Log in as landlord (demo@rentsure.com / Demo@123)
- Show property management features
- Demonstrate the maintenance request overview
- Highlight the analytics and statistics

### 4. Maintenance Management (4-5 minutes)
- Show the maintenance request list
- Demonstrate filtering and sorting
- Create a new maintenance request
- Show the image upload feature
- Demonstrate status updates and notifications

### 5. Tenant Experience (3-4 minutes)
- Log in as tenant (tenant@rentsure.com / Demo@123)
- Show the tenant dashboard
- Demonstrate submitting a maintenance request
- Show the communication features

### 6. Advanced Features (3-4 minutes)
- Show the calendar view
- Demonstrate the search functionality
- Show the notification system
- Highlight the email integration

### 7. Technical Highlights (2-3 minutes)
- Show the code structure
- Highlight the use of modern technologies
- Demonstrate the API endpoints
- Show the database schema

### 8. Future Roadmap (2-3 minutes)
- Discuss upcoming features
- Show the development timeline
- Highlight the scalability of the platform

## Demo Tips

1. **Preparation**
   - Test all features before the demo
   - Have backup demo accounts ready
   - Prepare screenshots of key features

2. **During Demo**
   - Keep the pace engaging
   - Focus on business value
   - Be ready to answer technical questions
   - Have a backup plan for technical issues

3. **Key Points to Highlight**
   - User-friendly interface
   - Real-time updates
   - Secure authentication
   - Scalable architecture
   - Mobile responsiveness
   - Integration capabilities

4. **Common Questions**
   - Security measures
   - Data privacy
   - Integration options
   - Customization possibilities
   - Pricing model
   - Support and maintenance

## Troubleshooting

If you encounter any issues during the demo:

1. **Database Issues**
   - Run `npm run seed` to reset the database
   - Check MongoDB connection

2. **Authentication Issues**
   - Clear browser cache
   - Check environment variables
   - Verify email configuration

3. **Performance Issues**
   - Check server logs
   - Verify API endpoints
   - Monitor database queries

## Contact

For technical support during the demo:
- Email: support@rentsure.com
- Phone: (555) 123-4567 