import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  liveUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  repoUrl?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
