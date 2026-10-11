import React, { useState } from 'react';
import { SchoolWebsiteData, TypographySettings } from '../types';
import { HeaderClock } from './HeaderClock';
import { SchoolMemoriesSlider } from './SchoolMemoriesSlider';
import { 
  MapPin, Phone, Mail, ArrowRight, Play, Award, Calendar, ChevronLeft, ChevronRight, 
  ExternalLink, MessageCircle, Moon, Sun, Menu, X, Shield, History, Send, Check, Heart,
  Eye, Monitor, Smartphone, BookOpen, Clock, Users, Building, ShieldCheck
} from 'lucide-react';

interface PublicSiteViewProps {
  data: SchoolWebsiteData;
  isAdmin?: boolean;
  isPreviewMode?: boolean;
  previewDevice?: 'desktop' | 'mobile';
  onEnterAdmin?: () => void;
  onExitPreview?: () => void;
  onToggleTheme?: () => void;
  currentTheme?: 'light' | 'dark';
}

export const PublicSiteView: React.FC<PublicSiteViewProps> = ({
  data,
  isAdmin = false,
  isPreviewMode = false,
  previewDevice = 'desktop',
  onEnterAdmin,
  onExitPreview,
  onToggleTheme,
  currentTheme = 'light',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFacilityIdx, setActiveFacilityIdx] = useState(0);
  const [galleryTab, setGalleryTab] = useState<'galeri' | 'prestasi'>('galeri');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState<number | null>(null);
  const [selectedAlbumPhotoIdx, setSelectedAlbumPhotoIdx] = useState(0);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [guestbookForm, setGuestbookForm] = useState({ name: '', origin: '', message: '' });
  const [guestbookSubmitted, setGuestbookSubmitted] = useState(false);

  const { school, hero, principal, welcome, profile, facilities, teachers, gallery, achievements, events, news, whatsapp, typography, theme, guestbook } = data;

  // Font and typography style computation
  const fontStyleVars = {
    fontFamily: `'${typography.bodyFont}', sans-serif`,
    color: typography.bodyColor || '#1c2420',
  };

  const headingStyleVars = {
    fontFamily: `'${typography.headingFont}', serif`,
    color: typography.headingColor || '#153f29',
  };

  const getFontSizeClass = () => {
    switch (typography.fontSizeScale) {
      case 'small': return 'text-[15px]';
      case 'large': return 'text-[17px]';
      case 'xlarge': return 'text-[18px]';
      default: return 'text-[16px]';
    }
  };

  const getParagraphAlignClass = () => {
    switch (typography.paragraphAlignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-justify';
    }
  };

  const getLineHeightClass = () => {
    switch (typography.lineHeight) {
      case 'tight': return 'leading-snug';
      case 'normal': return 'leading-normal';
      default: return 'leading-relaxed';
    }
  };

  // Video embed url parser
  const getYoutubeEmbed = (url: string) => {
    const match = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url || '');
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : '';
  };

  const youtubeEmbedUrl = getYoutubeEmbed(profile.videoUrl);

  const cleanWaNumber = (whatsapp.number || '').replace(/\D/g, '');
  const waChatUrl = cleanWaNumber
    ? `https://wa.me/${cleanWaNumber.startsWith('0') ? '62' + cleanWaNumber.slice(1) : cleanWaNumber}?text=${encodeURIComponent(
        whatsapp.message || 'Halo SDN Sucopangepok 04'
      )}`
    : '';

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookForm.name || !guestbookForm.message) return;

    if (whatsapp.enabled && waChatUrl) {
      const waText = `Halo SDN Sucopangepok 04, saya ${guestbookForm.name}${
        guestbookForm.origin ? ` (${guestbookForm.origin})` : ''
      }:\n\n${guestbookForm.message}`;
      window.open(
        `https://wa.me/${cleanWaNumber.startsWith('0') ? '62' + cleanWaNumber.slice(1) : cleanWaNumber}?text=${encodeURIComponent(
          waText
        )}`,
        '_blank'
      );
    } else if (school.email) {
      window.open(
        `mailto:${school.email}?subject=Buku Tamu Website&body=${encodeURIComponent(
          `Nama: ${guestbookForm.name}\nAsal: ${guestbookForm.origin}\nPesan: ${guestbookForm.message}`
        )}`
      );
    }

    setGuestbookSubmitted(true);
    setGuestbookForm({ name: '', origin: '', message: '' });
  };

  const approvedGuestbook = guestbook.filter((g) => g.approved);

  return (
    <div
      style={fontStyleVars}
      className={`min-h-screen bg-[#fbf7ee] dark:bg-[#0e1611] text-[#1c2420] dark:text-[#e6eee8] transition-colors duration-200 ${getFontSizeClass()}`}
    >
      {/* 3. Penambahan Hari, Tanggal, dan Waktu Otomatis & Email & HP/WA yang bisa diklik */}
      <HeaderClock school={school} whatsappEnabled={whatsapp.enabled} />

      {/* Mode Preview Bar Banner jika sedang mode preview */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>MODE PREVIEW WEBSITE SEBELUM PUBLISH ({previewDevice === 'mobile' ? 'TAMPILAN MOBILE' : 'TAMPILAN DESKTOP'})</span>
          </div>
          <button
            onClick={onExitPreview}
            className="px-3 py-1 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Kembali ke Edit / Keluar Preview
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#fbf7ee]/90 dark:bg-[#0e1611]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#beranda" className="flex items-center gap-3 group">
            {school.logo ? (
              <img
                src={school.logo}
                alt="Logo Sekolah"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center">
                04
              </div>
            )}
            <div>
              <span
                style={headingStyleVars}
                className="font-bold text-base sm:text-lg tracking-tight block leading-tight text-emerald-950 dark:text-emerald-100"
              >
                {school.name}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 block">
                {school.location || 'Kabupaten Jember, Jawa Timur'}
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-stone-600 dark:text-stone-300">
            <a href="#beranda" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Beranda
            </a>
            <a href="#sambutan" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Sambutan
            </a>
            <a href="#profil" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Profil
            </a>
            <a href="#fasilitas" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Fasilitas
            </a>
            <a href="#guru" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Dewan Guru
            </a>
            <a href="#galeri" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Galeri
            </a>
            <a href="#agenda" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Agenda
            </a>
            <a href="#berita" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Berita
            </a>
            <a href="#kontak" className="px-3 py-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors">
              Kontak
            </a>
          </nav>

          {/* Tools & Actions */}
          <div className="flex items-center gap-2">
            {theme.allowToggle && onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
                title="Ganti Tema Terang/Gelap"
              >
                {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
              </button>
            )}

            {isAdmin && onEnterAdmin && !isPreviewMode && (
              <button
                onClick={onEnterAdmin}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Admin</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-stone-200 dark:border-stone-800 bg-[#fbf7ee] dark:bg-[#0e1611] px-4 py-4 space-y-2 text-sm font-semibold">
            {['beranda', 'sambutan', 'profil', 'fasilitas', 'guru', 'galeri', 'agenda', 'berita', 'kontak'].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl capitalize hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
              >
                {sec}
              </a>
            ))}
            {isAdmin && onEnterAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterAdmin();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold flex items-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buka Panel Edit Admin</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="beranda" className="pt-8 pb-16 sm:pt-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-300 dark:border-amber-700/50">
                <MapPin className="w-3.5 h-3.5" />
                <span>Sekolah Kaki Langit • 800 mdpl Lereng Argopuro</span>
              </div>

              <h1
                style={headingStyleVars}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight"
              >
                {hero.title}
              </h1>

              <p className={`text-stone-600 dark:text-stone-300 max-w-2xl ${getParagraphAlignClass()} ${getLineHeightClass()}`}>
                {hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#profil"
                  className="px-6 py-3 rounded-full bg-[#1b5033] hover:bg-[#153f29] text-white font-semibold text-sm shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Kenali Sekolah Kami</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {whatsapp.enabled && waChatUrl && (
                  <a
                    href={waChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-sm flex items-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Tanya Pendaftaran</span>
                  </a>
                )}
              </div>

              {/* Stats Bar */}
              {hero.stats && hero.stats.length > 0 && (
                <div className="pt-6 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {hero.stats.map((st, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <b
                        style={headingStyleVars}
                        className="text-2xl sm:text-3xl font-bold block leading-none text-emerald-800 dark:text-emerald-400"
                      >
                        {st.value}
                      </b>
                      <span className="text-xs text-stone-500 dark:text-stone-400 leading-tight block">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Image Art */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3.5] rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800">
                <img
                  src={hero.image}
                  alt={school.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <p className="font-semibold">{school.name}</p>
                  <p className="text-[11px] text-stone-300">NPSN: {school.npsn} • Akreditasi {school.accreditation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMBUTAN KEPALA SEKOLAH - REVISI 7: Logo dan tulisan sejajar SDN Sucopangepok 04 yang sejajar sambutan dihilangkan */}
      <section id="sambutan" className="py-16 sm:py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Kartu Profil Kepala Sekolah */}
            <div className="lg:col-span-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 text-center shadow-sm">
              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden shadow-md mb-4 bg-emerald-100">
                <img
                  src={principal.photo}
                  alt={principal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
                {principal.period || "Kepala Sekolah"}
              </span>

              <h3
                style={headingStyleVars}
                className="text-xl font-bold text-stone-900 dark:text-white mb-1"
              >
                {principal.name}
              </h3>
              {principal.nip && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 font-mono">
                  NIP. {principal.nip}
                </p>
              )}

              {principal.focus && principal.focus.length > 0 && (
                <div className="text-left pt-4 border-t border-stone-200 dark:border-stone-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                    Fokus Pembinaan:
                  </h4>
                  <ul className="text-xs space-y-1.5 text-stone-600 dark:text-stone-400 list-disc list-inside">
                    {principal.focus.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Isi Sambutan - Bersih tanpa teks sejajar SDN Sucopangepok 04 yang dobel */}
            <div className="lg:col-span-8 space-y-5">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Sambutan Pimpinan
                </span>
                <h2
                  style={headingStyleVars}
                  className="text-2xl sm:text-3xl font-bold mt-1 text-stone-900 dark:text-white"
                >
                  {welcome.title}
                </h2>
              </div>

              <div className={`space-y-4 text-stone-700 dark:text-stone-300 ${getParagraphAlignClass()} ${getLineHeightClass()}`}>
                {welcome.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-4">
                <p style={headingStyleVars} className="font-bold text-lg text-emerald-900 dark:text-emerald-300">
                  {principal.name}
                </p>
                <p className="text-xs text-stone-500">Kepala SDN Sucopangepok 04</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL SEKOLAH & MEMORI NOSTALGIA SEKOLAH LAMA (REVISI 1 & REVISI 7) */}
      <section id="profil" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header Profil - Bersih tanpa teks sejajar duplikat */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Selayang Pandang
            </span>
            <h2
              style={headingStyleVars}
              className="text-2xl sm:text-4xl font-bold mt-1 text-stone-900 dark:text-white"
            >
              {profile.title}
            </h2>
            <p className={`text-stone-600 dark:text-stone-300 max-w-3xl mt-3 ${getParagraphAlignClass()} ${getLineHeightClass()}`}>
              {profile.intro}
            </p>
          </div>

          {/* Sejarah & Video YouTube */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={`lg:col-span-7 text-stone-700 dark:text-stone-300 space-y-4 ${getParagraphAlignClass()} ${getLineHeightClass()}`}>
              <h3 style={headingStyleVars} className="text-xl font-bold text-stone-900 dark:text-white">
                Perjalanan Sejarah Pendirian
              </h3>
              {profile.history.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="lg:col-span-5">
              {youtubeEmbedUrl ? (
                <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-800 bg-black">
                  {isVideoPlaying ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Video Profil Sekolah"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                      <img
                        src={hero.image}
                        alt="Thumbnail Video"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-white ml-1" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-3xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 flex flex-col items-center justify-center p-6 text-center">
                  <Play className="w-12 h-12 text-stone-400 mb-2" />
                  <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                    Video Profil SDN Sucopangepok 04
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Tautan video dapat ditambahkan lewat panel kelola admin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Visi dan Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-7 rounded-3xl bg-[#1b5033] text-white shadow-lg space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                Visi Sekolah
              </span>
              <p style={headingStyleVars} className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
                "{profile.vision}"
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <span className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                Misi Sekolah
              </span>
              <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
                {profile.missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-none w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 1. REVISI UTAMA: Slide Foto Kenangan Masa Lalu / Memori Sekolah Lama */}
          <SchoolMemoriesSlider
            memories={profile.schoolMemories || []}
            onOpenPhotoModal={(photo) => setSelectedPhoto(photo.image)}
          />
        </div>
      </section>

      {/* FASILITAS SEKOLAH */}
      <section id="fasilitas" className="py-16 sm:py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Sarana Prasarana
              </span>
              <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
                Fasilitas Belajar & Lingkungan
              </h2>
            </div>
            {facilities.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFacilityIdx((prev) => (prev === 0 ? facilities.length - 1 : prev - 1))}
                  className="p-2.5 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveFacilityIdx((prev) => (prev === facilities.length - 1 ? 0 : prev + 1))}
                  className="p-2.5 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {facilities.length > 0 ? (
            <>
              {/* Highlight main facility */}
              <div className="relative aspect-[16/8] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-xl border border-stone-300 dark:border-stone-800">
                <img
                  src={facilities[activeFacilityIdx]?.image}
                  alt={facilities[activeFacilityIdx]?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 style={headingStyleVars} className="text-xl sm:text-3xl font-bold text-white">
                    {facilities[activeFacilityIdx]?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
                    {facilities[activeFacilityIdx]?.description}
                  </p>
                </div>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {facilities.map((f, idx) => (
                  <button
                    key={f.id || idx}
                    type="button"
                    onClick={() => setActiveFacilityIdx(idx)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      activeFacilityIdx === idx
                        ? 'bg-white dark:bg-stone-800 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                  >
                    <b style={headingStyleVars} className="block text-sm font-bold text-stone-900 dark:text-white">
                      {f.name}
                    </b>
                    <span className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                      {f.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-500">Belum ada data fasilitas.</p>
          )}
        </div>
      </section>

      {/* GURU DAN STAF */}
      <section id="guru" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Pendidik & Tenaga Kependidikan
            </span>
            <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
              Dewan Guru & Staf Sekolah
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Pendidik berdedikasi mengabdi di kaki langit mendampingi tumbuh kembang siswa
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {teachers.map((t, idx) => (
              <div
                key={t.id || idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-center shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden bg-emerald-100 mb-3 shadow-xs">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-emerald-800">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <b style={headingStyleVars} className="block text-xs sm:text-sm font-bold leading-tight line-clamp-2">
                  {t.name}
                </b>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block mt-1">
                  {t.role}
                </span>
                {t.nip && (
                  <small className="text-[10px] text-stone-400 block mt-1 font-mono">
                    NIP. {t.nip}
                  </small>
                )}
              </div>
            ))}
          </div>

          {/* Riwayat Kepala Sekolah & Hall of Fame */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <h3 style={headingStyleVars} className="text-lg font-bold text-stone-900 dark:text-white">
                Kepala Sekolah dari Masa ke Masa
              </h3>
              <ul className="space-y-3 pl-4 border-l-2 border-emerald-300 dark:border-emerald-800 text-xs">
                {data.principalsHistory.map((ph, idx) => (
                  <li key={ph.id || idx} className="relative pl-3">
                    <span className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-stone-900" />
                    <b>{ph.name}</b>
                    <small className="block text-stone-400 font-mono mt-0.5">{ph.period}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 style={headingStyleVars} className="text-lg font-bold text-stone-900 dark:text-white">
                  Hall of Fame Siswa Berprestasi
                </h3>
              </div>
              <div className="space-y-3">
                {data.hallOfFame.map((hf, idx) => (
                  <div key={hf.id || idx} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-100 dark:border-stone-700">
                    <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center flex-none">
                      {hf.year.slice(-2)}
                    </div>
                    <div>
                      <b className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white block">{hf.name}</b>
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">{hf.title}</span>
                      <p className="text-xs text-stone-500 mt-1">{hf.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI & PRESTASI */}
      <section id="galeri" className="py-16 sm:py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Dokumentasi & Prestasi
              </span>
              <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
                Koleksi Foto & Jejak Prestasi
              </h2>
            </div>
            {/* Tabs */}
            <div className="flex rounded-full bg-stone-200 dark:bg-stone-800 p-1 text-xs font-bold">
              <button
                onClick={() => setGalleryTab('galeri')}
                className={`px-4 py-2 rounded-full transition-all ${
                  galleryTab === 'galeri' ? 'bg-[#1b5033] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                Galeri Album Foto
              </button>
              <button
                onClick={() => setGalleryTab('prestasi')}
                className={`px-4 py-2 rounded-full transition-all ${
                  galleryTab === 'prestasi' ? 'bg-[#1b5033] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                Daftar Prestasi
              </button>
            </div>
          </div>

          {galleryTab === 'galeri' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((alb, idx) => (
                <div
                  key={alb.id || idx}
                  onClick={() => {
                    setSelectedAlbumIdx(idx);
                    setSelectedAlbumPhotoIdx(0);
                  }}
                  className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-lg cursor-pointer transition-all"
                >
                  <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden">
                    <img
                      src={alb.photos[0]}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                      {alb.photos.length} Foto
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <small className="text-xs text-stone-400 font-medium block">{alb.date}</small>
                    <b style={headingStyleVars} className="text-base font-bold text-stone-900 dark:text-white block group-hover:text-emerald-700 transition-colors">
                      {alb.title}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <span>{ach.year}</span>
                    <span>•</span>
                    <span>{ach.level}</span>
                  </div>
                  <h3 style={headingStyleVars} className="text-lg font-bold text-stone-900 dark:text-white">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{ach.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AGENDA KEGIATAN & KALENDER */}
      <section id="agenda" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Agenda Digital
            </span>
            <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
              Kalender Pendidikan & Acara Sekolah
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 style={headingStyleVars} className="text-lg font-bold text-stone-900 dark:text-white">
                Daftar Agenda Mendatang
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {events.map((ev, idx) => {
                  const evDate = new Date(ev.date);
                  return (
                    <div key={ev.id || idx} className="py-3.5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold flex flex-col items-center justify-center flex-none">
                        <span className="text-base leading-none">{evDate.getDate()}</span>
                        <span className="text-[10px] uppercase font-mono mt-0.5">
                          {evDate.toLocaleString('id-ID', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <b className="text-sm font-bold text-stone-900 dark:text-white block truncate">
                          {ev.title}
                        </b>
                        <span className="text-xs text-stone-400 block font-mono">{ev.date}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          ev.type === 'nasional'
                            ? 'bg-rose-100 text-rose-800'
                            : ev.type === 'akademik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ev.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-[#1b5033] to-[#113522] text-white rounded-3xl p-6 shadow-lg space-y-4">
              <h3 style={headingStyleVars} className="text-lg font-bold text-white">
                Informasi Jam Belajar Sekolah
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed">
                SDN Sucopangepok 04 menerapkan sistem 6 hari belajar dengan pembiasaan keagamaan, literasi pagi, dan kegiatan ekstrakurikuler Pramuka.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white/10">
                  <span>Senin - Kamis</span>
                  <span className="font-bold">06.45 - 12.15 WIB</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/10">
                  <span>Jumat</span>
                  <span className="font-bold">06.45 - 10.30 WIB</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-white/10">
                  <span>Sabtu (Ekstrakurikuler)</span>
                  <span className="font-bold">06.45 - 11.30 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BERITA & PENGUMUMAN */}
      <section id="berita" className="py-16 sm:py-20 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Kabar Sekolah
            </span>
            <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
              Berita & Informasi Terbaru
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, idx) => (
              <article
                key={n.id || idx}
                className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col group hover:shadow-md transition-shadow"
              >
                {n.image && (
                  <div className="aspect-[16/9.5] overflow-hidden bg-stone-200">
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {n.category}
                      </span>
                      <span className="text-stone-400">{n.date}</span>
                    </div>
                    <h3 style={headingStyleVars} className="text-lg font-bold text-stone-900 dark:text-white leading-snug">
                      {n.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">{n.excerpt}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNews(n)}
                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all pt-2"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BUKU TAMU & KONTAK */}
      <section id="kontak" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Layanan Komunikasi
            </span>
            <h2 style={headingStyleVars} className="text-2xl sm:text-4xl font-bold mt-1">
              Buku Tamu & Lokasi Sekolah
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Pesan Buku Tamu */}
            <div className="lg:col-span-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <h3 style={headingStyleVars} className="text-xl font-bold text-stone-900 dark:text-white">
                Tinggalkan Pesan & Salam
              </h3>

              {guestbookSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    Pesan Anda Berhasil Dikirimkan!
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Terima kasih telah menyapa keluarga besar SDN Sucopangepok 04.
                  </p>
                  <button
                    onClick={() => setGuestbookSubmitted(false)}
                    className="text-xs underline text-emerald-700 font-semibold"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGuestbookSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestbookForm.name}
                        onChange={(e) => setGuestbookForm({ ...guestbookForm, name: e.target.value })}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Asal / Keterangan
                      </label>
                      <input
                        type="text"
                        value={guestbookForm.origin}
                        onChange={(e) => setGuestbookForm({ ...guestbookForm, origin: e.target.value })}
                        placeholder="Wali Murid / Alumni / Umum"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Pesan atau Harapan *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={guestbookForm.message}
                      onChange={(e) => setGuestbookForm({ ...guestbookForm, message: e.target.value })}
                      placeholder="Tuliskan ucapan atau pertanyaan Anda untuk sekolah..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim ke Sekolah (WhatsApp / Email)</span>
                  </button>
                </form>
              )}

              {/* Daftar Pesan Buku Tamu */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Pesan Terbaru dari Sahabat Sekolah:
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {approvedGuestbook.map((gb, i) => (
                    <div key={gb.id || i} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <b>{gb.name} {gb.origin ? `(${gb.origin})` : ''}</b>
                        <span className="text-stone-400 font-mono text-[10px]">{gb.date}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300">{gb.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peta & Info Alamat */}
            <div className="lg:col-span-6 space-y-6">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-200 relative shadow-sm">
                {showMap ? (
                  <iframe
                    title="Peta Lokasi Sekolah"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(school.mapsQuery || school.address)}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100 dark:bg-stone-800 space-y-3">
                    <MapPin className="w-10 h-10 text-emerald-700" />
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      Peta Lokasi SDN Sucopangepok 04
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm">{school.address}</p>
                    <button
                      onClick={() => setShowMap(true)}
                      className="px-4 py-2 rounded-full bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
                    >
                      Buka Peta Interaktif
                    </button>
                  </div>
                )}
              </div>

              {/* Info Kontak List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-700 flex-none mt-1" />
                  <span>{school.address}</span>
                </div>
                {school.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-700 flex-none" />
                    <a href={`mailto:${school.email}`} className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline">
                      {school.email}
                    </a>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-700 flex-none" />
                    <a href={`tel:${cleanWaNumber}`} className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline">
                      {school.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#153f29] text-[#eef6f0] pt-12 pb-8 border-t border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                {school.logo && (
                  <img src={school.logo} alt="Logo" className="w-10 h-10 object-contain" />
                )}
                <span style={headingStyleVars} className="text-xl font-bold text-white block">
                  {school.name}
                </span>
              </div>
              <p className="text-xs text-stone-300 max-w-md leading-relaxed">
                {school.footerAbout || "Sekolah Kaki Langit Religius, Berwawasan IPTEK dan Peduli lingkungan."}
              </p>
              <p className="text-xs text-emerald-300 font-mono">
                NPSN: {school.npsn} • Status: {school.status} • Akreditasi {school.accreditation}
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <b className="text-white uppercase tracking-wider block font-bold mb-1">Tautan Cepat</b>
              {['Beranda', 'Profil', 'Fasilitas', 'Dewan Guru', 'Galeri', 'Agenda', 'Berita'].map((m) => (
                <a key={m} href={`#${m.toLowerCase().replace(/\s+/g, '')}`} className="block text-stone-300 hover:text-white transition-colors">
                  {m}
                </a>
              ))}
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <b className="text-white uppercase tracking-wider block font-bold mb-1">Kontak Resmi</b>
              <p className="text-stone-300">{school.address}</p>
              <p className="text-stone-300">Email: {school.email}</p>
              <p className="text-stone-300">Telepon: {school.phone}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-300">
            <span>&copy; {new Date().getFullYear()} {school.name}. Seluruh Hak Cipta Dilindungi.</span>
            <div className="flex items-center gap-3">
              {isAdmin && onEnterAdmin ? (
                <button
                  onClick={onEnterAdmin}
                  className="hover:text-amber-300 underline font-semibold transition-colors"
                >
                  Kelola Konten Sekolah (Admin)
                </button>
              ) : (
                <a href="#admin" className="hover:text-amber-300 underline font-semibold transition-colors">
                  Masuk Administrator
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      {whatsapp.enabled && waChatUrl && (
        <a
          href={waChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#25d366] text-[#073b1f] font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all shadow-black/30"
          title="Chat WhatsApp Resmi SDN Sucopangepok 04"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">{whatsapp.label || 'Chat WhatsApp'}</span>
        </a>
      )}

      {/* Lightbox Modal for Photo Viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedPhoto} alt="Zoom" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Album Modal Viewer */}
      {selectedAlbumIdx !== null && gallery[selectedAlbumIdx] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-stone-800">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold">{gallery[selectedAlbumIdx].title}</h4>
                <p className="text-xs text-stone-400">
                  Foto {selectedAlbumPhotoIdx + 1} dari {gallery[selectedAlbumIdx].photos.length} • {gallery[selectedAlbumIdx].date}
                </p>
              </div>
              <button onClick={() => setSelectedAlbumIdx(null)} className="text-stone-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-black flex items-center justify-center">
              <img
                src={gallery[selectedAlbumIdx].photos[selectedAlbumPhotoIdx]}
                alt="Album foto"
                className="max-h-full max-w-full object-contain"
              />

              {gallery[selectedAlbumIdx].photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedAlbumPhotoIdx((prev) =>
                        prev === 0 ? gallery[selectedAlbumIdx].photos.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedAlbumPhotoIdx((prev) =>
                        prev === gallery[selectedAlbumIdx].photos.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* News Full Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-4 relative border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {selectedNews.image && (
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full rounded-2xl max-h-72 object-cover" />
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {selectedNews.category}
              </span>
              <span className="text-stone-400">{selectedNews.date}</span>
            </div>
            <h3 style={headingStyleVars} className="text-xl sm:text-2xl font-bold">
              {selectedNews.title}
            </h3>
            <div className={`space-y-3 text-sm text-stone-700 dark:text-stone-300 ${getParagraphAlignClass()} ${getLineHeightClass()}`}>
              {(selectedNews.body || selectedNews.excerpt).split('\n\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
