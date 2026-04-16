'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAppStore } from '@/lib/store';
import { CATEGORIES, STATUS_LABELS, PLACEMENT_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  BarChart3,
  Users,
  Package,
  Megaphone,
  Building2,
  MessageSquare,
  TrendingUp,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const {
    users, suppliers, products, messages, ads,
    updateUser, deleteUser,
    updateSupplier, deleteSupplier,
    updateProduct, deleteProduct,
    addSupplier,
    updateAd, deleteAd,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('stats');
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">الوصول مقيّد</h2>
          <p className="text-gray-400 mb-6">هذه الصفحة متاحة للمسؤولين فقط</p>
          <Button onClick={() => router.push('/login')}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  // Stats
  const totalSuppliers = suppliers.filter(s => s.status === 'approved').length;
  const pendingSuppliers = suppliers.filter(s => s.status === 'pending').length;
  const totalProducts = products.length;
  const activeAds = ads.filter(a => a.status === 'active').length;
  const totalViews = suppliers.reduce((acc, s) => acc + s.views, 0);
  const totalMessages = messages.length;

  const handleApproveSupplier = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user?.supplierProfile) return;
    updateSupplier(userId, { status: 'approved', isVerified: true });
    updateUser(userId, { supplierStatus: 'approved' });
    toast.success('تم اعتماد المورد');
  };

  const handleRejectSupplier = (userId: string) => {
    updateSupplier(userId, { status: 'rejected', isVerified: false });
    updateUser(userId, { supplierStatus: 'rejected' });
    toast.success('تم رفض المورد');
  };

  const handleApproveAd = (adId: string) => {
    updateAd(adId, { status: 'active' });
    toast.success('تم تفعيل الإعلان');
  };

  const handleRejectAd = (adId: string, reason?: string) => {
    updateAd(adId, { status: 'rejected', adminNote: reason || 'مرفوض من الإدارة' });
    toast.success('تم رفض الإعلان');
  };

  const filteredUsers = users.filter(u =>
    u.displayName.includes(searchQuery) ||
    u.email.includes(searchQuery) ||
    u.username.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            لوحة الإدارة
          </h1>
          <p className="text-gray-500">إدارة المنصة والمستخدمين</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full sm:w-auto overflow-x-auto flex">
          <TabsTrigger value="stats" className="gap-1.5">
            <TrendingUp className="w-4 h-4" />
            الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-1.5">
            <Users className="w-4 h-4" />
            الحسابات
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-1.5">
            <Building2 className="w-4 h-4" />
            الموردون {pendingSuppliers > 0 && `(${pendingSuppliers})`}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="w-4 h-4" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="ads" className="gap-1.5">
            <Megaphone className="w-4 h-4" />
            الإعلانات
          </TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Users, label: 'المستخدمون', value: users.length, color: 'bg-blue-100 text-blue-700' },
              { icon: Building2, label: 'الموردون المعتمدون', value: totalSuppliers, color: 'bg-green-100 text-green-700' },
              { icon: Clock, label: 'طلبات معلقة', value: pendingSuppliers, color: 'bg-yellow-100 text-yellow-700' },
              { icon: Package, label: 'المنتجات', value: totalProducts, color: 'bg-purple-100 text-purple-700' },
              { icon: Megaphone, label: 'الإعلانات النشطة', value: activeAds, color: 'bg-orange-100 text-orange-700' },
              { icon: Eye, label: 'إجمالي المشاهدات', value: totalViews.toLocaleString(), color: 'bg-cyan-100 text-cyan-700' },
            ].map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">إجمالي المستخدمين المسجلين</p>
                    <p className="text-xs text-gray-500">{users.length} حساب</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">الموردون النشطون</p>
                    <p className="text-xs text-gray-500">{totalSuppliers} مورد معتمد</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">الرسائل المتبادلة</p>
                    <p className="text-xs text-gray-500">{totalMessages} رسالة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>البريد</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.displayName}</TableCell>
                        <TableCell className="text-sm text-gray-500">{user.username}</TableCell>
                        <TableCell className="text-sm text-gray-500" dir="ltr">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {user.role === 'admin' ? 'مسؤول' : user.role === 'supplier' ? 'مورد' : 'مشتري'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${user.supplierStatus === 'approved' ? 'bg-green-100 text-green-700' : user.supplierStatus === 'rejected' ? 'bg-red-100 text-red-700' : user.supplierStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {user.supplierStatus === 'approved' ? 'معتمد' : user.supplierStatus === 'rejected' ? 'مرفوض' : user.supplierStatus === 'pending' ? 'معلّق' : '-'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => { deleteUser(user.id); toast.success('تم حذف المستخدم'); }}
                            >
                              <Trash2 className="w-3.5 h-3.5 ml-1" />
                              حذف
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة الموردين</h2>

          {suppliers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا يوجد موردون</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {suppliers.map(s => (
                <Card key={s.id} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{s.name}</h3>
                          <Badge className={STATUS_LABELS[s.status]?.color || ''}>
                            {STATUS_LABELS[s.status]?.ar || s.status}
                          </Badge>
                          {s.badge !== 'none' && (
                            <Badge className={s.badge === 'gold' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}>
                              {s.badge === 'gold' ? 'ذهبي' : 'أزرق'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{CATEGORIES.find(c => c.key === s.category)?.labelAr} • {s.address}</p>
                        <p className="text-xs text-gray-400 mt-1">{s.productCount} منتج • {s.views} مشاهدة • ⭐ {s.rating}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {s.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveSupplier(s.id)}>
                              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                              اعتماد
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleRejectSupplier(s.id)}>
                              <XCircle className="w-3.5 h-3.5 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        {s.status === 'approved' && (
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleRejectSupplier(s.id)}>
                            <XCircle className="w-3.5 h-3.5 ml-1" />
                            إلغاء الاعتماد
                          </Button>
                        )}
                        {s.status === 'rejected' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveSupplier(s.id)}>
                            <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                            إعادة اعتماد
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => { deleteSupplier(s.id); updateUser(s.id, { supplierStatus: undefined, supplierProfile: undefined }); toast.success('تم حذف المورد'); }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة المنتجات</h2>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المنتج</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-sm text-gray-500">{product.supplierName}</TableCell>
                        <TableCell className="text-sm">{product.price} ر.س</TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-500">
                            {CATEGORIES.find(c => c.key === product.category)?.labelAr || product.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.inStock
                            ? <Badge className="bg-green-100 text-green-700 text-xs">متوفر</Badge>
                            : <Badge className="bg-red-100 text-red-700 text-xs">نفذ</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => { deleteProduct(product.id); toast.success('تم حذف المنتج'); }}
                          >
                            <Trash2 className="w-3.5 h-3.5 ml-1" />
                            حذف
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة الإعلانات</h2>

          {ads.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد إعلانات</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ads.map(ad => (
                <Card key={ad.id} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                          <Badge className={STATUS_LABELS[ad.status]?.color || ''}>
                            {STATUS_LABELS[ad.status]?.ar || ad.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{ad.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                          <span>المورد: {ad.supplierName}</span>
                          <span>الموضع: {PLACEMENT_LABELS[ad.placement]?.ar}</span>
                          <span>الميزانية: {ad.budget} ر.س</span>
                          <span>المشاهدات: {ad.impressions}</span>
                          <span>النقرات: {ad.clicks}</span>
                        </div>
                        {ad.adminNote && (
                          <p className="text-xs text-yellow-600 mt-1">ملاحظة: {ad.adminNote}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {ad.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveAd(ad.id)}>
                              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                              قبول
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleRejectAd(ad.id, 'لا يطابق المعايير')}>
                              <XCircle className="w-3.5 h-3.5 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        {ad.status === 'active' && (
                          <Button size="sm" variant="outline" onClick={() => { updateAd(ad.id, { status: 'paused' }); toast.success('تم إيقاف الإعلان'); }}>
                            إيقاف مؤقت
                          </Button>
                        )}
                        {ad.status === 'paused' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { updateAd(ad.id, { status: 'active' }); toast.success('تم تفعيل الإعلان'); }}>
                            تفعيل
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => { deleteAd(ad.id); toast.success('تم حذف الإعلان'); }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
