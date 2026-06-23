export type ScanResult = {
  success: boolean;
  verdict: string;
  confidence: number;
  metrics: {
    ai_generated_score: number;
    deepfake_score: number;
  };
  faces?: {
    box: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    };
    probability: number;
    score: number;
  }[];
  id: string;
  analysed_at: string;
  media_type: string;
  anomaly_type: string | null;
  classification_tag: string | null;
  ai_generated_score: string;
  generation_sources: { source: string; label: string; probability: string }[];
  face_crops?: string[];
};

export type VerdictTheme = {
  text: string;
  bg: string;
  bgLight: string;
  fill: string;
};

// Maps a verdict to colors for badges, bars, and fills.
// Only the verdict string decides the color — the score is there
// so callers can pass it if needed, but it won't override.
export const getTheme = (verdict: string, score: number): VerdictTheme => {
  const normalizedVerdict = verdict?.toLowerCase();

  if (normalizedVerdict === 'synthetic' || normalizedVerdict === 'red') {
    return { text: 'text-red-500', bg: 'bg-red-500', bgLight: 'bg-red-500/20', fill: '#ef4444' };
  }
  if (normalizedVerdict === 'suspicious' || normalizedVerdict === 'amber') {
    return { text: 'text-amber-500', bg: 'bg-amber-500', bgLight: 'bg-amber-500/20', fill: '#f59e0b' };
  }
  return { text: 'text-green-500', bg: 'bg-green-500', bgLight: 'bg-green-500/20', fill: '#10b981' };
};
