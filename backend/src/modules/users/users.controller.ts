import { Controller, Get, Patch, Delete, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator'

class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramChatId?: string
}

class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string
}

class UploadAvatarDto {
  @ApiProperty()
  @IsString()
  base64: string
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  getMe(@CurrentUser() user: any) {
    return user
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto)
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto.currentPassword, dto.newPassword)
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload avatar' })
  uploadAvatar(@CurrentUser() user: any, @Body() dto: UploadAvatarDto) {
    return this.usersService.updateAvatar(user.id, dto.base64)
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account' })
  deleteMe(@CurrentUser() user: any) {
    return this.usersService.delete(user.id)
  }
}