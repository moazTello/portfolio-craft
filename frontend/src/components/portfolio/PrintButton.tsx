"use client";

export function PrintButton() {
  return (
    <div className="fixed top-4 right-4 z-50 print:hidden">
      <button
        onClick={() => window.print()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg"
      >
        🖨️ Save as PDF
      </button>
    </div>
  );
}
