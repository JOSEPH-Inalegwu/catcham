"use client";

import { useState } from "react";
import { scanMedia } from "@/app/actions/scan";

export default function UploadComponent() {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setScanResult(null);

    const formData = new FormData(event.currentTarget);

    const response = await scanMedia(formData);

    setScanResult(response);
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" accept="image/*,video/*" required />
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing Matrices..." : "Run Scan"}
      </button>

      {scanResult && (
        <div className="mt-4 p-4 border rounded">
          {scanResult.error ? (
            <p className="text-red-500">Error: {scanResult.error}</p>
          ) : (
            <div>
              <p className="font-bold text-lg">Verdict: {scanResult.result}</p>
              <p>Confidence: {(scanResult.confidence * 100).toFixed(4)}%</p>
              <p className="text-xs text-gray-400">ID: {scanResult.prediction_id}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
