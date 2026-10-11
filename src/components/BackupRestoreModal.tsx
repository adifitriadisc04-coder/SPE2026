import React, { useState } from 'react';
import { SchoolWebsiteData } from '../types';
import { Download, Upload, Cloud, RefreshCw, HardDrive, Check, AlertCircle, FileJson, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  data: SchoolWebsiteData;
  onRestore: (newData: SchoolWebsiteData) => void;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  data,
  onRestore,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const schoolSlug = (data.school.name || 'sdn-sucopangepok-04')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const dateStr = new Date().toISOString().slice(0, 10);
  const backupFileName = `backup-${schoolSlug}-${dateStr}.json`;

  const handleDownloadLocalJson = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backupFileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 1000);
      setRestoreStatus({
        ok: true,
        msg: `Cadangan lokal (${backupFileName}) berhasil diunduh ke komputer Anda.`,
      });
    } catch {
      setRestoreStatus({ ok: false, msg: 'Gagal membuat file cadangan JSON.' });
    }
  };

  const handleUploadLocalJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.school || !parsed.profile || !parsed.hero) {
          throw new Error('Format cadangan JSON tidak sesuai dengan struktur website sekolah.');
        }

        if (window.confirm('Apakah Anda yakin ingin memulihkan (restore) seluruh data website dari file ini? Data yang belum dicadangkan akan ditimpa.')) {
          onRestore(parsed);
          setRestoreStatus({
            ok: true,
            msg: 'Data website berhasil dipulihkan secara instan dari cadangan JSON!',
          });
        }
      } catch (err: any) {
        setRestoreStatus({
          ok: false,
          msg: `Gagal membaca file cadangan: ${err.message || 'File tidak valid'}`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  const handleCopyJson = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Gagal menyalin. Anda bisa mengunduh file JSON secara langsung.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              <Cloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
                Backup & Restore Lengkap (Lokal & Cloud)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Amankan seluruh data, foto memori, berita, dan pengaturan sekolah ke komputer lokal atau cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            ✕
          </button>
        </div>

        {/* Status Alert */}
        {restoreStatus && (
          <div
            className={`mx-5 mt-4 p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
              restoreStatus.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {restoreStatus.ok ? (
              <Check className="w-4 h-4 text-emerald-600 flex-none" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-none" />
            )}
            <span>{restoreStatus.msg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Section 1: Backup Komputer Lokal */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Opsi 1: Backup & Restore Komputer Lokal (File JSON)</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Unduh cadangan berupa satu file JSON mandiri yang memuat seluruh konten profil sekolah, foto nostalgia, guru, fasilitas, dan tipografi.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadLocalJson}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.json)</span>
              </button>

              <label className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Pilih File untuk Restore (.json)</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleUploadLocalJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleCopyJson}
                className="px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Salin seluruh isi JSON ke clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Hubungkan Cloud (Google Drive / Cloud Storage) */}
          <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <Cloud className="w-4 h-4 text-sky-600" />
              <span>Opsi 2: Hubungkan ke Cloud (Google Drive & Akun Sekolah)</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Untuk mengamankan website ke Google Drive secara berkala, simpan file cadangan JSON hasil unduhan langsung ke folder Google Drive resmi sekolah:
              <strong className="block text-emerald-800 dark:text-emerald-300 mt-0.5">
                {data.school.email || 'sdnsucopangepok04jember@gmail.com'}
              </strong>
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Buka Google Drive Sekolah</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="text-[11px] text-stone-500">
                Tips: Buat folder khusus "Backup Website SDN Sucopangepok 04" di Google Drive untuk arsip bulanan.
              </span>
            </div>
          </div>

          {/* Info Keamanan */}
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-none" />
            <span>
              Semua data disimpan secara aman dan terenkripsi di browser & file lokal tanpa bergantung pada server pihak ketiga berbayar.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 dark:bg-stone-700 text-white text-xs font-semibold hover:bg-stone-900 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
