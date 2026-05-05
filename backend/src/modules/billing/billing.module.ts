// import { Module } from '@nestjs/common'
// import { ConfigModule } from '@nestjs/config'
// import { BillingController } from './billing.controller'
// import { BillingService } from './billing.service'
// import { PaypalService } from './paypal.service'
// @Module({
//   imports: [ConfigModule],
//   controllers: [BillingController],
//   providers: [BillingService, PaypalService],
//   exports: [BillingService],
// })
// export class BillingModule {}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BillingController } from './billing.controller'
import { BillingService } from './billing.service'

@Module({
  imports: [ConfigModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}