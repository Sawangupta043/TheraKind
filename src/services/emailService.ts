// Email service for notifications
// In a real app, this would integrate with SendGrid, Nodemailer, or similar

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate email sending
    console.log('Sending email:', emailData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (90% success rate)
    return Math.random() > 0.1;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendBookingConfirmation = async (
  clientEmail: string,
  therapistName: string,
  date: string,
  time: string,
  type: 'online' | 'in-person'
) => {
  const subject = 'Session Booking Confirmation - TheraSoul';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6B46C1;">Session Booking Confirmation</h2>
      <p>Your session has been successfully booked!</p>
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Therapist:</strong> ${therapistName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Type:</strong> ${type === 'online' ? 'Online Session' : 'In-Person Session'}</p>
      </div>
      <p>You will receive a confirmation from your therapist shortly.</p>
              <p>Thank you for choosing TheraSoul!</p>
    </div>
  `;

  return sendEmail({ to: clientEmail, subject, html });
};

export const sendSessionReminder = async (
  clientEmail: string,
  therapistName: string,
  date: string,
  time: string,
  meetLink?: string
) => {
  const subject = 'Session Reminder - TheraSoul';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6B46C1;">Session Reminder</h2>
      <p>This is a reminder for your upcoming session.</p>
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Therapist:</strong> ${therapistName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${meetLink ? `<p><strong>Meeting Link:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
      </div>
      <p>Please be ready 5 minutes before your scheduled time.</p>
    </div>
  `;

  return sendEmail({ to: clientEmail, subject, html });
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const subject = 'Password Reset - TheraSoul';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6B46C1;">Password Reset Request</h2>
              <p>You requested a password reset for your TheraSoul account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="display: inline-block; background: #6B46C1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}; 