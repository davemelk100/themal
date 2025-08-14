// Simple email service using Netlify Functions
// In production, you might want to use SendGrid, Mailgun, or similar

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  static async sendMagicLink(email: string, token: string, baseUrl: string) {
    const magicLink = `${baseUrl}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
    
    const emailData: EmailData = {
      to: email,
      subject: 'Your Magic Link - News Aggregator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to News Aggregator!</h2>
          <p>Click the button below to sign in to your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Sign In
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser: <a href="${magicLink}">${magicLink}</a>
          </p>
        </div>
      `,
      text: `
        Welcome to News Aggregator!
        
        Click this link to sign in: ${magicLink}
        
        This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
      `
    };

    // For now, we'll use a simple approach
    // In production, integrate with a real email service
    return this.sendEmail(emailData);
  }

  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // For development, log the email
      console.log('📧 Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html.substring(0, 100) + '...',
      });

      // In production, you would integrate with an email service here
      // Example with SendGrid:
      // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     personalizations: [{ to: [{ email: emailData.to }] }],
      //     from: { email: 'noreply@yourapp.com' },
      //     subject: emailData.subject,
      //     content: [
      //       { type: 'text/html', value: emailData.html },
      //       { type: 'text/plain', value: emailData.text || '' }
      //     ],
      //   }),
      // });

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
