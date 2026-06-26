"use client";

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import Modal from './Modal';

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

async function getCroppedBlob(imageSrc: string, pixelCrop: Area, rotation: number): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const maxSize = 400;
  canvas.width = maxSize;
  canvas.height = maxSize;

  const rotRad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  const rotW = Math.ceil(pixelCrop.width * cos + pixelCrop.height * sin);
  const rotH = Math.ceil(pixelCrop.width * sin + pixelCrop.height * cos);

  const sx = (maxSize / rotW) * pixelCrop.x;
  const sy = (maxSize / rotH) * pixelCrop.y;
  const sWidth = (maxSize / rotW) * pixelCrop.width;
  const sHeight = (maxSize / rotH) * pixelCrop.height;

  ctx.translate(maxSize / 2, maxSize / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -sWidth / 2 - sx, -sHeight / 2 - sy, sWidth, sHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, 'image/webp', 85);
  });
}

type Props = {
  open: boolean;
  imageSrc: string | null;
  onSave: (blob: Blob) => void;
  onClose: () => void;
};

export default function AvatarCropModal({ open, imageSrc, onSave, onClose }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels, rotation);
      onSave(blob);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Adjust your photo"
      description="Drag to reposition, scroll or use the slider to zoom."
      actions={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-[6px] text-sm font-semibold text-[#a0a0a0] hover:text-[#ffffff] hover:bg-[#262626] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !croppedAreaPixels}
            className="px-4 py-2 rounded-[6px] text-sm font-semibold bg-[#00C170] text-[#0A0A0A] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save photo'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative w-full h-[280px] bg-[#101010] rounded-[6px] overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: '#101010' },
                cropAreaStyle: { border: '2px solid #00C170' },
              }}
            />
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#a0a0a0] mb-1.5 font-semibold uppercase tracking-wider">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#00C170] cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRotation((r) => r - 90)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-sm text-[#ffffff] border border-[#3d3a39] hover:bg-[#262626] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rotate left
            </button>
            <button
              onClick={() => setRotation((r) => r + 90)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-sm text-[#ffffff] border border-[#3d3a39] hover:bg-[#262626] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rotate right
            </button>
            {rotation !== 0 && (
              <button
                onClick={() => setRotation(0)}
                className="text-xs text-[#a0a0a0] hover:text-[#ffffff] transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
