'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ArrowLeft,
  Star,
  Eye,
  CheckCircle2,
  TrendingUp,
  Users,
  Building2,
  Package,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { suppliers, products, ads } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const approvedSuppliers = suppliers.filter(s => s.status === 'approved');
  const featuredSuppliers = approvedSuppliers
    .filter(s => s.badge !== 'none')
    .sort((a, b) => (b.badge === 'gold' ? 1 : 0) - (a.badge === 'gold' ? 1 : 0));
  const activeAds = ads.filter(a => a.status === 'active');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/suppliers?search=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory}`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-blue-500/30 text-blue-100 border-blue-400/30 mb-6 px-4 py-1.5 text-sm">
              🚀 المنصة الأولى لربط الموردين والشركات في الشرق الأوسط
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
              ابحث عن أفضل{' '}
              <span className="text-blue-300">الموردين</span>
              <br />
              والمنتجات بأسعار{' '}
              <span className="text-blue-300">مميزة</span>
            </h1>
            <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              منصة متكاملة تربط بين الشركات الكبرى والموردين والمصانع. اكتشف آلاف المنتجات وأفضل العروض.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مورد أو منتج..."
                  className="w-full h-13 pr-12 pl-4 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                />
              </div>
              <Button
                type="submit"
                className="h-13 px-8 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl shadow-lg"
              >
                بحث
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Active Ads Banner */}
      {activeAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📢</span>
              <h3 className="font-semibold text-amber-800 text-sm">عروض مميزة</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {activeAds.slice(0, 3).map(ad => (
                <div
                  key={ad.id}
                  className="min-w-[280px] bg-white rounded-xl p-4 shadow-sm border border-amber-100 flex-shrink-0"
                >
                  <p className="font-semibold text-gray-900 text-sm mb-1">{ad.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{ad.description}</p>
                  <p className="text-[10px] text-amber-600 mt-2">من: {ad.supplierName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building2, label: 'مورد نشط', value: approvedSuppliers.length, color: 'bg-blue-100 text-blue-700' },
            { icon: Package, label: 'منتج متاح', value: products.length, color: 'bg-green-100 text-green-700' },
            { icon: Users, label: 'مستخدم مسجل', value: 1500, color: 'bg-purple-100 text-purple-700' },
            { icon: TrendingUp, label: 'عملية تجارية', value: 3200, color: 'bg-orange-100 text-orange-700' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString('ar-SA')}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">تصفح حسب التصنيف</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
            <Link
              key={cat.key}
              href={`/suppliers?category=${cat.key}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                  {cat.labelAr}
                </p>
                <p className="text-xs text-gray-400">{cat.labelEn}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-300 mr-auto group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الموردون المميزون</h2>
              <p className="text-gray-500 mt-1">أفضل الموردين المعتمدين على المنصة</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/suppliers" className="flex items-center gap-1.5">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSuppliers.slice(0, 6).map(supplier => (
              <Link
                key={supplier.id}
                href={`/supplier/${supplier.id}`}
                className="group"
              >
                <Card className="border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden h-full">
                  {/* Cover */}
                  <div className="h-28 bg-gradient-to-l from-blue-100 to-blue-50 relative overflow-hidden">
                    <img
                      src={supplier.coverUrl}
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {supplier.badge !== 'none' && (
                      <Badge className={`absolute top-3 right-3 ${supplier.badge === 'gold' ? 'bg-yellow-500' : 'bg-blue-500'} text-white text-xs`}>
                        <Award className="w-3 h-3 ml-1" />
                        {supplier.badge === 'gold' ? 'ذهبي' : 'أزرق'}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={supplier.logoUrl}
                        alt={supplier.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow -mt-8"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                          {supplier.name}
                        </h3>
                        <p className="text-xs text-gray-400">{supplier.nameEn}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {supplier.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{supplier.rating}</span>
                        <span className="text-gray-400 text-xs">({supplier.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span className="flex items-center gap-1 text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          {supplier.views}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Package className="w-3.5 h-3.5" />
                          {supplier.productCount}
                        </span>
                      </div>
                    </div>
                    {supplier.isVerified && (
                      <div className="flex items-center gap-1 mt-3 text-green-600 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مورد معتمد</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              هل أنت مورد أو مُصنّع؟
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف الموردين على منصة بزنس إنفو ووصل بشركات كبرى في جميع أنحاء المنطقة. سجّل الآن مجانًا!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl px-8 h-12">
                <Link href="/register">
                  سجّل كمورد مجانًا
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 h-12">
                <Link href="/suppliers">
                  تصفح الموردين
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
