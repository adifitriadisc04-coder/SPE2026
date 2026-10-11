import React, { useState } from 'react';
import { TypographySettings } from '../types';
import { Type, AlignLeft, AlignJustify, AlignCenter, AlignRight, Palette, Sliders, RotateCcw } from 'lucide-react';

interface TypographyCustomizerProps {
  settings: TypographySettings;
  onChange: (newSettings: TypographySettings) => void;
}

export const FONT_OPTIONS_HEADING = [
  { label: 'Fraunces (Serif Hangat Elegan)', value: 'Fraunces' },
  { label: 'Playfair Display (Serif Klasik Akademik)', value: 'Playfair Display' },
  { label: 'Lora (Serif Kontemporer)', value: 'Lora' },
  { label: 'Cinzel (Serif Megah Monumen)', value: 'Cinzel' },
  { label: 'Merriweather (Serif Formal Kokoh)', value: 'Merriweather' },
  { label: 'Plus Jakarta Sans (Modern Standar)', value: 'Plus Jakarta Sans' },
  { label: 'Poppins (Geometris Ramah)', value: 'Poppins' },
  { label: 'Montserrat (Tegas Profesional)', value: 'Montserrat' },
];

export const FONT_OPTIONS_BODY = [
  { label: 'Plus Jakarta Sans (Bawaan Resmi)', value: 'Plus Jakarta Sans' },
  { label: 'Inter (Sangat Jelas & Terbaca)', value: 'Inter' },
  { label: 'Roboto (Sederhana Netral)', value: 'Roboto' },
  { label: 'Open Sans (Lugas Bersih)', value: 'Open Sans' },
  { label: 'Nunito (Membulat Ramah Anak)', value: 'Nunito' },
  { label: 'Quicksand (Lembut Nyaman)', value: 'Quicksand' },
];

const PRESET_COLORS = [
  { label: 'Hijau Daun Hutan (Resmi)', value: '#153f29' },
  { label: 'Hijau Tua Alam', value: '#1b5033' },
  { label: 'Biru Tua Akademik', value: '#1e3a8a' },
  { label: 'Coklat Tua Kayu', value: '#3e2723' },
  { label: 'Abu Arang Gelap', value: '#1c2420' },
  { label: 'Hitam Netral', value: '#111827' },
];

export const TypographyCustomizer: React.FC<TypographyCustomizerProps> = ({
  settings,
  onChange,
}) => {
  const updateField = <K extends keyof TypographySettings>(field: K, val: TypographySettings[K]) => {
    onChange({
      ...settings,
      [field]: val,
    });
  };

  const resetToDefault = () => {
    onChange({
      headingFont: "Fraunces",
      bodyFont: "Plus Jakarta Sans",
      fontSizeScale: "normal",
      headingColor: "#153f29",
      bodyColor: "#1c2420",
      paragraphAlignment: "justify",
      lineHeight: "relaxed",
    });
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Type className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-white text-lg">
              Kustomisasi Tipografi & Format Teks Lengkap
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ubah jenis huruf, skala ukuran, warna, dan perataan kalimat agar website tampil otomatis rapi
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetToDefault}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Jenis Font Judul */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Jenis Huruf Judul (Headings)
          </label>
          <select
            value={settings.headingFont}
            onChange={(e) => updateField('headingFont', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {FONT_OPTIONS_HEADING.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Font Isi Paragraf */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Jenis Huruf Isi Paragraf (Body Text)
          </label>
          <select
            value={settings.bodyFont}
            onChange={(e) => updateField('bodyFont', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {FONT_OPTIONS_BODY.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Besar Kecil Huruf */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Besar Kecil Huruf (Skala Ukuran)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                ['small', 'Kecil'],
                ['normal', 'Standar'],
                ['large', 'Besar'],
                ['xlarge', 'Sangat Besar'],
              ] as const
            ).map(([scale, label]) => (
              <button
                key={scale}
                type="button"
                onClick={() => updateField('fontSizeScale', scale)}
                className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-all text-center ${
                  settings.fontSizeScale === scale
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Perataan Paragraf (Alignment Otomatis) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Perataan Paragraf (Alignment Rata Otomatis)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 'justify', label: 'Rata Kanan Kiri', icon: AlignJustify },
              { val: 'left', label: 'Rata Kiri', icon: AlignLeft },
              { val: 'center', label: 'Rata Tengah', icon: AlignCenter },
              { val: 'right', label: 'Rata Kanan', icon: AlignRight },
            ].map(({ val, label, icon: Icon }) => (
              <button
                key={val}
                type="button"
                onClick={() => updateField('paragraphAlignment', val as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium gap-1 transition-all ${
                  settings.paragraphAlignment === val
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] leading-tight text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Warna Huruf Judul */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Warna Teks Judul
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.headingColor || '#153f29'}
              onChange={(e) => updateField('headingColor', e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 dark:border-stone-700 p-0.5 bg-transparent"
            />
            <input
              type="text"
              value={settings.headingColor}
              onChange={(e) => updateField('headingColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs"
              placeholder="#153f29"
            />
          </div>
          <div className="flex gap-1.5 mt-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => updateField('headingColor', c.value)}
                style={{ backgroundColor: c.value }}
                className="w-5 h-5 rounded-full border border-stone-300 shadow-xs hover:scale-110 transition-transform"
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Warna Huruf Isi Paragraf */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Warna Teks Paragraf
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.bodyColor || '#1c2420'}
              onChange={(e) => updateField('bodyColor', e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-stone-300 dark:border-stone-700 p-0.5 bg-transparent"
            />
            <input
              type="text"
              value={settings.bodyColor}
              onChange={(e) => updateField('bodyColor', e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs"
              placeholder="#1c2420"
            />
          </div>
          <div className="flex gap-1.5 mt-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => updateField('bodyColor', c.value)}
                style={{ backgroundColor: c.value }}
                className="w-5 h-5 rounded-full border border-stone-300 shadow-xs hover:scale-110 transition-transform"
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Contoh Tampilan Paragraf Nyata:
        </span>
        <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80">
          <h4
            style={{
              fontFamily: `'${settings.headingFont}', serif`,
              color: settings.headingColor,
            }}
            className="text-xl font-bold mb-2"
          >
            SDN Sucopangepok 04 - Sekolah Kaki Langit
          </h4>
          <p
            style={{
              fontFamily: `'${settings.bodyFont}', sans-serif`,
              color: settings.bodyColor,
              textAlign: settings.paragraphAlignment,
            }}
            className={`text-sm leading-relaxed ${
              settings.fontSizeScale === 'small'
                ? 'text-xs'
                : settings.fontSizeScale === 'large'
                ? 'text-base'
                : settings.fontSizeScale === 'xlarge'
                ? 'text-lg'
                : 'text-sm'
            }`}
          >
            Pendidikan karakter di lereng pegunungan Argopuro yang mengedepankan pembiasaan ibadah religius,
            pemanfaatan IPTEK terbarukan, dan kepedulian terhadap kelestarian alam lingkungan sekitar.
            Setiap kata dan kalimat tersusun rapi otomatis menyesuaikan kenyamanan membaca Anda.
          </p>
        </div>
      </div>
    </div>
  );
};
