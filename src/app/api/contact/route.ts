import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/property';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactFormSchema.parse(body);
    
    const {
      name,
      email,
      phone,
      message,
      propertyId,
      tourDate,
      tourTime,
      preferredContact
    } = validatedData;

    // In a real application, you would:
    // 1. Get property details from database
    // 2. Get landlord contact information
    // 3. Save the inquiry to database
    // 4. Send email notifications

    // Mock property lookup
    const propertyResponse = await fetch(`${request.nextUrl.origin}/api/properties/${propertyId}`);
    const property = propertyResponse.ok ? await propertyResponse.json() : null;

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Prepare email content
    const tourInfo = tourDate && tourTime 
      ? `\n\nRequested Tour:\n- Date: ${tourDate}\n- Time: ${tourTime}`
      : '';

    const emailContent = {
      to: property.contactEmail || 'landlord@example.com', // Use property's contact email
      subject: `New Inquiry for ${property.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Property Inquiry</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Property Details</h3>
            <p><strong>Title:</strong> ${property.title}</p>
            <p><strong>Price:</strong> $${property.price.toLocaleString()}/month</p>
            <p><strong>Location:</strong> ${property.location}</p>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContact}</p>
          </div>

          <div style="background-color: #fefefe; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}${tourInfo}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Respond quickly to secure this potential tenant!</strong>
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">
              You can reply directly to this email or use the contact information provided above.
            </p>
          </div>
        </div>
      `
    };

    // Send email notification
    await sendEmail(emailContent.to, emailContent.subject, emailContent.html);

    // Send confirmation email to the inquirer
    const confirmationEmail = {
      to: email,
      subject: `Inquiry Confirmation - ${property.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your inquiry!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your inquiry about <strong>${property.title}</strong> and have forwarded it to the property owner.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ul style="color: #475569;">
              <li>The landlord will receive your message within a few minutes</li>
              <li>They typically respond within 24 hours</li>
              <li>You'll hear from them via your preferred contact method: <strong>${preferredContact}</strong></li>
            </ul>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            If you don't hear back within 48 hours, feel free to reach out to us at support@rentsure.com
          </p>
          
          <p>Best regards,<br>The RentSure Team</p>
        </div>
      `
    };

    await sendEmail(confirmationEmail.to, confirmationEmail.subject, confirmationEmail.html);

    // In a real application, save the inquiry to database
    // await saveInquiry({
    //   propertyId,
    //   name,
    //   email,
    //   phone,
    //   message,
    //   tourDate,
    //   tourTime,
    //   preferredContact,
    //   createdAt: new Date()
    // });

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 