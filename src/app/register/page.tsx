'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Mail, Lock, User, Loader2, Phone, MapPin, Globe } from 'lucide-react';
import { SUPPLIER_CATEGORIES } from '@/lib/constants';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    // Supplier fields
    companyName: '',
    companyNameEn: '',
    description: '',
    descriptionEn: '',
    category: '',
    phone: '',
    whatsapp: '',
    address: '',
    addressEn: '',
  });

  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.displayName || !formData.email || !formData.password || !formData.username) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    if (role === 'supplier' && !formData.companyName) {
      toast.error('يرجى إدخال اسم الشركة');
      return;
    }

    setLoading(true);

    const supplierProfile = role === 'supplier' ? {
      name: formData.companyName,
      nameEn: formData.companyNameEn || formData.companyName,
      description: formData.description,
      descriptionEn: formData.descriptionEn || formData.description,
      category: formData.category || 'construction',
      logoUrl: `https://placehold.co/200x200/3b82f6/white?text=${encodeURIComponent(formData.companyName.charAt(0))}`,
      coverUrl: 'https://placehold.co/1200x400/1e40af/white?text=My+Company',
      address: formData.address,
      addressEn: formData.addressEn || formData.address,
      contact: {
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        email: formData.email,
      },
      badge: 'none' as const,
    } : undefined;

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.displayName,
      role === 'buyer' ? 'user' : 'supplier',
      formData.username,
      supplierProfile
    );

    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-2">انضم إلى منصة بزنس إنفو اليوم</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">التسجيل</CardTitle>
            <CardDescription>أدخل بياناتك لإنشاء حساب جديد</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selection */}
              <div className="space-y-2">
                <Label>نوع الحساب</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      role === 'buyer'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl block mb-1">🏢</span>
                    <span className="text-sm font-medium">شركة / مشتري</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('supplier')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      role === 'supplier'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl block mb-1">🏭</span>
                    <span className="text-sm font-medium">مورد / مصنع</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">الاسم الكامل *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      placeholder="محمد أحمد"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم *</Label>
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      placeholder="mycompany"
                      className="pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="pr-10 pl-4"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className="pr-10 pl-4"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="pr-10 pl-4"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Supplier-specific fields */}
              {role === 'supplier' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    🏭 معلومات الشركة
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>اسم الشركة (عربي) *</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        placeholder="اسم الشركة بالعربية"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>اسم الشركة (إنجليزي)</Label>
                      <Input
                        value={formData.companyNameEn}
                        onChange={(e) => handleChange('companyNameEn', e.target.value)}
                        placeholder="Company Name in English"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>التصنيف</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPLIER_CATEGORIES.map(cat => (
                          <SelectItem key={cat.key} value={cat.key}>
                            {cat.icon} {cat.labelAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>وصف الشركة (عربي)</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="وصف مختصر عن الشركة ومنتجاتها"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>وصف الشركة (إنجليزي)</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => handleChange('descriptionEn', e.target.value)}
                      placeholder="Brief company description"
                      rows={3}
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+966XXXXXXXXX"
                          className="pr-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>واتساب</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={formData.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          placeholder="+966XXXXXXXXX"
                          className="pr-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>العنوان (عربي)</Label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          placeholder="المدينة، الحي، الشارع"
                          className="pr-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>العنوان (إنجليزي)</Label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          value={formData.addressEn}
                          onChange={(e) => handleChange('addressEn', e.target.value)}
                          placeholder="City, District, Street"
                          className="pr-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : null}
                إنشاء الحساب
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
