export interface SampleFile {
  id: string;
  label: string;
  description: string;
  filePath: string;
  mimeType: string;
  localUrl: string;
}

export const samples: SampleFile[] = [
  {
    id: 'deepfake-speech',
    label: 'Political Speech (Deepfake)',
    description: 'AI-generated talking head with synthetic lip movements',
    filePath: '01-political-speech-deepfake.mp4',
    mimeType: 'video/mp4',
    localUrl: '/samples/01-political-speech-deepfake.mp4',
  },
  {
    id: 'authentic-news',
    label: 'News Broadcast (Authentic)',
    description: 'Verified legitimate news broadcast footage',
    filePath: '02-news-broadcast-authentic.jpg',
    mimeType: 'image/jpeg',
    localUrl: '/samples/02-news-broadcast-authentic.jpg',
  },
];

export function getSampleUrl(sample: SampleFile): string {
  return sample.localUrl;
}
