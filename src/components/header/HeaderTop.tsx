import { CalendarRange, Facebook, Instagram, Phone, Twitter, Youtube } from 'lucide-react';
import React from 'react'
const HeaderTop = () => {
  return (
    <div
      className="flex flex-col gap-4 px-4 py-2
                md:flex-row md:items-center md:justify-between
                md:px-6 lg:px-10
                bg-zinc-800  text-white">
      {/* Time */}
      <div className="flex items-center gap-2 text-sm font-bold">
        <CalendarRange className="text-white" />
        <span>Thứ 2 - Chủ nhật 8:00 - 20:00</span>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 text-sm font-bold">
        <Phone className="text-white" />
        <span>0777 632 996</span>
      </div>

      {/* Social */}
      <div className="flex items-center gap-3">
        <Facebook className="hover:text-primary transition-colors" />
        <Instagram className="hover:text-primary transition-colors" />
        <Youtube className="hover:text-primary transition-colors" />
        <Twitter className="hover:text-primary transition-colors" />
      </div>
    </div>
  );
}

export default HeaderTop
