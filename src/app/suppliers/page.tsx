'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, ITEMS_PER_PAGE } from '@/lib/constants';
import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Star,
  Eye,
  CheckCircle2,
  Package,
  Award,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
} from 'lucide-react';

export default function SuppliersPage() {
  const searchParams = useSearchParams();
  const { suppliers } = useAppStore();
  const search = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'products' | 'newest'>('rating');

  const filteredSuppliers = useMemo(() => {
    let result = suppliers.filter(s => s.status === 'approved');

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'views': result.sort((a, b) => b.views - a.views); break;
      case 'products': result.sort((a, b) => b.productCount - a.productCount); break;
      case 'newest': result.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()); break;
    }

    return result;
  }, [suppliers, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryLabel = (key: string) => {
    return CATEGORIES.find(c => c.key === key)?.labelAr || key;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">الموردون</h1>
          <p className="text-blue-200">ابحث عن أفضل الموردين والمصانع في المنطقة</p>

          {/* Search */}
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mt-6 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مورد..."
                className="w-full h-12 pr-12 pl-4 rounded-xl bg-white text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.labelAr}
              </button>
            ))}
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-sm border-0 focus:outline-none cursor-pointer px-2 py-1"
              >
                <option value="rating">التقييم</option>
                <option value="views">المشاهدات</option>
                <option value="products">المنتجات</option>
                <option value="newest">الأحدث</option>
              </select>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <LayoutGrid className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            عرض {paginatedSuppliers.length} من {filteredSuppliers.length} مورد
          </p>
        </div>

        {/* Suppliers Grid/List */}
        {paginatedSuppliers.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400">جرب تغيير معايير البحث أو التصنيف</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSuppliers.map(supplier => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedSuppliers.map(supplier => (
              <SupplierListItem key={supplier.id} supplier={supplier} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-blue-600' : ''}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/supplier/${supplier.id}`} className="group">
      <Card className="border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden h-full">
        <div className="h-28 bg-gradient-to-l from-blue-100 to-blue-50 relative overflow-hidden">
          <img
            src={supplier.coverUrl}
            alt={supplier.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                {supplier.name}
              </h3>
              <p className="text-xs text-gray-400">{supplier.nameEn}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{supplier.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{supplier.rating}</span>
              <span className="text-gray-400 text-xs">({supplier.reviewCount})</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="flex items-center gap-1 text-xs">
                <Eye className="w-3.5 h-3.5" />{supplier.views}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Package className="w-3.5 h-3.5" />{supplier.productCount}
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
  );
}

function SupplierListItem({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/supplier/${supplier.id}`} className="group block">
      <Card className="border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
        <CardContent className="flex items-center gap-4 p-4">
          <img
            src={supplier.logoUrl}
            alt={supplier.name}
            className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                {supplier.name}
              </h3>
              {supplier.badge !== 'none' && (
                <Badge className={`${supplier.badge === 'gold' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'} text-[10px] px-1.5 py-0`}>
                  {supplier.badge === 'gold' ? 'ذهبي' : 'أزرق'}
                </Badge>
              )}
              {supplier.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-1 mb-2">{supplier.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {supplier.rating} ({supplier.reviewCount})
              </span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{supplier.views}</span>
              <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" />{supplier.productCount} منتج</span>
              <span className="flex items-center gap-1">📍 {supplier.address.split('،')[0]}</span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}
