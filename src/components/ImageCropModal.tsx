import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  aspectRatio?: number; // e.g. 16/9, 4/3, 1 (square), or 0 for free
  title?: string;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  aspectRatio = 16 / 9,
  title = "Sesuaikan & Crop Foto",
  onConfirm,
  onCancel,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset when open with new image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile admin
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSaveCrop = () => {
    const container = containerRef.current;
    const img = imageRef.current;
    if (!container || !img) {
      onConfirm(imageSrc);
      return;
    }

    const canvas = document.createElement('canvas');
    const targetWidth = 1200;
    const targetHeight = aspectRatio > 0 ? Math.round(targetWidth / aspectRatio) : 800;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onConfirm(imageSrc);
      return;
    }

    // Fill background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Compute transformations relative to container
    const containerRect = container.getBoundingClientRect();
    const scaleFactorX = targetWidth / containerRect.width;
    const scaleFactorY = targetHeight / containerRect.height;

    ctx.save();
    // Center of canvas
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Translate by user drag offset scaled
    ctx.translate(position.x * scaleFactorX, position.y * scaleFactorY);

    // Draw the image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let renderW = targetWidth;
    let renderH = targetWidth / imgAspect;

    if (renderH < targetHeight) {
      renderH = targetHeight;
      renderW = targetHeight * imgAspect;
    }

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();

    try {
      const croppedDataUrl = canvas.toDataURL('image/webp', 0.88);
      onConfirm(croppedDataUrl);
    } catch {
      // Fallback
      onConfirm(imageSrc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              <Move className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                {title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Geser (drag) foto untuk mengatur posisi, gunakan zoom & rotasi agar pas di bingkai
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Frame */}
        <div className="relative flex-1 bg-stone-950 p-4 flex items-center justify-center overflow-hidden min-h-[320px] select-none">
          <div
            ref={containerRef}
            className="relative overflow-hidden shadow-2xl border-2 border-emerald-500/80 rounded-2xl cursor-grab active:cursor-grabbing w-full max-w-[500px]"
            style={{
              aspectRatio: aspectRatio > 0 ? `${aspectRatio}` : '16/9',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Guide Grid overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20 z-10">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-r border-white/10" />
              <div />
            </div>

            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="w-full h-full object-cover transition-transform duration-75 will-change-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              }}
              draggable={false}
            />
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-white/70 bg-black/60 px-3 py-1.5 rounded-full pointer-events-none">
            <span>Tahan dan geser foto di dalam bingkai</span>
            <span>Zoom: {Math.round(scale * 100)}%</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-28 accent-emerald-600"
            />
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(3, s + 0.15))}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1 text-xs font-medium ml-2"
              title="Putar 90 Derajat"
            >
              <RotateCw className="w-4 h-4" />
              <span>{rotation}°</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScale(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 ml-1 underline"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Hasil Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
