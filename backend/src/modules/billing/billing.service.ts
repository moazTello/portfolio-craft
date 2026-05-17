import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import Stripe from 'stripe';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class BillingService {
  private stripe: InstanceType<typeof Stripe>;
  private paypalClient: paypal.core.PayPalHttpClient;

  constructor(
    public prisma: PrismaService,
    private config: ConfigService,
  ) {
    // this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY')!, {
    //   apiVersion: '2024-12-18.acacia',
    // })
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2026-04-22.dahlia',
    });
    const environment =
      config.get('PAYPAL_MODE') === 'live'
        ? new paypal.core.LiveEnvironment(
            config.get('PAYPAL_CLIENT_ID')!,
            config.get('PAYPAL_CLIENT_SECRET')!,
          )
        : new paypal.core.SandboxEnvironment(
            config.get('PAYPAL_CLIENT_ID')!,
            config.get('PAYPAL_CLIENT_SECRET')!,
          );
    this.paypalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async getOrCreateCustomer(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    }
    const customer = await this.stripe.customers.create({ email });
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
    return customer.id;
  }

  async createCheckoutSession(
    userId: string,
    email: string,
    plan: 'PRO' | 'BUSINESS',
    interval: 'monthly' | 'annual' = 'monthly',
  ) {
    const customerId = await this.getOrCreateCustomer(userId, email);

    const priceId =
      plan === 'PRO'
        ? interval === 'annual'
          ? this.config.get('STRIPE_PRO_ANNUAL_PRICE_ID')
          : this.config.get('STRIPE_PRO_PRICE_ID')
        : interval === 'annual'
          ? this.config.get('STRIPE_BUSINESS_ANNUAL_PRICE_ID')
          : this.config.get('STRIPE_BUSINESS_PRICE_ID');

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${this.config.get('FRONTEND_URL')}/dashboard/settings/billing?success=true`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/dashboard/settings/billing?cancelled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) throw new Error('No subscription found');
    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${this.config.get('FRONTEND_URL')}/dashboard/settings/billing`,
    });
    return { url: session.url };
  }
  private async removeDomainFromVercel(domain: string) {
    try {
      const token = this.config.get('VERCEL_TOKEN');
      const projectId = this.config.get('VERCEL_PROJECT_ID');

      await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.error('Vercel domain remove error:', e);
    }
  }
  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET')!;
    let event: ReturnType<typeof this.stripe.webhooks.constructEvent>;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch {
      throw new Error('Invalid webhook signature');
    }
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              plan: plan as any,
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const user = await this.prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
          include: { portfolio: true },
        });

        if (!user) break;

        await this.prisma.user.update({
          where: { id: user.id },
          data: { plan: 'FREE', stripeSubscriptionId: null },
        });

        if (user.portfolio) {
          if (user.portfolio.customDomain) {
            await this.removeDomainFromVercel(user.portfolio.customDomain);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const periodEnd = (subscription as any).current_period_end;

        if (!periodEnd) break;
        const daysUntilEnd = Math.ceil(
          (periodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24),
        );

        // إذا بقي 7 أيام أو أقل
        if (daysUntilEnd <= 7) {
          const user = await this.prisma.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (user) {
            // ابعت إيميل تحذير
            try {
              const { Resend } = await import('resend');
              const resend = new Resend(this.config.get('RESEND_API_KEY'));
              await resend.emails.send({
                from: 'PortfolioCraft <no-reply@portfolio-craft.com>',
                to: user.email,
                subject: `⚠️ Your subscription expires in ${daysUntilEnd} days`,
                html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
              <h2 style="color:#4F46E5">Your subscription is expiring soon</h2>
              <p>Your PortfolioCraft ${user.plan} plan expires in <strong>${daysUntilEnd} days</strong>.</p>
              <p>After expiry your portfolio will be limited to Free plan features:</p>
              <ul>
                <li>Only 3 projects visible</li>
                <li>Only 6 gallery photos</li>
                <li>Custom domain will be disabled</li>
                <li>Blog and booking will be hidden</li>
              </ul>
              <a href="https://www.portfolio-craft.com/dashboard/settings/billing"
                style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
                Renew Subscription →
              </a>
            </div>
          `,
              });
            } catch (e) {
              console.error('Warning email error:', e);
            }

            // ابعت Telegram للأدمن
            try {
              const botToken = this.config.get('TELEGRAM_BOT_TOKEN');
              const chatId = this.config.get('TELEGRAM_CHAT_ID');
              if (botToken && chatId) {
                await fetch(
                  `https://api.telegram.org/bot${botToken}/sendMessage`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      chat_id: chatId,
                      text: `⚠️ <b>Subscription Expiring Soon!</b>\n\n📧 <b>Email:</b> ${user.email}\n📦 <b>Plan:</b> ${user.plan}\n⏰ <b>Days left:</b> ${daysUntilEnd}`,
                      parse_mode: 'HTML',
                    }),
                  },
                );
              }
            } catch (e) {
              console.error('Telegram error:', e);
            }
          }
        }
        break;
      }
    }
  }

  async getSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (user?.stripeSubscriptionId) {
      try {
        const subscription = await this.stripe.subscriptions.retrieve(
          user.stripeSubscriptionId,
        );

        // الـ property الجديدة في Stripe API
        const periodEnd =
          (subscription as any).current_period_end ??
          subscription.items?.data[0]?.current_period_end;

        if (periodEnd) {
          const daysUntilEnd = Math.ceil(
            (periodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24),
          );
          return {
            ...user,
            daysUntilEnd,
            expiresAt: new Date(periodEnd * 1000).toISOString(),
          };
        }
      } catch {
        return user;
      }
    }
    return user;
  }
  async createPaypalOrder(
    userId: string,
    plan: 'PRO' | 'BUSINESS',
    interval: 'monthly' | 'annual' = 'monthly',
  ) {
    const amount =
      plan === 'PRO'
        ? interval === 'annual'
          ? '48.00'
          : '5.00'
        : interval === 'annual'
          ? '99.00'
          : '12.00';

    const frontendUrl = this.config.get('FRONTEND_URL');

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: 'USD', value: amount },
          description: `PortfolioCraft ${plan} ${interval} Plan`,
        },
      ],
      application_context: {
        brand_name: 'PortfolioCraft',
        return_url: `${frontendUrl}/dashboard/settings/billing?paypal=success&plan=${plan}`,
        cancel_url: `${frontendUrl}/dashboard/settings/billing?paypal=cancelled`,
      },
    });

    const response = await this.paypalClient.execute(request);
    const approvalUrl = response.result.links.find(
      (l: any) => l.rel === 'approve',
    )?.href;

    return { approvalUrl, orderId: response.result.id };
  }

  async capturePaypalOrder(userId: string, orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const response = await this.paypalClient.execute(request);

    if (response.result.status === 'COMPLETED') {
      // Get plan from description
      const description = response.result.purchase_units[0]?.description ?? '';
      const plan = description.includes('BUSINESS') ? 'BUSINESS' : 'PRO';

      await this.prisma.user.update({
        where: { id: userId },
        data: { plan: plan as any },
      });

      return { success: true, plan };
    }

    return { success: false };
  }

  async createManualRequest(
    userId: string,
    email: string,
    data: {
      plan: string;
      name: string;
      phone: string;
      note?: string;
      method: string;
    },
  ) {
    // Send notification email to admin
    const adminEmail =
      this.config.get('ADMIN_EMAIL') ?? 'admin@portfoliocraft.com';

    await this.prisma.user.findUnique({ where: { id: userId } });

    // Send email to admin
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(this.config.get('RESEND_API_KEY'));
      await resend.emails.send({
        from: 'PortfolioCraft <no-reply@portfolio-craft.com>',
        to: adminEmail,
        subject: `💰 New ${data.method} Payment Request — ${data.plan}`,
        html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
          <h2 style="color:#16a34a">New Payment Request</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666">Method</td><td style="padding:8px;font-weight:600">${data.method}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Plan</td><td style="padding:8px;font-weight:600;color:#6366f1">${data.plan}</td></tr>
            <tr><td style="padding:8px;color:#666">Name</td><td style="padding:8px">${data.name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${data.phone}</td></tr>
            <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${email}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;color:#666">Note</td><td style="padding:8px">${data.note || '—'}</td></tr>
            <tr><td style="padding:8px;color:#666">User ID</td><td style="padding:8px;font-size:12px;color:#999">${userId}</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
            <p style="margin:0;font-size:14px;color:#166534">
              Go to Admin Panel to activate this user's plan:
              <br/>
              <strong>User ID: ${userId}</strong>
            </p>
          </div>
        </div>
      `,
      });
    } catch (e) {
      console.error('Email error:', e);
    }
    // Send Telegram notification to admin
    try {
      const botToken = this.config.get('TELEGRAM_BOT_TOKEN');
      const chatId = this.config.get('TELEGRAM_CHAT_ID');

      if (botToken && chatId) {
        const message = `
          💰 <b>New Payment Request!</b>

          📦 <b>Plan:</b> ${data.plan}
          💳 <b>Method:</b> ${data.method}
          👤 <b>Name:</b> ${data.name}
          📞 <b>Phone:</b> ${data.phone}
          📧 <b>Email:</b> ${email}
          📝 <b>Note:</b> ${data.note || '—'}
          🆔 <b>User ID:</b> <code>${userId}</code>

          → Go to Admin Panel to activate
    `.trim();

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });
      }
    } catch (e) {
      console.error('Telegram error:', e);
    }

    return { success: true, message: 'Request submitted successfully' };
  }
}
