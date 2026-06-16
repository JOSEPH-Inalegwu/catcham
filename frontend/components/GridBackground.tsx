import type { ReactNode } from "react";

export default function GridBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full bg-[#101010]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #2e2d2dff 49%, #2e2d2dff 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #2e2d2dff 49%, #2e2d2dff 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
