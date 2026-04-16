'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAppStore } from '@/lib/store';
import { SUPPLIER_CATEGORIES, STATUS_LABELS, PLACEMENT_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Package,
  MessageSquare,
  Megaphone,
  Plus,
  Trash2,
  Edit,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SupplierDashboard() {
  const { profile, supplier, loading } = useAuth();
  const router = useRouter();
  const {
    getProductsBySupplier,
    addProduct,
    updateProduct,
    deleteProduct,
    getMessagesByUsername,
    addMessage,
    markMessageRead,
    deleteMessage,
    getAdsBySupplier,
    addAd,
    updateAd,
    deleteAd,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('products');
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<string | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '', nameEn: '', price: '', description: '', descriptionEn: '',
    imageUrl: '', category: 'construction', inStock: true, unit: 'قطعة', minOrder: '1',
  });

  // Ad form state
  const [adForm, setAdForm] = useState({
    title: '', description: '', placement: 'featured' as const, budget: '',
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile || profile.role !== 'supplier') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">الوصول مقيّد</h2>
          <p className="text-gray-400 mb-6">هذه الصفحة متاحة للموردين فقط</p>
          <Button onClick={() => router.push('/login')}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  const products = supplier ? getProductsBySupplier(supplier.id) : [];
  const messages = profile ? getMessagesByUsername(profile.id) : [];
  const ads = supplier ? getAdsBySupplier(supplier.id) : [];
  const unreadMessages = messages.filter(m => !m.isRead);

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.price) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct, {
        name: productForm.name,
        nameEn: productForm.nameEn,
        price: parseFloat(productForm.price),
        description: productForm.description,
        descriptionEn: productForm.descriptionEn,
        imageUrl: productForm.imageUrl || `https://placehold.co/400x400/3b82f6/white?text=${encodeURIComponent(productForm.name.charAt(0))}`,
        category: productForm.category,
        inStock: productForm.inStock,
        unit: productForm.unit,
        minOrder: parseInt(productForm.minOrder) || 1,
      });
      toast.success('تم تحديث المنتج');
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        supplierId: supplier!.id,
        supplierName: supplier!.name,
        name: productForm.name,
        nameEn: productForm.nameEn,
        price: parseFloat(productForm.price),
        currency: 'SAR',
        description: productForm.description,
        descriptionEn: productForm.descriptionEn,
        imageUrl: productForm.imageUrl || `https://placehold.co/400x400/3b82f6/white?text=${encodeURIComponent(productForm.name.charAt(0))}`,
        category: productForm.category,
        inStock: productForm.inStock,
        unit: productForm.unit,
        minOrder: parseInt(productForm.minOrder) || 1,
        createdAt: new Date().toISOString(),
      });
      toast.success('تم إضافة المنتج');
    }
    setProductDialogOpen(false);
    setEditingProduct(null);
    setProductForm({
      name: '', nameEn: '', price: '', description: '', descriptionEn: '',
      imageUrl: '', category: 'construction', inStock: true, unit: 'قطعة', minOrder: '1',
    });
  };

  const handleEditProduct = (product: ReturnType<typeof getProductsBySupplier>[0]) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      nameEn: product.nameEn,
      price: product.price.toString(),
      description: product.description,
      descriptionEn: product.descriptionEn,
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock,
      unit: product.unit,
      minOrder: product.minOrder.toString(),
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast.success('تم حذف المنتج');
  };

  const handleAdSubmit = () => {
    if (!adForm.title || !adForm.budget) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    if (editingAd) {
      updateAd(editingAd, {
        title: adForm.title,
        description: adForm.description,
        placement: adForm.placement,
        budget: parseFloat(adForm.budget),
      });
      toast.success('تم تحديث الإعلان');
    } else {
      addAd({
        id: `ad-${Date.now()}`,
        supplierId: supplier!.id,
        supplierName: supplier!.name,
        supplierUsername: profile!.username,
        title: adForm.title,
        description: adForm.description,
        placement: adForm.placement,
        status: 'pending',
        budget: parseFloat(adForm.budget),
        impressions: 0,
        clicks: 0,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      toast.success('تم إرسال طلب الإعلان للمراجعة');
    }
    setAdDialogOpen(false);
    setEditingAd(null);
    setAdForm({ title: '', description: '', placement: 'featured', budget: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500">مرحبًا، {profile.displayName}</p>
          {profile.supplierStatus === 'pending' && (
            <Badge className="bg-yellow-100 text-yellow-700 mt-2">
              <Clock className="w-3 h-3 ml-1" />
              حسابك قيد المراجعة
            </Badge>
          )}
          {profile.supplierStatus === 'approved' && (
            <Badge className="bg-green-100 text-green-700 mt-2">
              <CheckCircle2 className="w-3 h-3 ml-1" />
              حساب معتمد
            </Badge>
          )}
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-bold text-blue-700">{products.length}</p>
            <p className="text-xs text-blue-500">منتج</p>
          </div>
          <div className="bg-green-50 rounded-xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-bold text-green-700">{unreadMessages.length}</p>
            <p className="text-xs text-green-500">رسالة جديدة</p>
          </div>
          <div className="bg-purple-50 rounded-xl px-4 py-3 text-center min-w-[80px]">
            <p className="text-2xl font-bold text-purple-700">{ads.length}</p>
            <p className="text-xs text-purple-500">إعلان</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="w-4 h-4" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-1.5">
            <MessageSquare className="w-4 h-4" />
            الرسائل {unreadMessages.length > 0 && `(${unreadMessages.length})`}
          </TabsTrigger>
          <TabsTrigger value="ads" className="gap-1.5">
            <Megaphone className="w-4 h-4" />
            الإعلانات
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">إدارة المنتجات</h2>
            <Dialog open={productDialogOpen} onOpenChange={(open) => {
              setProductDialogOpen(open);
              if (!open) {
                setEditingProduct(null);
                setProductForm({ name: '', nameEn: '', price: '', description: '', descriptionEn: '', imageUrl: '', category: 'construction', inStock: true, unit: 'قطعة', minOrder: '1' });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5">
                  <Plus className="w-4 h-4" />
                  إضافة منتج
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
                  <DialogDescription>أدخل بيانات المنتج</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>اسم المنتج (عربي) *</Label>
                      <Input value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>اسم المنتج (إنجليزي)</Label>
                      <Input value={productForm.nameEn} onChange={(e) => setProductForm(p => ({ ...p, nameEn: e.target.value }))} dir="ltr" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>السعر (ر.س) *</Label>
                      <Input type="number" value={productForm.price} onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))} dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label>الوحدة</Label>
                      <Input value={productForm.unit} onChange={(e) => setProductForm(p => ({ ...p, unit: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>التصنيف</Label>
                      <Select value={productForm.category} onValueChange={(v) => setProductForm(p => ({ ...p, category: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SUPPLIER_CATEGORIES.map(c => (
                            <SelectItem key={c.key} value={c.key}>{c.icon} {c.labelAr}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>الحد الأدنى للطلب</Label>
                      <Input type="number" value={productForm.minOrder} onChange={(e) => setProductForm(p => ({ ...p, minOrder: e.target.value }))} dir="ltr" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف (عربي)</Label>
                    <Textarea value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف (إنجليزي)</Label>
                    <Textarea value={productForm.descriptionEn} onChange={(e) => setProductForm(p => ({ ...p, descriptionEn: e.target.value }))} rows={2} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>رابط الصورة</Label>
                    <Input value={productForm.imageUrl} onChange={(e) => setProductForm(p => ({ ...p, imageUrl: e.target.value }))} dir="ltr" placeholder="https://..." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm(p => ({ ...p, inStock: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="inStock">متوفر في المخزون</Label>
                  </div>
                  <Button onClick={handleProductSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد منتجات</h3>
                <p className="text-sm text-gray-400">ابدأ بإضافة منتجاتك الأولى</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id} className="border border-gray-100">
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        {product.inStock
                          ? <Badge className="bg-green-100 text-green-700 text-xs">متوفر</Badge>
                          : <Badge className="bg-red-100 text-red-700 text-xs">نفذ</Badge>
                        }
                      </div>
                      <p className="text-sm text-gray-500">{product.price} ر.س / {product.unit}</p>
                      <p className="text-xs text-gray-400">الحد الأدنى: {product.minOrder} | {SUPPLIER_CATEGORIES.find(c => c.key === product.category)?.labelAr}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">صندوق الرسائل</h2>
          {messages.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد رسائل</h3>
                <p className="text-sm text-gray-400">ستظهر الرسائل الواردة هنا</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {messages.map(msg => (
                <Card key={msg.id} className={`border ${!msg.isRead ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        <span className="font-semibold text-gray-900 text-sm">{msg.fromDisplayName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => deleteMessage(msg.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{msg.subject}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{msg.body}</p>
                    {!msg.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-blue-600"
                        onClick={() => markMessageRead(msg.id)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                        تحديد كمقروءة
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Ads Tab */}
        <TabsContent value="ads">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">إدارة الإعلانات</h2>
            <Dialog open={adDialogOpen} onOpenChange={(open) => {
              setAdDialogOpen(open);
              if (!open) {
                setEditingAd(null);
                setAdForm({ title: '', description: '', placement: 'featured', budget: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5">
                  <Plus className="w-4 h-4" />
                  إعلان جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAd ? 'تعديل الإعلان' : 'إنشاء إعلان جديد'}</DialogTitle>
                  <DialogDescription>سيتم مراجعة الإعلان قبل النشر</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>عنوان الإعلان *</Label>
                    <Input value={adForm.title} onChange={(e) => setAdForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea value={adForm.description} onChange={(e) => setAdForm(p => ({ ...p, description: e.target.value }))} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>موضع الإعلان</Label>
                      <Select value={adForm.placement} onValueChange={(v) => setAdForm(p => ({ ...p, placement: v as 'top' | 'featured' | 'highlighted' }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">إعلان رئيسي</SelectItem>
                          <SelectItem value="featured">مميز</SelectItem>
                          <SelectItem value="highlighted">مُبرز</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>الميزانية (ر.س) *</Label>
                      <Input type="number" value={adForm.budget} onChange={(e) => setAdForm(p => ({ ...p, budget: e.target.value }))} dir="ltr" />
                    </div>
                  </div>
                  <Button onClick={handleAdSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingAd ? 'حفظ التعديلات' : 'إرسال للمراجعة'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {ads.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">لا توجد إعلانات</h3>
                <p className="text-sm text-gray-400">أنشئ إعلانًا لتعزيز ظهور شركتك</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {ads.map(ad => (
                <Card key={ad.id} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{ad.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={STATUS_LABELS[ad.status]?.color || ''}>
                          {STATUS_LABELS[ad.status]?.ar || ad.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                      <div className="flex items-center gap-4">
                        <span>{PLACEMENT_LABELS[ad.placement]?.ar}</span>
                        <span>{ad.budget} ر.س</span>
                        <span>{ad.impressions} مشاهدة</span>
                        <span>{ad.clicks} نقرة</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => { deleteAd(ad.id); toast.success('تم حذف الإعلان'); }}
                      >
                        <Trash2 className="w-3.5 h-3.5 ml-1" />
                        حذف
                      </Button>
                    </div>
                    {ad.adminNote && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                        ملاحظة الإدارة: {ad.adminNote}
                      </div>
                    )}
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
