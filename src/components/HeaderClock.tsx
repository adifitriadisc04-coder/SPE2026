import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Phone, MessageCircle } from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderClockProps {
  school: SchoolInfo;
  whatsappEnabled?: boolean;
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const HeaderClock: React.FC<HeaderClockProps> = ({ school, whatsappEnabled = true }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hariString = HARI[time.getDay()];
  const tanggalString = `${time.getDate()} ${BULAN[time.getMonth()]} ${time.getFullYear()}`;
  const jamString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')} WIB`;

  const cleanPhone = (school.phone || '').replace(/[^\d+]/g, '');
  const cleanWa = (school.whatsapp || school.phone || '').replace(/\D/g, '');
  const waUrl = cleanWa
    ? `https://wa.me/${cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa}?text=${encodeURIComponent(
        'Halo SDN Sucopangepok 04, saya ingin bertanya seputar informasi sekolah.'
      )}`
    : '';

  return (
    <div className="bg-[#153f29] text-[#eef6f0] text-xs font-medium py-2 border-b border-emerald-950/40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        {/* Waktu & Tanggal Otomatis */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              <strong className="text-white">{hariString}</strong>, {tanggalString}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="font-mono tracking-wider font-semibold text-amber-200">
              {jamString}
            </span>
          </div>
        </div>

        {/* Email & Telepon / WhatsApp Klik */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap ml-auto">
          {school.email && (
            <a
              href={`mailto:${school.email}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors group"
              title="Kirim Email ke Sekolah"
            >
              <span className="p-1 rounded bg-emerald-900/60 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                <Mail className="w-3 h-3" />
              </span>
              <span className="hidden md:inline truncate max-w-[200px]">{school.email}</span>
              <span className="md:hidden">Email</span>
            </a>
          )}

          {school.phone && (
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors group"
              title="Telepon Sekolah"
            >
              <span className="p-1 rounded bg-emerald-900/60 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                <Phone className="w-3 h-3" />
              </span>
              <span>{school.phone}</span>
            </a>
          )}

          {whatsappEnabled && waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-950 bg-emerald-400 hover:bg-emerald-300 px-2.5 py-0.5 rounded-full font-semibold transition-all shadow-sm hover:scale-105"
              title="Chat WhatsApp Resmi Sekolah"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-950 fill-emerald-950/20" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
