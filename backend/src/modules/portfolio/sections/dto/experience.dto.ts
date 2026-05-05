import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator'

export class CreateExperienceDto {
  @ApiProperty()
  @IsString()
  company: string

  @ApiProperty()
  @IsString()
  role: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  current?: boolean

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string
}