import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEmail, ValidateIf } from 'class-validator';

export class UpdatePortfolioDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  heroSubtitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  aboutText?: string;

  @ApiPropertyOptional()
  @ValidateIf(o => o.email !== '')
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  github?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  darkModeDefault?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  themePreset?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pdfTemplate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ogImage?: string;
}
