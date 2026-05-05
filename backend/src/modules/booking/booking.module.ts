import { Module } from '@nestjs/common';
import {
  BookingController,
  BookingPublicController,
} from './booking.controller';
import { BookingService } from './booking.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule],
  controllers: [BookingController, BookingPublicController],
  providers: [BookingService],
})
export class BookingModule {}
