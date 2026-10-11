import React, { useState } from 'react';
import { SchoolWebsiteData, TypographySettings, SchoolMemoryPhoto, FacilityItem, TeacherItem, PrincipalHistoryItem, HallOfFameItem, GalleryAlbum, AchievementItem, CalendarEvent, NewsItem, GuestbookEntry } from '../types';
import { TypographyCustomizer } from './TypographyCustomizer';
import { BackupRestoreModal } from './BackupRestoreModal';
import { ImageCropModal } from './ImageCropModal';
import {
  Building2, Home, UserCheck, BookOpen, Layers, Users, Image as ImageIcon, Calendar,
  Newspaper, PhoneCall, Type, MessageSquare, Key, Eye, Monitor, Smartphone, Download,
  Cloud, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, Crop, Save, Check, Shield, ExternalLink,
  ChevronRight, Sparkles, LogOut, CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  data: SchoolWebsiteData;
  onUpdateData: (newData: SchoolWebsiteData) => void;
  onPreview: (device: 'desktop' | 'mobile') => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onUpdateData,
  onPreview,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>('identitas');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [cropModalConfig, setCropModalConfig] = useState<{
    isOpen: boolean;
    imageSrc: string;
    aspectRatio: number;
    title: string;
    onApply: (cropped: string) => void;
  }>({
    isOpen: false,
    imageSrc: '',
    aspectRatio: 16 / 9,
    title: '',
    onApply: () => {},
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper setter for direct properties
  const updateData = <K extends keyof SchoolWebsiteData>(key: K, value: SchoolWebsiteData[K]) => {
    const updated = {
      ...data,
      [key]: value,
      stamp: Date.now(),
    };
    onUpdateData(updated);
    showNotification("Perubahan berhasil tersimpan.");
  };

  // Image Upload with immediate Crop Modal Trigger (Poin 4)
  const handleImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    aspectRatio: number,
    title: string,
    onFinish: (resultUrl: string) => void
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const originalDataUrl = event.target?.result as string;
      setCropModalConfig({
        isOpen: true,
        imageSrc: originalDataUrl,
        aspectRatio,
        title,
        onApply: (croppedUrl) => {
          onFinish(croppedUrl);
          setCropModalConfig((prev) => ({ ...prev, isOpen: false }));
          showNotification("Foto berhasil dipotong dan disesuaikan!");
        },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const menuItems = [
    { id: 'identitas', label: '1. Identitas Sekolah', icon: Building2 },
    { id: 'beranda', label: '2. Beranda & Statistik', icon: Home },
    { id: 'sambutan', label: '3. Sambutan Kepala Sekolah', icon: UserCheck },
    { id: 'profil', label: '4. Profil & Memori Sekolah Lama', icon: BookOpen },
    { id: 'fasilitas', label: '5. Fasilitas & Lingkungan', icon: Layers },
    { id: 'guru', label: '6. Dewan Guru & Staf', icon: Users },
    { id: 'galeri', label: '7. Galeri Foto & Prestasi', icon: ImageIcon },
    { id: 'agenda', label: '8. Agenda & Kalender', icon: Calendar },
    { id: 'berita', label: '9. Berita & Pengumuman', icon: Newspaper },
    { id: 'kontak', label: '10. WhatsApp & Media Sosial', icon: PhoneCall },
    { id: 'tipografi', label: '11. Kustomisasi Huruf & Format Teks', icon: Type },
    { id: 'bukutamu', label: '12. Kelola Buku Tamu', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-700 text-white">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">
                Panel Admin SDN Sucopangepok 04
              </h1>
              <p className="text-[11px] text-stone-400">
                Pusat Manajemen Konten, Foto Memori, Font & Backup
              </p>
            </div>
          </div>

          {/* Quick Buttons: Preview (Desktop & Mobile) and Backup & Exit */}
          <div className="flex items-center gap-2">
            {/* 6. Mode Tampilan View Mobile & Desktop */}
            <div className="hidden sm:flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700">
              <button
                type="button"
                onClick={() => onPreview('desktop')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-stone-700 flex items-center gap-1.5 transition-colors text-stone-200"
                title="Preview Tampilan Website Desktop"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lihat Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => onPreview('mobile')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-stone-700 flex items-center gap-1.5 transition-colors text-stone-200"
                title="Preview Tampilan Website Mobile HP"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Lihat Mobile</span>
              </button>
            </div>

            {/* 9. Backup & Restore Button */}
            <button
              type="button"
              onClick={() => setIsBackupModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Backup & Restore</span>
            </button>

            {/* Keluar */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-800 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Mobile Preview Floating Access Bar */}
      <div className="sm:hidden bg-stone-800 border-b border-stone-700 px-4 py-2 flex items-center justify-between text-xs text-white">
        <span>Pratinjau Hasil Akhir:</span>
        <div className="flex gap-2">
          <button
            onClick={() => onPreview('mobile')}
            className="px-2.5 py-1 rounded-lg bg-amber-600 font-semibold flex items-center gap-1"
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => onPreview('desktop')}
            className="px-2.5 py-1 rounded-lg bg-stone-700 font-semibold flex items-center gap-1"
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-stone-900 rounded-3xl p-3 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-400">
            Daftar Modul Konten
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Editing Canvas */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: IDENTITAS SEKOLAH */}
          {activeTab === 'identitas' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Identitas Resmi & Informasi Kontak Sekolah
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={data.school.name}
                    onChange={(e) => updateData('school', { ...data.school, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    NPSN
                  </label>
                  <input
                    type="text"
                    value={data.school.npsn}
                    onChange={(e) => updateData('school', { ...data.school, npsn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Akreditasi
                  </label>
                  <input
                    type="text"
                    value={data.school.accreditation}
                    onChange={(e) => updateData('school', { ...data.school, accreditation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email Sekolah (Bisa Diklik Langsung)
                  </label>
                  <input
                    type="email"
                    value={data.school.email}
                    onChange={(e) => updateData('school', { ...data.school, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    No. Telepon / HP
                  </label>
                  <input
                    type="text"
                    value={data.school.phone}
                    onChange={(e) => updateData('school', { ...data.school, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    No. WhatsApp Resmi (Bisa Diklik Langsung)
                  </label>
                  <input
                    type="text"
                    value={data.school.whatsapp || ''}
                    onChange={(e) => updateData('school', { ...data.school, whatsapp: e.target.value })}
                    placeholder="Contoh: 085236111999"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={data.school.address}
                  onChange={(e) => updateData('school', { ...data.school, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Upload & Crop Logo Sekolah */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border p-1 flex-none">
                  <img src={data.school.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Ganti & Crop Logo Sekolah
                  </label>
                  <label className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 hover:bg-stone-900 transition-colors">
                    <Crop className="w-3.5 h-3.5" />
                    <span>Upload & Sesuaikan Bingkai Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileSelect(e, 1, "Crop Logo Sekolah (1:1)", (cropped) => {
                          updateData('school', { ...data.school, logo: cropped });
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BERANDA & STATISTIK */}
          {activeTab === 'beranda' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Pengaturan Teks & Foto Utama Beranda (Hero)
              </h2>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Judul Utama
                </label>
                <input
                  type="text"
                  value={data.hero.title}
                  onChange={(e) => updateData('hero', { ...data.hero, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Subjudul Keterangan
                </label>
                <textarea
                  rows={2}
                  value={data.hero.subtitle}
                  onChange={(e) => updateData('hero', { ...data.hero, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                />
              </div>

              {/* Upload & Crop Foto Hero (Poin 4) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Foto Utama Beranda (Rasio 4:3.5)
                  </span>
                  <label className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5" />
                    <span>Upload & Crop Foto Beranda</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileSelect(e, 4 / 3.4, "Sesuaikan & Crop Foto Utama Beranda", (cropped) => {
                          updateData('hero', { ...data.hero, image: cropped });
                        })
                      }
                    />
                  </label>
                </div>
                <div className="aspect-[4/2] rounded-xl overflow-hidden bg-black max-w-sm">
                  <img src={data.hero.image} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Kelola Statistik Cepat */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Statistik Singkat Sekolah
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newStats = [...data.hero.stats, { value: '0', label: 'Item Baru' }];
                      updateData('hero', { ...data.hero, stats: newStats });
                    }}
                    className="px-3 py-1 rounded-xl bg-stone-200 dark:bg-stone-800 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Statistik</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.hero.stats.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-2">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...data.hero.stats];
                          updated[idx].value = e.target.value;
                          updateData('hero', { ...data.hero, stats: updated });
                        }}
                        className="w-16 px-2 py-1 rounded-lg border text-sm font-bold text-center"
                        placeholder="Nilai"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...data.hero.stats];
                          updated[idx].label = e.target.value;
                          updateData('hero', { ...data.hero, stats: updated });
                        }}
                        className="flex-1 px-2 py-1 rounded-lg border text-xs"
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.hero.stats.filter((_, i) => i !== idx);
                          updateData('hero', { ...data.hero, stats: updated });
                        }}
                        className="text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAMBUTAN KEPALA SEKOLAH (REVISI 7: logo & tulisan sejajar dihapus dari publik) */}
          {activeTab === 'sambutan' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Data Kepala Sekolah & Naskah Sambutan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    value={data.principal.name}
                    onChange={(e) => updateData('principal', { ...data.principal, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={data.principal.nip}
                    onChange={(e) => updateData('principal', { ...data.principal, nip: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Upload & Crop Foto Kepala Sekolah */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-100 flex-none">
                  <img src={data.principal.photo} alt="Kepala Sekolah" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold block mb-1">Ganti & Crop Foto Kepala Sekolah (1:1 Persegi)</span>
                  <label className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                    <Crop className="w-3.5 h-3.5" />
                    <span>Upload & Crop Foto (1:1)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileSelect(e, 1, "Crop Foto Kepala Sekolah", (cropped) => {
                          updateData('principal', { ...data.principal, photo: cropped });
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Naskah Sambutan */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Judul Sambutan
                </label>
                <input
                  type="text"
                  value={data.welcome.title}
                  onChange={(e) => updateData('welcome', { ...data.welcome, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-semibold"
                />

                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Paragraf Sambutan
                </label>
                <textarea
                  rows={6}
                  value={data.welcome.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    updateData('welcome', { ...data.welcome, paragraphs: e.target.value.split('\n\n') })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  placeholder="Pisahkan paragraf dengan baris kosong ganda..."
                />
              </div>
            </div>
          )}

          {/* TAB 4: PROFIL & MEMORI SEKOLAH LAMA (POIN 1 & POIN 4) */}
          {activeTab === 'profil' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Profil Sekolah & Dokumentasi Memori Sekolah Lama
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Pengantar Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={data.profile.intro}
                    onChange={(e) => updateData('profile', { ...data.profile, intro: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Sejarah Pendirian & Perkembangan
                  </label>
                  <textarea
                    rows={5}
                    value={data.profile.history}
                    onChange={(e) => updateData('profile', { ...data.profile, history: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tautan Video YouTube Profil (Opsional)
                  </label>
                  <input
                    type="text"
                    value={data.profile.videoUrl || ''}
                    onChange={(e) => updateData('profile', { ...data.profile, videoUrl: e.target.value })}
                    placeholder="https://youtu.be/... atau https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm"
                  />
                </div>
              </div>

              {/* 1. KELOLA SLIDE FOTO MEMORI SEKOLAH LAMA (POIN 1 & POIN 4 DENGAN CROP/ZOOM) */}
              <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Slide Mengenal Masa-masa yang Lalu (Memori Sekolah Lama)</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Tambah, hapus, dan sesuaikan foto nostalgia gedung, murid zaman dulu, dan momen bersejarah
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newMemory: SchoolMemoryPhoto = {
                        id: `mem_${Date.now()}`,
                        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
                        title: "Kenangan Baru",
                        year: "1995",
                        caption: "Tuliskan keterangan kenangan bersejarah...",
                      };
                      updateData('profile', {
                        ...data.profile,
                        schoolMemories: [...(data.profile.schoolMemories || []), newMemory],
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto Memori</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.profile.schoolMemories || []).map((mem, idx) => (
                    <div
                      key={mem.id || idx}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      <div className="md:col-span-4 relative group">
                        <div className="aspect-video rounded-xl overflow-hidden bg-black border">
                          <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" />
                        </div>
                        <label className="mt-2 w-full py-1.5 px-3 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                          <Crop className="w-3.5 h-3.5" />
                          <span>Ganti & Crop Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileSelect(e, 16 / 10, "Crop Foto Memori Sekolah", (cropped) => {
                                const updated = [...data.profile.schoolMemories];
                                updated[idx].image = cropped;
                                updateData('profile', { ...data.profile, schoolMemories: updated });
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="md:col-span-7 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                              Judul Kenangan
                            </label>
                            <input
                              type="text"
                              value={mem.title}
                              onChange={(e) => {
                                const updated = [...data.profile.schoolMemories];
                                updated[idx].title = e.target.value;
                                updateData('profile', { ...data.profile, schoolMemories: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                              Tahun
                            </label>
                            <input
                              type="text"
                              value={mem.year}
                              onChange={(e) => {
                                const updated = [...data.profile.schoolMemories];
                                updated[idx].year = e.target.value;
                                updateData('profile', { ...data.profile, schoolMemories: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono text-center"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-500 mb-0.5">
                            Keterangan Cerita / Caption
                          </label>
                          <textarea
                            rows={2}
                            value={mem.caption}
                            onChange={(e) => {
                              const updated = [...data.profile.schoolMemories];
                              updated[idx].caption = e.target.value;
                              updateData('profile', { ...data.profile, schoolMemories: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border text-xs"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-1 flex md:flex-col items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.profile.schoolMemories.filter((_, i) => i !== idx);
                            updateData('profile', { ...data.profile, schoolMemories: updated });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Foto Memori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FASILITAS SEKOLAH */}
          {activeTab === 'fasilitas' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Kelola Sarana & Fasilitas Sekolah
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newFac: FacilityItem = {
                      id: `fac_${Date.now()}`,
                      name: "Fasilitas Baru",
                      description: "Keterangan fasilitas...",
                      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
                    };
                    updateData('facilities', [...data.facilities, newFac]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Fasilitas</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.facilities.map((fac, idx) => (
                  <div
                    key={fac.id || idx}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    <div className="md:col-span-4">
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black border">
                        <img src={fac.image} alt={fac.name} className="w-full h-full object-cover" />
                      </div>
                      <label className="mt-2 w-full py-1.5 px-3 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                        <Crop className="w-3.5 h-3.5" />
                        <span>Ganti & Crop Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileSelect(e, 16 / 9, "Crop Foto Fasilitas", (cropped) => {
                              const updated = [...data.facilities];
                              updated[idx].image = cropped;
                              updateData('facilities', updated);
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="md:col-span-7 space-y-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-500 mb-0.5">Nama Fasilitas</label>
                        <input
                          type="text"
                          value={fac.name}
                          onChange={(e) => {
                            const updated = [...data.facilities];
                            updated[idx].name = e.target.value;
                            updateData('facilities', updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-500 mb-0.5">Deskripsi Lengkap</label>
                        <textarea
                          rows={2}
                          value={fac.description}
                          onChange={(e) => {
                            const updated = [...data.facilities];
                            updated[idx].description = e.target.value;
                            updateData('facilities', updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-1 flex md:flex-col items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.facilities.filter((_, i) => i !== idx);
                          updateData('facilities', updated);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GURU DAN STAF */}
          {activeTab === 'guru' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Kelola Data Dewan Guru & Staf
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newTeacher: TeacherItem = {
                      id: `t_${Date.now()}`,
                      name: "Nama Guru Baru, S.Pd",
                      role: "Guru Kelas",
                      nip: "",
                      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                    };
                    updateData('teachers', [...data.teachers, newTeacher]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Guru / Staf</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.teachers.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex gap-4 items-center bg-stone-50 dark:bg-stone-800/40"
                  >
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-emerald-100 flex-none border">
                      <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                        <Crop className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileSelect(e, 1, "Crop Foto Guru (1:1)", (cropped) => {
                              const updated = [...data.teachers];
                              updated[idx].photo = cropped;
                              updateData('teachers', updated);
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...data.teachers];
                          updated[idx].name = e.target.value;
                          updateData('teachers', updated);
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border text-xs font-bold"
                        placeholder="Nama Lengkap & Gelar"
                      />
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => {
                          const updated = [...data.teachers];
                          updated[idx].role = e.target.value;
                          updateData('teachers', updated);
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border text-xs text-emerald-800"
                        placeholder="Jabatan / Tugas"
                      />
                      <input
                        type="text"
                        value={t.nip}
                        onChange={(e) => {
                          const updated = [...data.teachers];
                          updated[idx].nip = e.target.value;
                          updateData('teachers', updated);
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border text-[10px] font-mono"
                        placeholder="NIP (Opsional)"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.teachers.filter((_, i) => i !== idx);
                        updateData('teachers', updated);
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALERI & PRESTASI */}
          {activeTab === 'galeri' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Kelola Album Foto & Prestasi Sekolah
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newAlb: GalleryAlbum = {
                      id: `alb_${Date.now()}`,
                      title: "Album Baru",
                      date: new Date().toISOString().slice(0, 10),
                      photos: [
                        "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
                      ],
                    };
                    updateData('gallery', [...data.gallery, newAlb]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Album</span>
                </button>
              </div>

              {/* List Albums */}
              <div className="space-y-4">
                {data.gallery.map((alb, idx) => (
                  <div
                    key={alb.id || idx}
                    className="p-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          value={alb.title}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[idx].title = e.target.value;
                            updateData('gallery', updated);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-bold"
                          placeholder="Judul Album"
                        />
                        <input
                          type="date"
                          value={alb.date}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[idx].date = e.target.value;
                            updateData('gallery', updated);
                          }}
                          className="px-2 py-1.5 rounded-lg border text-xs font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Foto ke Album</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileSelect(e, 4 / 3, "Crop & Tambah Foto Album", (cropped) => {
                                const updated = [...data.gallery];
                                updated[idx].photos.push(cropped);
                                updateData('gallery', updated);
                              })
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.gallery.filter((_, i) => i !== idx);
                            updateData('gallery', updated);
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail list */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {alb.photos.map((ph, pIdx) => (
                        <div key={pIdx} className="relative group w-20 h-16 rounded-lg overflow-hidden border flex-none">
                          <img src={ph} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...data.gallery];
                              updated[idx].photos = updated[idx].photos.filter((_, i) => i !== pIdx);
                              updateData('gallery', updated);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AGENDA SEKOLAH */}
          {activeTab === 'agenda' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Kelola Agenda & Kalender Kegiatan
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newEv: CalendarEvent = {
                      id: `ev_${Date.now()}`,
                      date: new Date().toISOString().slice(0, 10),
                      title: "Agenda Baru",
                      type: "kegiatan",
                    };
                    updateData('events', [...data.events, newEv]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Agenda</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {data.events.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    className="p-3 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-wrap items-center gap-3 bg-stone-50 dark:bg-stone-800/40"
                  >
                    <input
                      type="date"
                      value={ev.date}
                      onChange={(e) => {
                        const updated = [...data.events];
                        updated[idx].date = e.target.value;
                        updateData('events', updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={ev.title}
                      onChange={(e) => {
                        const updated = [...data.events];
                        updated[idx].title = e.target.value;
                        updateData('events', updated);
                      }}
                      className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border text-xs font-bold"
                      placeholder="Nama Kegiatan"
                    />
                    <select
                      value={ev.type}
                      onChange={(e) => {
                        const updated = [...data.events];
                        updated[idx].type = e.target.value as any;
                        updateData('events', updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
                    >
                      <option value="kegiatan">Kegiatan</option>
                      <option value="akademik">Akademik</option>
                      <option value="nasional">Nasional</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.events.filter((_, i) => i !== idx);
                        updateData('events', updated);
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: BERITA & PENGUMUMAN */}
          {activeTab === 'berita' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                  Kelola Berita & Artikel Sekolah
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const newNews: NewsItem = {
                      id: `news_${Date.now()}`,
                      category: "Pengumuman",
                      date: new Date().toISOString().slice(0, 10),
                      title: "Judul Berita Baru",
                      excerpt: "Ringkasan berita singkat...",
                      body: "Isi lengkap berita sekolah...",
                      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
                    };
                    updateData('news', [newNews, ...data.news]);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.news.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...data.news];
                            updated[idx].category = e.target.value;
                            updateData('news', updated);
                          }}
                          className="w-28 px-2 py-1 rounded-lg border text-xs font-bold"
                          placeholder="Kategori"
                        />
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => {
                            const updated = [...data.news];
                            updated[idx].date = e.target.value;
                            updateData('news', updated);
                          }}
                          className="px-2 py-1 rounded-lg border text-xs font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.news.filter((_, i) => i !== idx);
                          updateData('news', updated);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...data.news];
                        updated[idx].title = e.target.value;
                        updateData('news', updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border text-sm font-bold"
                      placeholder="Judul Berita"
                    />

                    <textarea
                      rows={2}
                      value={item.excerpt}
                      onChange={(e) => {
                        const updated = [...data.news];
                        updated[idx].excerpt = e.target.value;
                        updateData('news', updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      placeholder="Ringkasan singkat yang muncul di kartu depan..."
                    />

                    <textarea
                      rows={4}
                      value={item.body}
                      onChange={(e) => {
                        const updated = [...data.news];
                        updated[idx].body = e.target.value;
                        updateData('news', updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      placeholder="Isi lengkap artikel..."
                    />

                    <div className="flex items-center gap-3 pt-1">
                      <label className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1">
                        <Crop className="w-3.5 h-3.5" />
                        <span>Ganti & Crop Gambar Berita</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileSelect(e, 16 / 9, "Crop Gambar Berita", (cropped) => {
                              const updated = [...data.news];
                              updated[idx].image = cropped;
                              updateData('news', updated);
                            })
                          }
                        />
                      </label>
                      {item.image && (
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          Gambar terpasang
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: WHATSAPP & SOSIAL MEDIA */}
          {activeTab === 'kontak' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Pengaturan WhatsApp & Tautan Media Sosial
              </h2>

              {/* WhatsApp Config */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-stone-800/60 border border-emerald-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                    <span>Tombol WhatsApp Mengambang (Floating Button)</span>
                  </span>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <span>Aktifkan:</span>
                    <input
                      type="checkbox"
                      checked={data.whatsapp.enabled}
                      onChange={(e) =>
                        updateData('whatsapp', { ...data.whatsapp, enabled: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-600"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      value={data.whatsapp.number}
                      onChange={(e) =>
                        updateData('whatsapp', { ...data.whatsapp, number: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      placeholder="Contoh: 085236111999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Label Tombol
                    </label>
                    <input
                      type="text"
                      value={data.whatsapp.label}
                      onChange={(e) =>
                        updateData('whatsapp', { ...data.whatsapp, label: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                    Template Pesan Pembuka Otomatis
                  </label>
                  <input
                    type="text"
                    value={data.whatsapp.message}
                    onChange={(e) =>
                      updateData('whatsapp', { ...data.whatsapp, message: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Tautan Media Sosial Resmi
                </h3>
                {([
                  ['instagram', 'Instagram', 'https://instagram.com/sdn.sucopangepok04'],
                  ['tiktok', 'TikTok', 'https://tiktok.com/@sucopangepok04'],
                  ['facebook', 'Facebook', 'https://facebook.com/sdnsucopangepok04'],
                  ['youtube', 'YouTube', 'https://youtube.com/@sdnsucopangepok04'],
                ] as const).map(([key, label, ph]) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl border">
                    <input
                      type="checkbox"
                      checked={data.social[key].enabled}
                      onChange={(e) =>
                        updateData('social', {
                          ...data.social,
                          [key]: { ...data.social[key], enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className="w-24 text-xs font-bold">{label}</span>
                    <input
                      type="text"
                      value={data.social[key].url}
                      onChange={(e) =>
                        updateData('social', {
                          ...data.social,
                          [key]: { ...data.social[key], url: e.target.value },
                        })
                      }
                      placeholder={ph}
                      className="flex-1 px-3 py-1 rounded-lg border text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: TIPOGRAFI & KUSTOMISASI FONT LENGKAP (POIN 2) */}
          {activeTab === 'tipografi' && (
            <TypographyCustomizer
              settings={data.typography}
              onChange={(newSettings) => updateData('typography', newSettings)}
            />
          )}

          {/* TAB 12: BUKU TAMU */}
          {activeTab === 'bukutamu' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Kelola Pesan Buku Tamu
              </h2>
              <div className="space-y-3">
                {data.guestbook.map((gb, idx) => (
                  <div
                    key={gb.id || idx}
                    className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <b className="text-sm font-bold block">{gb.name} {gb.origin ? `(${gb.origin})` : ''}</b>
                      <span className="text-[10px] text-stone-400 font-mono block">{gb.date}</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300">{gb.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                        <span>Tampilkan di web:</span>
                        <input
                          type="checkbox"
                          checked={gb.approved}
                          onChange={(e) => {
                            const updated = [...data.guestbook];
                            updated[idx].approved = e.target.checked;
                            updateData('guestbook', updated);
                          }}
                          className="w-4 h-4 accent-emerald-600"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.guestbook.filter((_, i) => i !== idx);
                          updateData('guestbook', updated);
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: CROP & ZOOM FOTO (POIN 4) */}
      <ImageCropModal
        isOpen={cropModalConfig.isOpen}
        imageSrc={cropModalConfig.imageSrc}
        aspectRatio={cropModalConfig.aspectRatio}
        title={cropModalConfig.title}
        onConfirm={cropModalConfig.onApply}
        onCancel={() => setCropModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* MODAL 2: BACKUP & RESTORE LOKAL / CLOUD (POIN 9) */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        data={data}
        onRestore={(restoredData) => {
          onUpdateData(restoredData);
          showNotification("Data website berhasil dipulihkan dari cadangan!");
        }}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
};
