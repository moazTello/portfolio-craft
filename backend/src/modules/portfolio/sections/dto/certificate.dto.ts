import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'

export class CreateCertificateDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  issuer: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  issueDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiryDate?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  credentialUrl?: string
}