// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   UseGuards,
//   Headers,
//   Req,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { BillingService } from './billing.service';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { Request } from 'express';
// import type { RawBodyRequest } from '@nestjs/common';
// import { PaypalService } from './paypal.service';
// @ApiTags('Billing')
// @Controller('billing')
// export class BillingController {
//   constructor(
//     private readonly billingService: BillingService,
//     private readonly paypalService: PaypalService,
//   ) {}

//   @Post('checkout')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Create checkout session' })
//   createCheckout(
//     @CurrentUser() user: any,
//     @Body() body: { plan: 'PRO' | 'BUSINESS' },
//   ) {
//     return this.billingService.createCheckoutSession(
//       user.id,
//       user.email,
//       body.plan,
//     );
//   }

//   @Post('portal')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Open billing portal' })
//   createPortal(@CurrentUser() user: any) {
//     return this.billingService.createPortalSession(user.id);
//   }

//   @Get('subscription')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get subscription info' })
//   getSubscription(@CurrentUser() user: any) {
//     return this.billingService.getSubscription(user.id);
//   }

//   @Post('webhook')
//   @ApiOperation({ summary: 'Stripe webhook' })
//   async handleWebhook(
//     @Req() req: RawBodyRequest<Request>,
//     @Headers('stripe-signature') signature: string,
//   ) {
//     await this.billingService.handleWebhook(req.rawBody!, signature);
//     return { received: true };
//   }

//   @Post('paypal/create')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Create PayPal order' })
//   createPaypalOrder(
//     @CurrentUser() user: any,
//     @Body() body: { plan: 'PRO' | 'BUSINESS' },
//   ) {
//     return this.paypalService.createSubscription(body.plan, user.id);
//   }

//   @Post('paypal/capture')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Capture PayPal payment' })
//   async capturePaypal(
//     @CurrentUser() user: any,
//     @Body() body: { orderId: string },
//   ) {
//     const result = await this.paypalService.captureOrder(body.orderId);

//     if (result.success && result.userId === user.id) {
//       await this.billingService.prisma.user.update({
//         where: { id: user.id },
//         data: { plan: result.plan as any },
//       });
//     }

//     return result;
//   }
//   @Post('paypal/create')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// @ApiOperation({ summary: 'Create PayPal order' })
// createPaypalOrder(
//   @CurrentUser() user: any,
//   @Body() body: { plan: 'PRO' | 'BUSINESS' }
// ) {
//   return this.billingService.createPaypalOrder(user.id, body.plan)
// }

// @Post('paypal/capture')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// @ApiOperation({ summary: 'Capture PayPal order' })
// capturePaypalOrder(
//   @CurrentUser() user: any,
//   @Body() body: { orderId: string }
// ) {
//   return this.billingService.capturePaypalOrder(user.id, body.orderId)
// }
// }
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';
import type { RawBodyRequest } from '@nestjs/common';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session' })
  createCheckout(
    @CurrentUser() user: any,
    @Body() body: { plan: 'PRO' | 'BUSINESS' },
  ) {
    return this.billingService.createCheckoutSession(
      user.id,
      user.email,
      body.plan,
    );
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Open billing portal' })
  createPortal(@CurrentUser() user: any) {
    return this.billingService.createPortalSession(user.id);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription info' })
  getSubscription(@CurrentUser() user: any) {
    return this.billingService.getSubscription(user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.billingService.handleWebhook(req.rawBody!, signature);
    return { received: true };
  }

  @Post('paypal/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create PayPal order' })
  createPaypalOrder(
    @CurrentUser() user: any,
    @Body() body: { plan: 'PRO' | 'BUSINESS' },
  ) {
    return this.billingService.createPaypalOrder(user.id, body.plan);
  }

  @Post('paypal/capture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Capture PayPal order' })
  capturePaypalOrder(
    @CurrentUser() user: any,
    @Body() body: { orderId: string },
  ) {
    return this.billingService.capturePaypalOrder(user.id, body.orderId);
  }

  @Post('manual-request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit manual payment request' })
  async manualRequest(
    @CurrentUser() user: any,
    @Body()
    body: {
      plan: string;
      name: string;
      phone: string;
      note?: string;
      method: string;
    },
  ) {
    return this.billingService.createManualRequest(user.id, user.email, body);
  }
}
