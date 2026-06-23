"use client";

import { ScanResult, getTheme } from './types';

export default function MetricsPanel({ result }: { result: ScanResult }) {
  const theme = getTheme(result.verdict, result.confidence);

  return (
    <div className="bg-[#1A1A1A] border border-[#3d3a39] rounded-[8px] p-5 space-y-4">
      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Generation Sources</h4>
        <div className="rounded-[6px] border border-[#3d3a39] divide-y divide-[#3d3a39]">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm font-semibold text-[#f2f2f2]">AI-Generated</span>
            <span className="font-mono text-sm font-bold text-[#f2f2f2]">{result.ai_generated_score}</span>
          </div>
          {result.generation_sources?.map((s) => (
            <div key={s.source} className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-[#a1a1aa]">{s.label}</span>
              <span className="font-mono text-xs font-semibold text-[#f2f2f2]">{s.probability}</span>
            </div>
          ))}
        </div>
      </div>

      {result.anomaly_type && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-2">Detection</h4>
          <span className={`text-sm font-semibold ${theme.text}`}>{result.anomaly_type}</span>
        </div>
      )}

      {result.classification_tag && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-2">Classification</h4>
          <span className={`rounded-[4px] px-2 py-0.5 text-xs font-semibold ${theme.bgLight} ${theme.text}`}>
            {result.classification_tag}
          </span>
        </div>
      )}

      {result.faces && result.faces.length > 0 && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Spatial Target Nodes</h4>
          <div className="space-y-2">
            {result.faces.map((face, index) => {
              const faceFill = face.score >= 0.70 ? '#ef4444' : face.score >= 0.50 ? '#f59e0b' : '#10b981';
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-[#a1a1aa]">Face {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono font-semibold px-1.5 py-0.5 border rounded-[4px] whitespace-nowrap"
                      style={{ color: faceFill, borderColor: faceFill }}
                    >
                      X:{Math.round(face.box.xmin * 100)} Y:{Math.round(face.box.ymin * 100)}
                    </span>
                    <span
                      className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap text-[#ffffff]"
                      style={{ backgroundColor: faceFill }}
                    >
                      {Math.round(face.score * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-[10px] font-mono uppercase tracking-[1.5px] text-[#8b949e] mb-3">Metadata</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Media type</span>
            <span className="text-sm font-semibold capitalize text-[#f2f2f2]">{result.media_type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Report ID</span>
            <span className="text-sm font-mono font-semibold text-[#f2f2f2]">{result.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Analysed at</span>
            <span className="text-sm font-semibold text-[#f2f2f2]">{new Date(result.analysed_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
