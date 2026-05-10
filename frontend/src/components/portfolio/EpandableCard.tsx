// components/ExpandableText.tsx
"use client";

import { useState } from "react";

export default function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-5">
      <p className={`text-sm text-gray-500  ${expanded ? "" : "line-clamp-5"}`}>
        {text}
      </p>

      {text.length > 180 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-indigo-600 mb-5"
        >
          {expanded ? "show less" : "read more"}
        </button>
      )}
    </div>
  );
}
