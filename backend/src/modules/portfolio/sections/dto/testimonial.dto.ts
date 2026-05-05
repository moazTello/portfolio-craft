import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator'

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString()
  authorName: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  authorTitle?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  authorCompany?: string

  @ApiProperty()
  @IsString()
  content: string

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number
}