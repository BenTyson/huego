"use client";

interface ExtractedColor {
  hex: string;
  name: string;
  contrastColor: string;
}

interface ExtractedPaletteProps {
  colors: ExtractedColor[];
}

export function ExtractedPalette({ colors }: ExtractedPaletteProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-400 mb-2">
        Extracted Palette
      </h3>
      <div className="flex rounded-lg overflow-hidden h-20">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-center gap-1"
            style={{ backgroundColor: color.hex }}
          >
            <span
              className="text-xs font-mono"
              style={{
                color: color.contrastColor === "white" ? "#fff" : "#000",
              }}
            >
              {color.hex}
            </span>
            <span
              className="text-[10px] opacity-70"
              style={{
                color: color.contrastColor === "white" ? "#fff" : "#000",
              }}
            >
              {color.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
