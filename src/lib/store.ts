import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, UserProfile, Supplier, Product, Message, SupplierAd } from './types';

// ============ SEED DATA ============

const seedUsers: UserProfile[] = [
  {
    id: 'admin-001',
    username: 'admin',
    displayName: 'مدير النظام',
    email: 'admin@businfo.sa',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user-001',
    username: 'alraedah',
    displayName: 'شركة الرائدة للتجارة',
    email: 'info@alraedah.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-02-15T00:00:00.000Z',
    supplierProfile: {
      name: 'شركة الرائدة للتجارة',
      nameEn: 'Al Raedah Trading Co.',
      description: 'شركة رائدة في مجال مواد البناء والتشييد مع أكثر من 20 عامًا من الخبرة. نقدم أفضل المنتجات بأسعار تنافسية مع خدمة توصيل سريعة لجميع أنحاء المملكة.',
      descriptionEn: 'A leading company in construction materials with over 20 years of experience. We provide the best products at competitive prices with fast delivery across the Kingdom.',
      category: 'construction',
      logoUrl: 'https://placehold.co/200x200/3b82f6/white?text=AR&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/1e40af/white?text=Al+Raedah+Trading',
      address: 'الرياض، حي العليا، شارع التحلية',
      addressEn: 'Riyadh, Olaya District, Tahliya Street',
      contact: { phone: '+966112345678', whatsapp: '+966501234567', email: 'info@alraedah.sa' },
      badge: 'gold',
    },
  },
  {
    id: 'user-002',
    username: 'techvision',
    displayName: 'تك فيجن للإلكترونيات',
    email: 'sales@techvision.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-03-10T00:00:00.000Z',
    supplierProfile: {
      name: 'تك فيجن للإلكترونيات',
      nameEn: 'Tech Vision Electronics',
      description: 'موزع معتمد لأكبر العلامات التجارية في الإلكترونيات. نوفر حلول متكاملة للشركات والمؤسسات مع ضمان شامل وخدمة ما بعد البيع.',
      descriptionEn: 'Authorized distributor for the largest electronics brands. We provide integrated solutions for companies and institutions with comprehensive warranty and after-sales service.',
      category: 'electronics',
      logoUrl: 'https://placehold.co/200x200/8b5cf6/white?text=TV&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/7c3aed/white?text=Tech+Vision',
      address: 'جدة، حي الحمراء، شارع فلسطين',
      addressEn: 'Jeddah, Al Hamra District, Palestine Street',
      contact: { phone: '+966122345678', whatsapp: '+966502345678', email: 'sales@techvision.sa' },
      badge: 'gold',
    },
  },
  {
    id: 'user-003',
    username: 'nadafoods',
    displayName: 'مؤسسة ندى للأغذية',
    email: 'contact@nadafoods.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-04-05T00:00:00.000Z',
    supplierProfile: {
      name: 'مؤسسة ندى للأغذية',
      nameEn: 'Nada Foods Est.',
      description: 'متخصصون في توريد المواد الغذائية للمطاعم والفنادق والمؤسسات. نوفر منتجات عالية الجودة بأسعار جملة مميزة مع التوصيل اليومي.',
      descriptionEn: 'Specialists in supplying food products to restaurants, hotels and institutions. We provide high quality products at special wholesale prices with daily delivery.',
      category: 'food',
      logoUrl: 'https://placehold.co/200x200/f97316/white?text=NF&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/ea580c/white?text=Nada+Foods',
      address: 'الدمام، حي الشاطئ، شارع الملك فهد',
      addressEn: 'Dammam, Al Shati District, King Fahd Road',
      contact: { phone: '+966133345678', whatsapp: '+966503345678', email: 'contact@nadafoods.sa' },
      badge: 'blue',
    },
  },
  {
    id: 'user-004',
    username: 'royaltextile',
    displayName: 'الملكية للمنسوجات',
    email: 'info@royaltextile.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-05-20T00:00:00.000Z',
    supplierProfile: {
      name: 'الملكية للمنسوجات',
      nameEn: 'Royal Textile',
      description: 'أحد أكبر مصدري الأقمشة في المملكة العربية السعودية. نقدم تشكيلة واسعة من الأقمشة الفاخرة للمصانع ومحلات الأزياء بأسعار تنافسية.',
      descriptionEn: 'One of the largest fabric exporters in Saudi Arabia. We offer a wide range of premium fabrics for factories and fashion stores at competitive prices.',
      category: 'textiles',
      logoUrl: 'https://placehold.co/200x200/ec4899/white?text=RT&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/db2777/white?text=Royal+Textile',
      address: 'الرياض، حي السليمانية، شارع الأمير محمد بن عبدالعزيز',
      addressEn: 'Riyadh, Al Sulaimaniya, Prince Mohammed bin Abdulaziz Street',
      contact: { phone: '+966114345678', whatsapp: '+966504345678', email: 'info@royaltextile.sa' },
      badge: 'blue',
    },
  },
  {
    id: 'user-005',
    username: 'safachem',
    displayName: 'شركة سافا الكيميائية',
    email: 'sales@safachem.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-06-12T00:00:00.000Z',
    supplierProfile: {
      name: 'شركة سافا الكيميائية',
      nameEn: 'Safa Chemicals Co.',
      description: 'مورد رئيسي للمواد الكيميائية الصناعية والزراعية في المنطقة. نعمل مع أكبر المصانع والشركات لتوفير حلول كيميائية متخصصة.',
      descriptionEn: 'A leading supplier of industrial and agricultural chemicals in the region. We work with the largest factories and companies to provide specialized chemical solutions.',
      category: 'chemicals',
      logoUrl: 'https://placehold.co/200x200/14b8a6/white?text=SC&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/0d9488/white?text=Safa+Chemicals',
      address: 'الجبيل، المنطقة الصناعية الأولى',
      addressEn: 'Jubail, First Industrial Area',
      contact: { phone: '+966133545678', whatsapp: '+966505345678', email: 'sales@safachem.sa' },
      badge: 'gold',
    },
  },
  {
    id: 'user-006',
    username: 'smartcode',
    displayName: 'سمارت كود للتقنية',
    email: 'hello@smartcode.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-07-01T00:00:00.000Z',
    supplierProfile: {
      name: 'سمارت كود للتقنية',
      nameEn: 'Smart Code Technology',
      description: 'شركة تقنية رائدة تقدم حلول برمجية متكاملة وأنظمة إدارة الأعمال وحلول السحابة للشركات والمؤسسات في جميع القطاعات.',
      descriptionEn: 'A leading technology company providing integrated software solutions, business management systems, and cloud solutions for companies and institutions in all sectors.',
      category: 'technology',
      logoUrl: 'https://placehold.co/200x200/6366f1/white?text=SC&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/4f46e5/white?text=Smart+Code',
      address: 'الرياض، حي الملقا، طريق الملك عبدالله',
      addressEn: 'Riyadh, Al Malqa, King Abdullah Road',
      contact: { phone: '+966116345678', whatsapp: '+966506345678', email: 'hello@smartcode.sa' },
      badge: 'blue',
    },
  },
  {
    id: 'user-007',
    username: 'alnoor-medical',
    displayName: 'النور للمستلزمات الطبية',
    email: 'info@alnoormedical.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-08-15T00:00:00.000Z',
    supplierProfile: {
      name: 'النور للمستلزمات الطبية',
      nameEn: 'Al Noor Medical Supplies',
      description: 'مورد معتمد للمستلزمات والأجهزة الطبية للمستشفيات والعيادات والصيدليات. نوفر أحدث التقنيات الطبية مع خدمة صيانة متخصصة.',
      descriptionEn: 'Authorized supplier of medical supplies and equipment for hospitals, clinics, and pharmacies. We provide the latest medical technologies with specialized maintenance service.',
      category: 'healthcare',
      logoUrl: 'https://placehold.co/200x200/06b6d4/white?text=AN&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/0891b2/white?text=Al+Noor+Medical',
      address: 'جدة، حي النزهة، شارع الأمير سلطان',
      addressEn: 'Jeddah, Al Nuzha District, Prince Sultan Street',
      contact: { phone: '+966127345678', whatsapp: '+966507345678', email: 'info@alnoormedical.sa' },
      badge: 'gold',
    },
  },
  {
    id: 'user-008',
    username: 'autozone',
    displayName: 'أوتو زون لقطع الغيار',
    email: 'sales@autozone.sa',
    role: 'supplier',
    supplierStatus: 'approved',
    createdAt: '2024-09-01T00:00:00.000Z',
    supplierProfile: {
      name: 'أوتو زون لقطع الغيار',
      nameEn: 'Auto Zone Parts',
      description: 'أكبر مركز لبيع قطع الغيار الأصلية والمعتمدة لجميع أنواع السيارات. نقدم ضمانًا على جميع منتجاتنا مع خدمة تركيب احترافية.',
      descriptionEn: 'The largest center for selling original and certified spare parts for all types of vehicles. We provide warranty on all our products with professional installation service.',
      category: 'automotive',
      logoUrl: 'https://placehold.co/200x200/ef4444/white?text=AZ&font=raleway',
      coverUrl: 'https://placehold.co/1200x400/dc2626/white?text=Auto+Zone',
      address: 'الرياض، حي الصناعية، الطريق الدائري الشرقي',
      addressEn: 'Riyadh, Industrial District, Eastern Ring Road',
      contact: { phone: '+966118345678', whatsapp: '+966508345678', email: 'sales@autozone.sa' },
      badge: 'blue',
    },
  },
];

const seedSuppliers: Supplier[] = seedUsers
  .filter(u => u.role === 'supplier' && u.supplierStatus === 'approved' && u.supplierProfile)
  .map(u => ({
    id: u.id,
    userId: u.id,
    name: u.supplierProfile!.name,
    nameEn: u.supplierProfile!.nameEn,
    description: u.supplierProfile!.description,
    descriptionEn: u.supplierProfile!.descriptionEn,
    category: u.supplierProfile!.category,
    logoUrl: u.supplierProfile!.logoUrl,
    coverUrl: u.supplierProfile!.coverUrl,
    address: u.supplierProfile!.address,
    addressEn: u.supplierProfile!.addressEn,
    contact: u.supplierProfile!.contact,
    rating: Math.round((4 + Math.random()) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 150) + 20,
    views: Math.floor(Math.random() * 5000) + 500,
    productCount: 0,
    badge: u.supplierProfile!.badge,
    status: 'approved' as const,
    joinedDate: u.createdAt,
    isVerified: true,
  }));

// Update product counts
seedSuppliers.forEach(s => { s.productCount = 3; });

const seedProducts: Product[] = [
  // Al Raedah - Construction
  {
    id: 'prod-001', supplierId: 'user-001', supplierName: 'شركة الرائدة للتجارة',
    name: 'إسمنت بورتلاندي 50 كجم', nameEn: 'Portland Cement 50kg',
    price: 18.50, currency: 'SAR',
    description: 'إسمنت بورتلاندي عالي الجودة مناسب لجميع أعمال البناء والتشييد', descriptionEn: 'High quality Portland cement suitable for all construction works',
    imageUrl: 'https://placehold.co/400x400/94a3b8/white?text=Cement+50kg',
    category: 'construction', inStock: true, unit: 'كيس', minOrder: 100, createdAt: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'prod-002', supplierId: 'user-001', supplierName: 'شركة الرائدة للتجارة',
    name: 'حديد تسليح 12مم', nameEn: 'Rebar 12mm',
    price: 4.20, currency: 'SAR',
    description: 'حديد تسليح قياسي مقاوم للصدأ بطول 12 متر', descriptionEn: 'Standard anti-corrosion rebar, 12 meters length',
    imageUrl: 'https://placehold.co/400x400/64748b/white?text=Rebar+12mm',
    category: 'construction', inStock: true, unit: 'متر طويل', minOrder: 500, createdAt: '2024-06-05T00:00:00.000Z',
  },
  {
    id: 'prod-003', supplierId: 'user-001', supplierName: 'شركة الرائدة للتجارة',
    name: 'طوب أحمر معياري', nameEn: 'Standard Red Brick',
    price: 1.20, currency: 'SAR',
    description: 'طوب أحمر معياري عالي الجودة للبناء', descriptionEn: 'High quality standard red brick for construction',
    imageUrl: 'https://placehold.co/400x400/dc2626/white?text=Red+Brick',
    category: 'construction', inStock: true, unit: 'قطعة', minOrder: 5000, createdAt: '2024-06-10T00:00:00.000Z',
  },
  // Tech Vision - Electronics
  {
    id: 'prod-004', supplierId: 'user-002', supplierName: 'تك فيجن للإلكترونيات',
    name: 'شاشة عرض LED 55 بوصة', nameEn: 'LED Display Screen 55 inch',
    price: 2450, currency: 'SAR',
    description: 'شاشة عرض احترافية بدقة 4K مناسبة للمؤتمرات والمعارض', descriptionEn: 'Professional 4K display screen suitable for conferences and exhibitions',
    imageUrl: 'https://placehold.co/400x400/7c3aed/white?text=LED+55',
    category: 'electronics', inStock: true, unit: 'قطعة', minOrder: 5, createdAt: '2024-07-01T00:00:00.000Z',
  },
  {
    id: 'prod-005', supplierId: 'user-002', supplierName: 'تك فيجن للإلكترونيات',
    name: 'نظام إنذار حماية متكامل', nameEn: 'Integrated Security Alarm System',
    price: 1850, currency: 'SAR',
    description: 'نظام إنذار حماية ذكي مع كاميرات مراقبة وتطبيق جوال', descriptionEn: 'Smart security alarm system with surveillance cameras and mobile app',
    imageUrl: 'https://placehold.co/400x400/8b5cf6/white?text=Alarm+System',
    category: 'electronics', inStock: true, unit: 'طقم', minOrder: 3, createdAt: '2024-07-05T00:00:00.000Z',
  },
  {
    id: 'prod-006', supplierId: 'user-002', supplierName: 'تك فيجن للإلكترونيات',
    name: 'جهاز تكييف تجاري 5 طن', nameEn: 'Commercial AC Unit 5 Ton',
    price: 4200, currency: 'SAR',
    description: 'جهاز تكييف تجاري موفر للطاقة مناسب للمكاتب والمحلات', descriptionEn: 'Energy efficient commercial AC unit suitable for offices and shops',
    imageUrl: 'https://placehold.co/400x400/6d28d9/white?text=AC+5T',
    category: 'electronics', inStock: false, unit: 'قطعة', minOrder: 2, createdAt: '2024-07-10T00:00:00.000Z',
  },
  // Nada Foods - Food
  {
    id: 'prod-007', supplierId: 'user-003', supplierName: 'مؤسسة ندى للأغذية',
    name: 'زيت طعام 18 لتر', nameEn: 'Cooking Oil 18L',
    price: 195, currency: 'SAR',
    description: 'زيت طعام نباتي عالي الجودة مناسب للمطاعم والفنادق', descriptionEn: 'High quality vegetable cooking oil suitable for restaurants and hotels',
    imageUrl: 'https://placehold.co/400x400/f97316/white?text=Cooking+Oil',
    category: 'food', inStock: true, unit: 'تنكة', minOrder: 20, createdAt: '2024-08-01T00:00:00.000Z',
  },
  {
    id: 'prod-008', supplierId: 'user-003', supplierName: 'مؤسسة ندى للأغذية',
    name: 'أرز بسمتي 25 كجم', nameEn: 'Basmati Rice 25kg',
    price: 145, currency: 'SAR',
    description: 'أرز بسمتي طويل الحبة ممتاز', descriptionEn: 'Premium long grain Basmati rice',
    imageUrl: 'https://placehold.co/400x400/ea580c/white?text=Basmati+Rice',
    category: 'food', inStock: true, unit: 'كيس', minOrder: 50, createdAt: '2024-08-05T00:00:00.000Z',
  },
  {
    id: 'prod-009', supplierId: 'user-003', supplierName: 'مؤسسة ندى للأغذية',
    name: 'دقيق قمح ممتاز 50 كجم', nameEn: 'Premium Wheat Flour 50kg',
    price: 85, currency: 'SAR',
    description: 'دقيق قمح ممتاز خاص بالمخابز والمطاعم', descriptionEn: 'Premium wheat flour specially for bakeries and restaurants',
    imageUrl: 'https://placehold.co/400x400/c2410c/white?text=Wheat+Flour',
    category: 'food', inStock: true, unit: 'كيس', minOrder: 30, createdAt: '2024-08-10T00:00:00.000Z',
  },
  // Royal Textile - Textiles
  {
    id: 'prod-010', supplierId: 'user-004', supplierName: 'الملكية للمنسوجات',
    name: 'قماش قطن خام 150 سم', nameEn: 'Raw Cotton Fabric 150cm',
    price: 32, currency: 'SAR',
    description: 'قماش قطن خام عالي الجودة بعرض 150 سم', descriptionEn: 'High quality raw cotton fabric, 150cm width',
    imageUrl: 'https://placehold.co/400x400/ec4899/white?text=Cotton+Fabric',
    category: 'textiles', inStock: true, unit: 'متر', minOrder: 500, createdAt: '2024-09-01T00:00:00.000Z',
  },
  {
    id: 'prod-011', supplierId: 'user-004', supplierName: 'الملكية للمنسوجات',
    name: 'حرير صناعي فاخر', nameEn: 'Premium Artificial Silk',
    price: 65, currency: 'SAR',
    description: 'حرير صناعي فاخر بدرجات لونية متعددة', descriptionEn: 'Premium artificial silk in multiple colors',
    imageUrl: 'https://placehold.co/400x400/db2777/white?text=Silk',
    category: 'textiles', inStock: true, unit: 'متر', minOrder: 200, createdAt: '2024-09-05T00:00:00.000Z',
  },
  {
    id: 'prod-012', supplierId: 'user-004', supplierName: 'الملكية للمنسوجات',
    name: 'قماش بوليستر مطبوع', nameEn: 'Printed Polyester Fabric',
    price: 28, currency: 'SAR',
    description: 'قماش بوليستر مطبوع بأنماط عصرية', descriptionEn: 'Printed polyester fabric with modern patterns',
    imageUrl: 'https://placehold.co/400x400/be185d/white?text=Polyester',
    category: 'textiles', inStock: true, unit: 'متر', minOrder: 300, createdAt: '2024-09-10T00:00:00.000Z',
  },
  // Safa Chemicals
  {
    id: 'prod-013', supplierId: 'user-005', supplierName: 'شركة سافا الكيميائية',
    name: 'مادة مذيبة صناعية 200 لتر', nameEn: 'Industrial Solvent 200L',
    price: 890, currency: 'SAR',
    description: 'مادة مذيبة صناعية عالية النقاء للدهانات والطلاء', descriptionEn: 'High purity industrial solvent for paints and coatings',
    imageUrl: 'https://placehold.co/400x400/14b8a6/white?text=Solvent',
    category: 'chemicals', inStock: true, unit: 'برميل', minOrder: 10, createdAt: '2024-10-01T00:00:00.000Z',
  },
  {
    id: 'prod-014', supplierId: 'user-005', supplierName: 'شركة سافا الكيميائية',
    name: 'أسمدة عضوية 25 كجم', nameEn: 'Organic Fertilizer 25kg',
    price: 75, currency: 'SAR',
    description: 'أسمدة عضوية طبيعية للمزارع والحدائق', descriptionEn: 'Natural organic fertilizer for farms and gardens',
    imageUrl: 'https://placehold.co/400x400/0d9488/white?text=Fertilizer',
    category: 'chemicals', inStock: true, unit: 'كيس', minOrder: 100, createdAt: '2024-10-05T00:00:00.000Z',
  },
  {
    id: 'prod-015', supplierId: 'user-005', supplierName: 'شركة سافا الكيميائية',
    name: 'مواد تنظيف صناعية', nameEn: 'Industrial Cleaning Chemicals',
    price: 120, currency: 'SAR',
    description: 'مواد تنظيف صناعية متخصصة للمصانع والورش', descriptionEn: 'Specialized industrial cleaning chemicals for factories and workshops',
    imageUrl: 'https://placehold.co/400x400/0f766e/white?text=Cleaning',
    category: 'chemicals', inStock: true, unit: 'جالون', minOrder: 20, createdAt: '2024-10-10T00:00:00.000Z',
  },
  // Smart Code - Technology
  {
    id: 'prod-016', supplierId: 'user-006', supplierName: 'سمارت كود للتقنية',
    name: 'نظام إدارة موارد المؤسسات ERP', nameEn: 'ERP System',
    price: 45000, currency: 'SAR',
    description: 'نظام إدارة موارد المؤسسات متكامل يشمل المحاسبة والمخزون والموارد البشرية', descriptionEn: 'Integrated ERP system including accounting, inventory, and HR management',
    imageUrl: 'https://placehold.co/400x400/6366f1/white?text=ERP+System',
    category: 'technology', inStock: true, unit: 'رخصة', minOrder: 1, createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 'prod-017', supplierId: 'user-006', supplierName: 'سمارت كود للتقنية',
    name: 'تطبيق جوال مخصص', nameEn: 'Custom Mobile App',
    price: 25000, currency: 'SAR',
    description: 'تصميم وتطوير تطبيق جوال احترافي لنظامي iOS و Android', descriptionEn: 'Professional mobile app design and development for iOS and Android',
    imageUrl: 'https://placehold.co/400x400/4f46e5/white?text=Mobile+App',
    category: 'technology', inStock: true, unit: 'مشروع', minOrder: 1, createdAt: '2024-11-05T00:00:00.000Z',
  },
  {
    id: 'prod-018', supplierId: 'user-006', supplierName: 'سمارت كود للتقنية',
    name: 'خدمات استضافة سحابية', nameEn: 'Cloud Hosting Services',
    price: 299, currency: 'SAR',
    description: 'خدمات استضافة سحابية بسرعة عالية ودعم فني متواصل', descriptionEn: 'High-speed cloud hosting services with continuous technical support',
    imageUrl: 'https://placehold.co/400x400/4338ca/white?text=Cloud+Host',
    category: 'technology', inStock: true, unit: 'شهريًا', minOrder: 1, createdAt: '2024-11-10T00:00:00.000Z',
  },
  // Al Noor Medical
  {
    id: 'prod-019', supplierId: 'user-007', supplierName: 'النور للمستلزمات الطبية',
    name: 'قفازات طبية معقمة (علبة 100)', nameEn: 'Sterile Medical Gloves (Box of 100)',
    price: 45, currency: 'SAR',
    description: 'قفازات طبية معقمة من اللاتكس المقوى', descriptionEn: 'Sterile medical gloves made of reinforced latex',
    imageUrl: 'https://placehold.co/400x400/06b6d4/white?text=Gloves',
    category: 'healthcare', inStock: true, unit: 'علبة', minOrder: 50, createdAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'prod-020', supplierId: 'user-007', supplierName: 'النور للمستلزمات الطبية',
    name: 'جهاز قياس ضغط الدم الرقمي', nameEn: 'Digital Blood Pressure Monitor',
    price: 320, currency: 'SAR',
    description: 'جهاز قياس ضغط الدم الرقمي دقيق وسهل الاستخدام', descriptionEn: 'Accurate and easy-to-use digital blood pressure monitor',
    imageUrl: 'https://placehold.co/400x400/0891b2/white?text=BP+Monitor',
    category: 'healthcare', inStock: true, unit: 'قطعة', minOrder: 10, createdAt: '2024-12-05T00:00:00.000Z',
  },
  {
    id: 'prod-021', supplierId: 'user-007', supplierName: 'النور للمستلزمات الطبية',
    name: 'كمامات طبية N95 (علبة 50)', nameEn: 'N95 Medical Masks (Box of 50)',
    price: 85, currency: 'SAR',
    description: 'كمامات طبية N95 معتمدة عالية الفلترة', descriptionEn: 'Certified high-filtration N95 medical masks',
    imageUrl: 'https://placehold.co/400x400/0e7490/white?text=N95+Mask',
    category: 'healthcare', inStock: true, unit: 'علبة', minOrder: 100, createdAt: '2024-12-10T00:00:00.000Z',
  },
  // Auto Zone
  {
    id: 'prod-022', supplierId: 'user-008', supplierName: 'أوتو زون لقطع الغيار',
    name: 'فلتر زيت تويوتا أصلي', nameEn: 'Genuine Toyota Oil Filter',
    price: 65, currency: 'SAR',
    description: 'فلتر زيت أصلي لتويوتا جميع الموديلات', descriptionEn: 'Genuine oil filter for Toyota all models',
    imageUrl: 'https://placehold.co/400x400/ef4444/white?text=Oil+Filter',
    category: 'automotive', inStock: true, unit: 'قطعة', minOrder: 20, createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'prod-023', supplierId: 'user-008', supplierName: 'أوتو زون لقطع الغيار',
    name: 'إطارات سيارات 17 بوصة', nameEn: 'Car Tires 17 inch',
    price: 450, currency: 'SAR',
    description: 'إطارات عالية الجودة مناسبة لجميع السيارات', descriptionEn: 'High quality tires suitable for all vehicles',
    imageUrl: 'https://placehold.co/400x400/dc2626/white?text=Tire+17',
    category: 'automotive', inStock: true, unit: 'قطعة', minOrder: 4, createdAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: 'prod-024', supplierId: 'user-008', supplierName: 'أوتو زون لقطع الغيار',
    name: 'بطارية سيارة 70 أمبير', nameEn: 'Car Battery 70 Amp',
    price: 380, currency: 'SAR',
    description: 'بطارية سيارة طويلة العمر 70 أمبير مع ضمان سنتين', descriptionEn: 'Long-life car battery 70 amp with 2-year warranty',
    imageUrl: 'https://placehold.co/400x400/b91c1c/white?text=Battery+70A',
    category: 'automotive', inStock: true, unit: 'قطعة', minOrder: 5, createdAt: '2025-01-10T00:00:00.000Z',
  },
];

const seedMessages: Message[] = [
  {
    id: 'msg-001', fromUsername: 'ahmed_co', fromDisplayName: 'أحمد للتجارة',
    toUsername: 'alraedah', subject: 'طلب عرض أسعار مواد بناء',
    body: 'السلام عليكم، نود الحصول على عرض أسعار لمواد البناء المطلوبة لمشروعنا الجديد في المنطقة الشرقية. المطلوب: 500 طن إسمنت، 10,000 حديد تسليح، و 50,000 طوب.',
    isRead: true, createdAt: '2025-01-15T10:30:00.000Z',
  },
  {
    id: 'msg-002', fromUsername: 'sara_hotel', fromDisplayName: 'فندق النخيل',
    toUsername: 'nadafoods', subject: 'استفسار عن توريد أغذية',
    body: 'نبحث عن مورد موثوق لتوريد المواد الغذائية لفندقنا. هل يمكنكم تزويدنا بقائمة المنتجات والأسعار؟',
    isRead: true, createdAt: '2025-01-20T14:00:00.000Z',
  },
  {
    id: 'msg-003', fromUsername: 'mohammed_fashion', fromDisplayName: 'محمد للأزياء',
    toUsername: 'royaltextile', subject: 'طلب عينات أقمشة',
    body: 'مرحبًا، نود طلب عينات من أقمشة القطن والحرير الصناعي لتقييم الجودة قبل الطلب الكبير.',
    isRead: false, createdAt: '2025-02-01T09:15:00.000Z',
  },
  {
    id: 'msg-004', fromUsername: 'khaled_factory', fromDisplayName: 'مصنع الخليج',
    toUsername: 'safachem', subject: 'طلب مواد كيميائية',
    body: 'نحتاج مواد مذيبة صناعية بكميات كبيرة. هل يمكنكم تقديم سعر خاص للطلبات الكبيرة؟',
    isRead: false, createdAt: '2025-02-05T11:45:00.000Z',
  },
  {
    id: 'msg-005', fromUsername: 'reem_pharmacy', fromDisplayName: 'صيدلية الريم',
    toUsername: 'alnoor-medical', subject: 'طلب مستلزمات طبية',
    body: 'نود طلب كمية من القفازات الطبية والكمامات N95. يرجى تزويدنا بأفضل سعر.',
    isRead: true, createdAt: '2025-02-10T16:30:00.000Z',
  },
];

const seedAds: SupplierAd[] = [
  {
    id: 'ad-001', supplierId: 'user-001', supplierName: 'شركة الرائدة للتجارة', supplierUsername: 'alraedah',
    title: 'عرض خاص: إسمنت بأسعار المصنع', description: 'احصل على إسمنت بورتلاندي بأفضل الأسعار مع توصيل مجاني للطلبات الكبيرة',
    placement: 'top', status: 'active', budget: 5000, impressions: 12500, clicks: 890,
    startDate: '2025-01-01T00:00:00.000Z', endDate: '2025-03-31T00:00:00.000Z', createdAt: '2024-12-28T00:00:00.000Z',
  },
  {
    id: 'ad-002', supplierId: 'user-002', supplierName: 'تك فيجن للإلكترونيات', supplierUsername: 'techvision',
    title: 'خصم 20% على جميع الأجهزة الإلكترونية', description: 'استفد من خصم 20% على شاشات العرض وأنظمة الأمان والتكييف',
    placement: 'featured', status: 'active', budget: 3000, impressions: 8500, clicks: 620,
    startDate: '2025-01-15T00:00:00.000Z', endDate: '2025-02-28T00:00:00.000Z', createdAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: 'ad-003', supplierId: 'user-007', supplierName: 'النور للمستلزمات الطبية', supplierUsername: 'alnoor-medical',
    title: 'مستلزمات طبية بأعلى معايير الجودة', description: 'توريد مستلزمات طبية للمستشفيات والعيادات مع ضمان الجودة',
    placement: 'featured', status: 'active', budget: 4000, impressions: 9200, clicks: 710,
    startDate: '2025-02-01T00:00:00.000Z', endDate: '2025-04-30T00:00:00.000Z', createdAt: '2025-01-25T00:00:00.000Z',
  },
  {
    id: 'ad-004', supplierId: 'user-006', supplierName: 'سمارت كود للتقنية', supplierUsername: 'smartcode',
    title: 'حلول تقنية متكاملة لشركتك', description: 'أنظمة ERP وتطبيقات جوال واستضافة سحابية بأفضل الأسعار',
    placement: 'highlighted', status: 'active', budget: 2500, impressions: 5800, clicks: 340,
    startDate: '2025-02-10T00:00:00.000Z', endDate: '2025-05-10T00:00:00.000Z', createdAt: '2025-02-05T00:00:00.000Z',
  },
];

// ============ STORE ============

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      suppliers: seedSuppliers,
      products: seedProducts,
      messages: seedMessages,
      ads: seedAds,

      // User actions
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, data) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...data } : u),
      })),
      deleteUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
      getUserByUsername: (username) => get().users.find(u => u.username === username),
      getUserById: (id) => get().users.find(u => u.id === id),

      // Supplier actions
      addSupplier: (supplier) => set((state) => ({ suppliers: [...state.suppliers, supplier] })),
      updateSupplier: (id, data) => set((state) => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...data } : s),
      })),
      deleteSupplier: (id) => set((state) => ({ suppliers: state.suppliers.filter(s => s.id !== id) })),
      getSupplierById: (id) => get().suppliers.find(s => s.id === id),

      // Product actions
      addProduct: (product) => set((state) => {
        const supplierProducts = [...state.products, product];
        const suppliers = state.suppliers.map(s =>
          s.id === product.supplierId ? { ...s, productCount: s.productCount + 1 } : s
        );
        return { products: supplierProducts, suppliers };
      }),
      updateProduct: (id, data) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p),
      })),
      deleteProduct: (id) => {
        const state = get();
        const product = state.products.find(p => p.id === id);
        if (product) {
          set((s) => {
            const suppliers = s.suppliers.map(sp =>
              sp.id === product.supplierId ? { ...sp, productCount: Math.max(0, sp.productCount - 1) } : sp
            );
            return { products: s.products.filter(p => p.id !== id), suppliers };
          });
        }
      },
      getProductsBySupplier: (supplierId) => get().products.filter(p => p.supplierId === supplierId),

      // Message actions
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      markMessageRead: (id) => set((state) => ({
        messages: state.messages.map(m => m.id === id ? { ...m, isRead: true } : m),
      })),
      deleteMessage: (id) => set((state) => ({ messages: state.messages.filter(m => m.id !== id) })),
      getMessagesByUsername: (username) => get().messages.filter(m => m.toUsername === username),

      // Ad actions
      addAd: (ad) => set((state) => ({ ads: [...state.ads, ad] })),
      updateAd: (id, data) => set((state) => ({
        ads: state.ads.map(a => a.id === id ? { ...a, ...data } : a),
      })),
      deleteAd: (id) => set((state) => ({ ads: state.ads.filter(a => a.id !== id) })),
      getAdsBySupplier: (supplierId) => get().ads.filter(a => a.supplierId === supplierId),
    }),
    {
      name: 'businfo-store',
    }
  )
);
