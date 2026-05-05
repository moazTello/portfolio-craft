export interface PdfTemplate {
  id: string
  name: string
  description: string
  preview: string // CSS gradient for preview
  accentColor: string
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant'
}

export const pdfTemplates: PdfTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean two-column layout with colored sidebar',
    preview: 'linear-gradient(135deg, #6366f1 40%, #f9fafb 40%)',
    accentColor: '#6366f1',
    style: 'modern',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional dark header with gold accents',
    preview: 'linear-gradient(180deg, #1a1a2e 35%, #f5f5f5 35%)',
    accentColor: '#d4a017',
    style: 'bold',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean with subtle typography',
    preview: 'linear-gradient(135deg, #f8fafc 60%, #e2e8f0 60%)',
    accentColor: '#334155',
    style: 'minimal',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold colors with modern grid layout',
    preview: 'linear-gradient(135deg, #0f172a 50%, #7c3aed 50%)',
    accentColor: '#7c3aed',
    style: 'bold',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Serif fonts with classic styling',
    preview: 'linear-gradient(180deg, #1c1917 30%, #fafaf9 30%)',
    accentColor: '#e11d48',
    style: 'elegant',
  },
]

export function getPdfTemplateById(id: string): PdfTemplate {
  return pdfTemplates.find(t => t.id === id) ?? pdfTemplates[0]
}