"use client";

import { useRef, useCallback } from 'react';
import { ScanResult } from './types';

type ImgBounds = { top: number; left: number; width: number; height: number };

// Each face gets its own verdict colour based on its crop score.
// Green = clean, Amber = suspicious, Red = synthetic.
function getFaceTheme(score: number) {
  const pct = Math.round(score * 100);
  if (score >= 0.70) {
    return { fill: '#ef4444', text: 'text-red-500', label: `${pct}% Deepfake` };
  }
  if (score >= 0.50) {
    return { fill: '#f59e0b', text: 'text-amber-500', label: `${pct}% Suspicious` };
  }
  return { fill: '#10b981', text: 'text-green-500', label: `${pct}% Real` };
}

export default function ScanCanvas({
  imageUrl,
  isScanning,
  scanResult,
  imgBounds,
  onImgBounds,
  canvasRef,
}: {
  imageUrl: string;
  isScanning: boolean;
  scanResult: ScanResult | null;
  imgBounds: ImgBounds | null;
  onImgBounds: (b: ImgBounds) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const cr = container.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    onImgBounds({
      top: ir.top - cr.top,
      left: ir.left - cr.left,
      width: ir.width,
      height: ir.height,
    });
  }, [onImgBounds]);

  return (
    <div
      ref={canvasRef}
      className="w-full bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] overflow-hidden max-h-[600px] flex items-center justify-center relative p-2"
    >
      <div ref={containerRef} className="relative inline-block max-w-full max-h-[580px]">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Scan Target"
          className={`block max-w-full max-h-[580px] object-contain transition-opacity duration-300 ${isScanning ? 'opacity-50' : 'opacity-100'}`}
          crossOrigin="anonymous"
          onLoad={measure}
        />

        {isScanning && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[8px]">
            <div className="absolute left-0 right-0 h-0.5 bg-[#00C170]/70 shadow-[0_0_8px_rgba(0,217,146,0.6)] animate-scan-line" />
          </div>
        )}

        {scanResult?.faces && scanResult.faces.length > 0 && !isScanning && imgBounds && (
          <>
            <svg
              className="absolute pointer-events-none"
              style={{
                top: imgBounds.top,
                left: imgBounds.left,
                width: imgBounds.width,
                height: imgBounds.height,
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {scanResult.faces.map((face, index) => {
                const theme = getFaceTheme(face.score);
                const isDanger = face.score >= 0.50;
                return (
                  <rect
                    key={`rect-${index}`}
                    x={`${face.box.xmin * 100}`}
                    y={`${face.box.ymin * 100}`}
                    width={`${(face.box.xmax - face.box.xmin) * 100}`}
                    height={`${(face.box.ymax - face.box.ymin) * 100}`}
                    fill="none"
                    stroke={theme.fill}
                    strokeWidth="0.3"
                    strokeDasharray={isDanger ? '3,3' : 'none'}
                    className={isDanger ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>

            {scanResult.faces.map((face, index) => {
              const theme = getFaceTheme(face.score);
              // If the face is near the bottom of the image, place the label above it instead of below.
              const isNearBottom = face.box.ymax >= 0.7;
              return (
                <div
                  key={`score-${index}`}
                  className="absolute pointer-events-none"
                  style={{
                    top: isNearBottom
                      ? imgBounds.top + face.box.ymin * imgBounds.height - 18
                      : imgBounds.top + face.box.ymax * imgBounds.height + 4,
                    left: imgBounds.left + face.box.xmin * imgBounds.width,
                  }}
                >
                  <div
                    className="bg-[#101010]/80 backdrop-blur-sm border px-2 py-0.5 rounded-[4px] whitespace-nowrap"
                    style={{ borderColor: theme.fill }}
                  >
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: theme.fill }}>
                      {theme.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
