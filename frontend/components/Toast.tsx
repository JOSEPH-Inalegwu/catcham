"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
};

export default function Toast({ message, type = "error", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderColor = type === "error" ? "#b91c1c" : "#3d3a39";
  const bgColor = type === "error" ? "#1a0a0a" : "#1a1a1a";
  const textColor = type === "error" ? "#f87171" : "#bdbdbd";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-[6px] border px-5 py-3 text-sm shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100 animate-shake" : "translate-y-4 opacity-0"
      }`}
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {message}
    </div>
  );
}
