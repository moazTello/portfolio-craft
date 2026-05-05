import { Module } from '@nestjs/common'
import { PortfolioService } from './portfolio.service'
import { PortfolioController } from './portfolio.controller'
import { ProjectsController } from './sections/projects.controller'
import { ProjectsService } from './sections/projects.service'
import { SkillsController } from './sections/skills.controller'
import { SkillsService } from './sections/skills.service'
import { ExperiencesController } from './sections/experiences.controller'
import { ExperiencesService } from './sections/experiences.service'
import { CertificatesController } from './sections/certificates.controller'
import { CertificatesService } from './sections/certificates.service'
import { TestimonialsController } from './sections/testimonials.controller'
import { TestimonialsService } from './sections/testimonials.service'

@Module({
  controllers: [PortfolioController, ProjectsController, SkillsController, ExperiencesController, CertificatesController, TestimonialsController],
  providers: [PortfolioService, ProjectsService, SkillsService, ExperiencesService, CertificatesService, TestimonialsService],
})
export class PortfolioModule {}