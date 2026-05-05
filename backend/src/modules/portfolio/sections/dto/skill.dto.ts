import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator'

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  category: string

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  proficiency?: number
}