'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, BADGE_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Star,
  Eye,
  CheckCircle2,
  Package,
  Award,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Send,
  Loader2,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function SupplierProfilePage() {
  const params = useParams();
  const supplierId = params.id as string;
  const { suppliers, getProductsBySupplier, addMessage, updateSupplier } = useAppStore();
  const { profile } = useAuth();

  const supplier = suppliers.find(s => s.id === supplierId);
  const products = getProductsBySupplier(supplierId);

  const [contactForm, setContactForm] = useState({
    subject: '',
    body: '',
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (supplier) {
      updateSupplier(supplierId, { views: supplier.views + 1 });
    }
  }, [supplierId, supplier, updateSupplier]);

  if (!supplier) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">المورد غير موجود</h2>
          <p className="text-gray-400 mb-6">لم نتمكن من العثور على هذا المورد</p>
          <Button asChild>
            <Link href="/suppliers">العودة للقائمة</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORIES.find(c => c.key === supplier.category)?.labelAr || supplier.category;
  const badgeInfo = BADGE_LABELS[supplier.badge];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    if (!contactForm.subject || !contactForm.body) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setSendingMessage(true);
    addMessage({
      id: `msg-${Date.now()}`,
      fromUsername: profile.username,
      fromDisplayName: profile.displayName,
      toUsername: supplier.id,
      subject: contactForm.subject,
      body: contactForm.body,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setSendingMessage(false);
    setContactForm({ subject: '', body: '' });
    toast.success('تم إرسال الرسالة بنجاح');
  };

  return (
    <div>
      {/* Cover & Header */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-l from-blue-100 to-blue-50 overflow-hidden">
        <img
          src={supplier.coverUrl}
          alt={supplier.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Supplier Info */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Logo */}
              <div className="shrink-0">
                <img
                  src={supplier.logoUrl}
                  alt={supplier.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{supplier.name}</h1>
                  {supplier.isVerified && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                  {badgeInfo && badgeInfo.ar && (
                    <Badge className={`${badgeInfo.color} text-sm px-3 py-0.5`}>
                      <Award className="w-3.5 h-3.5 ml-1" />
                      {badgeInfo.ar}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mb-3">{supplier.nameEn}</p>
                <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">{supplier.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{supplier.rating}</span>
                    <span className="text-gray-400">({supplier.reviewCount} تقييم)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {supplier.views} مشاهدة
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    {supplier.productCount} منتج
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    انضم {new Date(supplier.joinedDate).toLocaleDateString('ar-SA')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {supplier.address}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <a
                  href={`https://wa.me/${supplier.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-green-600 hover:bg-green-700 w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </Button>
                </a>
                <a href={`tel:${supplier.contact.phone}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    اتصال
                  </Button>
                </a>
                <a href={`mailto:${supplier.contact.email}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Mail className="w-4 h-4" />
                    بريد
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category badge */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {CATEGORIES.find(c => c.key === supplier.category)?.icon} {categoryLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              المنتجات ({products.length})
            </h2>
            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد منتجات حاليًا</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => (
                  <Card key={product.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-40 rounded-xl object-cover mb-4 bg-gray-100"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">{product.nameEn}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-blue-600">{product.price}</span>
                          <span className="text-xs text-gray-400 mr-1">{product.currency} / {product.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.inStock ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">متوفر</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 text-xs">غير متوفر</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">الحد الأدنى للطلب: {product.minOrder}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card className="sticky top-20">
              <CardHeader className="pb-0">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  أرسل رسالة
                </h2>
                <p className="text-sm text-gray-500">تواصل مع المورد مباشرة</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label>الموضوع</Label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="مثال: طلب عرض أسعار"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الرسالة</Label>
                    <Textarea
                      value={contactForm.body}
                      onChange={(e) => setContactForm(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <Send className="w-4 h-4 ml-2" />
                    )}
                    إرسال الرسالة
                  </Button>
                  {!profile && (
                    <p className="text-xs text-center text-gray-400">
                      <Link href="/login" className="text-blue-600 hover:underline">سجّل دخولك</Link> لإرسال رسالة
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
