// export interface PdfTemplate {
//   id: string;
//   name: string;
//   description: string;
//   preview: string; // CSS gradient for preview
//   accentColor: string;
//   style: "modern" | "classic" | "minimal" | "bold" | "elegant";
// }

// export const pdfTemplates: PdfTemplate[] = [
//   {
//     id: "modern",
//     name: "Modern",
//     description: "Clean two-column layout with colored sidebar",
//     preview: "linear-gradient(135deg, #6366f1 40%, #f9fafb 40%)",
//     accentColor: "#6366f1",
//     style: "modern",
//   },
//   {
//     id: "executive",
//     name: "Executive",
//     description: "Professional dark header with gold accents",
//     preview: "linear-gradient(180deg, #1a1a2e 35%, #f5f5f5 35%)",
//     accentColor: "#d4a017",
//     style: "bold",
//   },
//   {
//     id: "minimal",
//     name: "Minimal",
//     description: "Ultra-clean with subtle typography",
//     preview: "linear-gradient(135deg, #f8fafc 60%, #e2e8f0 60%)",
//     accentColor: "#334155",
//     style: "minimal",
//   },
//   {
//     id: "creative",
//     name: "Creative",
//     description: "Bold colors with modern grid layout",
//     preview: "linear-gradient(135deg, #0f172a 50%, #7c3aed 50%)",
//     accentColor: "#7c3aed",
//     style: "bold",
//   },
//   {
//     id: "elegant",
//     name: "Elegant",
//     description: "Serif fonts with classic styling",
//     preview: "linear-gradient(180deg, #1c1917 30%, #fafaf9 30%)",
//     accentColor: "#e11d48",
//     style: "elegant",
//   },
// ];

// export function getPdfTemplateById(id: string): PdfTemplate {
//   return pdfTemplates.find((t) => t.id === id) ?? pdfTemplates[0];
// }

export interface PdfTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // CSS gradient for preview
  accentColor: string;
  style: "modern" | "classic" | "minimal" | "bold" | "elegant";
}
 
export const pdfTemplates: PdfTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean two-column layout with colored sidebar",
    preview: "linear-gradient(135deg, #6366f1 40%, #f9fafb 40%)",
    accentColor: "#6366f1",
    style: "modern",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional dark header with gold accents",
    preview: "linear-gradient(180deg, #1a1a2e 35%, #f5f5f5 35%)",
    accentColor: "#d4a017",
    style: "bold",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean with subtle typography",
    preview: "linear-gradient(135deg, #f8fafc 60%, #e2e8f0 60%)",
    accentColor: "#334155",
    style: "minimal",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold colors with modern grid layout",
    preview: "linear-gradient(135deg, #0f172a 50%, #7c3aed 50%)",
    accentColor: "#7c3aed",
    style: "bold",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Serif fonts with classic styling",
    preview: "linear-gradient(180deg, #1c1917 30%, #fafaf9 30%)",
    accentColor: "#e11d48",
    style: "elegant",
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Gold accent bar with bold sidebar header",
    preview: "linear-gradient(135deg, #e6b800 30%, #f9fafb 30%)",
    accentColor: "#e6b800",
    style: "bold",
  },
  {
    id: "bloom",
    name: "Bloom",
    description: "Dark header with circular avatar and dot skills",
    preview: "linear-gradient(180deg, #1a1a2e 32%, #f9fafb 32%)",
    accentColor: "#e05a9c",
    style: "modern",
  },
  {
    id: "timeless",
    name: "Timeless",
    description: "Classic serif typography with thin dividers",
    preview: "linear-gradient(135deg, #f9fafb 55%, #e2e8f0 55%)",
    accentColor: "#2563eb",
    style: "classic",
  },
  {
    id: "impact",
    name: "Impact",
    description: "Dark left sidebar with dot skill ratings",
    preview: "linear-gradient(90deg, #1a1a2e 35%, #ffffff 35%)",
    accentColor: "#e85d26",
    style: "bold",
  },
  {
    id: "expert",
    name: "Expert",
    description: "Teal sidebar with skill chips and avatar",
    preview: "linear-gradient(90deg, #0d7377 35%, #ffffff 35%)",
    accentColor: "#0d7377",
    style: "modern",
  },
  {
    id: "elite",
    name: "Elite",
    description: "Dark textured banner header, clean white body",
    preview: "linear-gradient(160deg, #0f172a 32%, #f9fafb 32%)",
    accentColor: "#1a6b4a",
    style: "bold",
  },
  {
    id: "elevate",
    name: "Elevate",
    description: "Warm tones with dot skill ratings and labels",
    preview: "linear-gradient(135deg, #fff7ed 55%, #fef3c7 55%)",
    accentColor: "#c45c26",
    style: "modern",
  },
  {
    id: "modular",
    name: "Modular",
    description: "Dark right sidebar with main content left",
    preview: "linear-gradient(270deg, #1a1a2e 35%, #ffffff 35%)",
    accentColor: "#7c3aed",
    style: "modern",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column with serif dividers",
    preview: "linear-gradient(135deg, #f9fafb 55%, #e2e8f0 55%)",
    accentColor: "#1d4ed8",
    style: "classic",
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Deep gradient header with refined two-column layout",
    preview: "linear-gradient(160deg, #0f172a 32%, #f9fafb 32%)",
    accentColor: "#9f1239",
    style: "elegant",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Bold header line with dot skill ratings",
    preview: "linear-gradient(135deg, #ecfeff 55%, #cffafe 55%)",
    accentColor: "#0891b2",
    style: "modern",
  },
  {
    id: "functional",
    name: "Functional",
    description: "Light right sidebar with dot skills",
    preview: "linear-gradient(270deg, #f8fafc 35%, #ffffff 35%)",
    accentColor: "#dc2626",
    style: "minimal",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Corporate blue sidebar with progress bars",
    preview: "linear-gradient(90deg, #1e40af 35%, #ffffff 35%)",
    accentColor: "#1e40af",
    style: "bold",
  },
  {
    id: "engage",
    name: "Engage",
    description: "Green header with highlighted summary block",
    preview: "linear-gradient(180deg, #059669 32%, #f9fafb 32%)",
    accentColor: "#059669",
    style: "modern",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Neutral two-column with dot skill indicators",
    preview: "linear-gradient(135deg, #f9fafb 55%, #f3f4f6 95%)",
    accentColor: "#374151",
    style: "minimal",
  },
  {
    id: "streamline",
    name: "Streamline",
    description: "Crimson right sidebar with clean left content",
    preview: "linear-gradient(270deg, #9b1c31 35%, #ffffff 95%)",
    accentColor: "#9b1c31",
    style: "bold",
  },
  {
    id: "confident",
    name: "Confident",
    description: "Full dark background with amber accents",
    preview: "linear-gradient(135deg, #0f172a 55%, #1e293b 55%)",
    accentColor: "#f59e0b",
    style: "bold",
  },
  {
    id: "prestige",
    name: "Prestige",
    description: "White two-panel layout with dot skills sidebar",
    preview: "linear-gradient(270deg, #f8fafc 35%, #ffffff 95%)",
    accentColor: "#2563eb",
    style: "classic",
  },
];
 
export function getPdfTemplateById(id: string): PdfTemplate {
  return pdfTemplates.find((t) => t.id === id) ?? pdfTemplates[0];
}