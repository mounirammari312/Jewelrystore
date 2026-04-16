import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">بزنس إنفو</span>
                <span className="text-[10px] text-gray-400 leading-tight">BUSINFO</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              منصة ربط الموردين والشركات الكبرى. نسهّل عليك إيجاد أفضل الموردين والمنتجات بأقل الأسعار.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-blue-400 transition-colors">الرئيسية</Link></li>
              <li><Link href="/suppliers" className="text-sm hover:text-blue-400 transition-colors">الموردون</Link></li>
              <li><Link href="/register" className="text-sm hover:text-blue-400 transition-colors">سجّل كمورد</Link></li>
              <li><Link href="/login" className="text-sm hover:text-blue-400 transition-colors">تسجيل الدخول</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">التصنيفات</h3>
            <ul className="space-y-2">
              <li><Link href="/suppliers?category=construction" className="text-sm hover:text-blue-400 transition-colors">البناء والتشييد</Link></li>
              <li><Link href="/suppliers?category=electronics" className="text-sm hover:text-blue-400 transition-colors">الإلكترونيات</Link></li>
              <li><Link href="/suppliers?category=food" className="text-sm hover:text-blue-400 transition-colors">الأغذية والمشروبات</Link></li>
              <li><Link href="/suppliers?category=technology" className="text-sm hover:text-blue-400 transition-colors">التقنية والبرمجيات</Link></li>
              <li><Link href="/suppliers?category=healthcare" className="text-sm hover:text-blue-400 transition-colors">المستلزمات الطبية</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@businfo.sa</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span dir="ltr">+966 11 000 0000</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} بزنس إنفو (BUSINFO). جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
