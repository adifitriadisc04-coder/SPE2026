import React, { useState } from 'react';
import { SchoolMemoryPhoto } from '../types';
import { ChevronLeft, ChevronRight, History, Calendar, Sparkles, Image as ImageIcon } from 'lucide-react';

interface SchoolMemoriesSliderProps {
  memories: SchoolMemoryPhoto[];
  onOpenPhotoModal?: (photo: SchoolMemoryPhoto) => void;
}

export const SchoolMemoriesSlider: React.FC<SchoolMemoriesSliderProps> = ({
  memories,
  onOpenPhotoModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!memories || memories.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-stone-300 dark:border-stone-700 rounded-3xl bg-stone-50 dark:bg-stone-900/50 text-stone-500">
        <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Belum ada foto memori sekolah masa lalu.</p>
      </div>
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

  const current = memories[currentIndex];

  return (
    <div className="mt-8 bg-gradient-to-br from-stone-900 to-[#10291b] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-700/50 relative overflow-hidden">
      {/* Background ornamentation */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <History className="w-5 h-5" />
          </span>
          <div>
            <h4 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
              <span>Nostalgia & Memori Sekolah Lama</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>
            <p className="text-xs text-stone-300">
              Mengenang tapak tilas sejarah, gedung tempo dulu, dan kenangan indah sekolah kaki langit
            </p>
          </div>
        </div>

        {/* Counter & navigation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-stone-300">
            {currentIndex + 1} / {memories.length}
          </span>
          <button
            type="button"
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Foto Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Foto Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Foto Frame with vintage border */}
        <div className="lg:col-span-7">
          <div
            className="group relative aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-black/50 border border-white/15 shadow-2xl cursor-pointer"
            onClick={() => onOpenPhotoModal && onOpenPhotoModal(current)}
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
              <Calendar className="w-3 h-3" />
              <span>Tahun {current.year}</span>
            </div>

            <div className="absolute bottom-3 right-3 text-xs text-white/80 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Klik untuk perbesar</span>
            </div>
          </div>
        </div>

        {/* Narrative & Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            Arsip Sejarah Sekolah
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2 leading-snug">
            {current.title}
          </h3>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">
            {current.caption || "Dokumentasi kenangan berharga perjalanan SDN Sucopangepok 04."}
          </p>

          {/* Thumbnail track selector */}
          <div className="mt-2 pt-3 border-t border-white/10">
            <span className="text-xs text-stone-400 block mb-2 font-medium">
              Pilih Album Nostalgia:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {memories.map((m, idx) => (
                <button
                  key={m.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-none w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-amber-400 scale-105 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  title={m.title}
                >
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white py-0.5 font-mono">
                    {m.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
