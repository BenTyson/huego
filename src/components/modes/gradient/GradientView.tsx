"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { usePaletteStore } from "@/store/palette";
import {
  generateLinearGradient,
  generateRadialGradient,
  generateConicGradient,
  generateMeshGradient,
  gradientToCSS,
  exportGradientAsCSS,
  gradientAnglePresets,
  radialPositionPresets,
  type GradientType,
  type GradientConfig,
} from "@/lib/gradient";
import { copyToClipboard } from "@/lib/export";

export function GradientView() {
  const { colors } = usePaletteStore();
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 });
  const [meshIntensity, setMeshIntensity] = useState(60);
  const [copied, setCopied] = useState(false);

  const gradientConfig = useMemo((): GradientConfig => {
    switch (gradientType) {
      case "linear":
        return generateLinearGradient(colors, angle);
      case "radial":
        return generateRadialGradient(colors, "ellipse", radialPosition);
      case "conic":
        return generateConicGradient(colors, angle, radialPosition);
      case "mesh":
        return generateMeshGradient(colors, meshIntensity);
      default:
        return generateLinearGradient(colors, angle);
    }
  }, [colors, gradientType, angle, radialPosition, meshIntensity]);

  const gradientCSS = useMemo(
    () => gradientToCSS(gradientConfig),
    [gradientConfig]
  );

  const handleCopyCSS = async () => {
    const fullCSS = exportGradientAsCSS(gradientConfig);
    const success = await copyToClipboard(fullCSS);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const gradientTypes: { type: GradientType; label: string; icon: string }[] = [
    { type: "linear", label: "Linear", icon: "↗" },
    { type: "radial", label: "Radial", icon: "◉" },
    { type: "conic", label: "Conic", icon: "◐" },
    { type: "mesh", label: "Mesh", icon: "◈" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Preview */}
      <div
        className="flex-1 relative"
        style={{
          background: gradientType === "mesh"
            ? `${colors[0]?.hex || "#000"}`
            : undefined,
          backgroundImage: gradientCSS,
          backgroundSize: gradientType === "mesh" ? "100% 100%" : undefined,
        }}
      >
        {/* Color dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white/30 shadow-lg"
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4 space-y-4">
        {/* Gradient Type */}
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
            Gradient Type
          </div>
          <div className="flex gap-2">
            {gradientTypes.map((gt) => (
              <button
                key={gt.type}
                onClick={() => setGradientType(gt.type)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  gradientType === gt.type
                    ? "bg-white text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="text-lg">{gt.icon}</span>
                <span className="hidden sm:inline">{gt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Type-specific controls */}
        {(gradientType === "linear" || gradientType === "conic") && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Angle: {angle}°
              </span>
              <div className="flex gap-1">
                {gradientAnglePresets.map((preset) => (
                  <button
                    key={preset.angle}
                    onClick={() => setAngle(preset.angle)}
                    className={`w-7 h-7 rounded text-xs ${
                      angle === preset.angle
                        ? "bg-white text-zinc-900"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                    title={`${preset.angle}°`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        )}

        {(gradientType === "radial" || gradientType === "conic") && (
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Position
            </div>
            <div className="flex gap-2 flex-wrap">
              {radialPositionPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setRadialPosition(preset.position)}
                  className={`py-1 px-3 rounded-lg text-sm ${
                    radialPosition.x === preset.position.x &&
                    radialPosition.y === preset.position.y
                      ? "bg-white text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {gradientType === "mesh" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Intensity: {meshIntensity}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={meshIntensity}
              onChange={(e) => setMeshIntensity(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        )}

        {/* Export */}
        <div className="flex gap-2 pt-2 border-t border-zinc-800">
          <button
            onClick={handleCopyCSS}
            className="flex-1 py-2 px-4 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy CSS
              </>
            )}
          </button>
        </div>

        {/* CSS Preview */}
        <div className="p-3 rounded-lg bg-zinc-800 overflow-x-auto">
          <code className="text-xs text-zinc-300 font-mono whitespace-pre">
            background: {gradientCSS};
          </code>
        </div>
      </div>
    </div>
  );
}
