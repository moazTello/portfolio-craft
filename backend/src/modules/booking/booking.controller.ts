import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { BookingService } from './booking.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEmail } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class SetAvailabilityDto {
  @ApiProperty()
  @IsArray()
  slots: {
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
  }[]
}

class UpdateBookingSettingsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bookingDuration?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bookingBuffer?: number
}

class CreatePublicBookingDto {
  @ApiProperty()
  @IsString()
  clientName: string

  @ApiProperty()
  @IsEmail()
  clientEmail: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clientPhone?: string

  @ApiProperty()
  @IsString()
  date: string

  @ApiProperty()
  @IsString()
  time: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string
}

// ─── Dashboard Routes ────────────────────────────────────

@ApiTags('Booking')
@Controller('booking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('availability')
  @ApiOperation({ summary: 'Get my availability' })
  getAvailability(@CurrentUser() user: any) {
    return this.bookingService.getAvailability(user.id)
  }

  @Post('availability')
  @ApiOperation({ summary: 'Set availability' })
  setAvailability(@CurrentUser() user: any, @Body() dto: SetAvailabilityDto) {
    return this.bookingService.setAvailability(user.id, dto.slots)
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update booking settings' })
  updateSettings(@CurrentUser() user: any, @Body() dto: UpdateBookingSettingsDto) {
    return this.bookingService.updateBookingSettings(user.id, dto)
  }

  @Patch('toggle')
  @ApiOperation({ summary: 'Toggle booking on/off' })
  toggle(@CurrentUser() user: any, @Body() body: { enabled: boolean }) {
    return this.bookingService.toggleBooking(user.id, body.enabled)
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings' })
  getBookings(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.bookingService.getBookings(user.id, status)
  }

  @Patch('bookings/:id/status')
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.bookingService.updateBookingStatus(user.id, id, body.status)
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete booking' })
  deleteBooking(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingService.deleteBooking(user.id, id)
  }
}

// ─── Public Routes ───────────────────────────────────────

@ApiTags('Booking Public')
@Controller('public/booking')
export class BookingPublicController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get public availability' })
  getAvailability(@Param('username') username: string) {
    return this.bookingService.getPublicAvailability(username)
  }

  @Get(':username/slots')
  @ApiOperation({ summary: 'Get available slots for a date' })
  getSlots(
    @Param('username') username: string,
    @Query('date') date: string
  ) {
    return this.bookingService.getAvailableSlots(username, date)
  }

  @Post(':username')
  @ApiOperation({ summary: 'Create booking' })
  createBooking(
    @Param('username') username: string,
    @Body() dto: CreatePublicBookingDto
  ) {
    return this.bookingService.createBooking(username, dto)
  }
}