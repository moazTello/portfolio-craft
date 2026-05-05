import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private config: ConfigService) {
    this.resend = new Resend(config.get('RESEND_API_KEY'));
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${this.config.get('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'PortfolioCraft <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 600; color: #111;">Welcome to PortfolioCraft!</h1>
          <p style="color: #555; margin: 16px 0;">Hi ${name}, please verify your email to get started.</p>
          <a href="${url}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 24px;">Link expires in 24 hours.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const url = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'PortfolioCraft <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 600; color: #111;">Reset your password</h1>
          <p style="color: #555; margin: 16px 0;">Hi ${name}, click below to reset your password.</p>
          <a href="${url}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 24px;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }

  async sendContactNotification(
    ownerEmail: string,
    ownerName: string,
    senderName: string,
    senderEmail: string,
    subject: string,
    content: string,
  ) {
    await this.resend.emails.send({
      from: 'PortfolioCraft <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `New message from ${senderName}`,
      html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 20px; font-weight: 600; color: #111;">New message on your portfolio!</h1>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #555;"><strong>From:</strong> ${senderName}</p>
          <p style="margin: 0 0 8px; color: #555;"><strong>Email:</strong> ${senderEmail}</p>
          <p style="margin: 0 0 8px; color: #555;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 16px 0 0; color: #333;">${content}</p>
        </div>
        <a href="mailto:${senderEmail}" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px;">
          Reply to ${senderName}
        </a>
      </div>
    `,
    });
  }
}
