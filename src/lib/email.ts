import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendMaintenanceNotification = async (
  to: string,
  subject: string,
  requestId: string,
  status: string,
  propertyAddress: string
) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'notifications@rentsure.com',
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Maintenance Request Update</h2>
        <p>Your maintenance request has been updated:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Property:</strong> ${propertyAddress}</p>
          <p><strong>New Status:</strong> ${status}</p>
        </div>
        <p>You can view the full details by logging into your RentSure account.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated message from RentSure. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 