import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "ar";
export type Direction = "ltr" | "rtl";

export interface Translations {
  // Announcement & Top Bar
  freeShipping: string;
  onOrdersOver: string;
  expressKSA: string;
  currency: string;
  help: string;

  // Navigation & Headers
  home: string;
  catalog: string;
  newArrivals: string;
  myOrders: string;
  account: string;
  cart: string;
  wishlist: string;
  signIn: string;
  createAccount: string;
  aboutUs: string;
  partners: string;

  // Categories
  allCategories: string;
  networking: string;
  servers: string;
  workstations: string;
  components: string;
  storage: string;
  powerUPS: string;
  cablesAdapters: string;

  // Search
  searchPlaceholder: string;
  searchButton: string;

  // Common UI & Section Titles
  viewAll: string;
  viewAllNewArrivals: string;
  shopByCategoryTitle: string;
  featuredBrandsTitle: string;
  bestSellersTitle: string;
  newArrivalsTitle: string;
  topDealsTitle: string;
  addToCart: string;
  addedToCart: string;
  outOfStock: string;
  inStock: string;
  freeShippingGuarantee: string;
  officialSaudiWarranty: string;
  zatcaVatInvoice: string;
  support247: string;

  // Cart Drawer
  yourCart: string;
  subtotal: string;
  vatTaxIncluded: string;
  proceedToCheckout: string;
  continueShopping: string;
  emptyCartMessage: string;
}

const enTranslations: Translations = {
  freeShipping: "Free Shipping",
  onOrdersOver: "On orders over 499 SAR",
  expressKSA: "Express Delivery Across KSA",
  currency: "SAR",
  help: "Help",
  home: "Home",
  catalog: "Catalog",
  newArrivals: "New Arrivals",
  myOrders: "My Orders",
  account: "My Account",
  cart: "Cart",
  wishlist: "Wishlist",
  signIn: "Sign In",
  createAccount: "Register",
  aboutUs: "About Us",
  partners: "Partners",
  allCategories: "All Categories",
  networking: "Enterprise Networking",
  servers: "Rack Servers & NAS",
  workstations: "Pro Workstations",
  components: "PC Components",
  storage: "Storage & SSDs",
  powerUPS: "Power & UPS",
  cablesAdapters: "Patch Cables & Optics",
  searchPlaceholder: "Search networking, computers, SKUs...",
  searchButton: "Search",
  viewAll: "View All",
  viewAllNewArrivals: "View All New Arrivals",
  shopByCategoryTitle: "Shop Hardware By Category",
  featuredBrandsTitle: "Official Enterprise Tech Partners",
  bestSellersTitle: "Top Rated & Best Selling Hardware",
  newArrivalsTitle: "Latest New Arrivals",
  topDealsTitle: "Hot Deals & Promotions",
  addToCart: "Add to Cart",
  addedToCart: "Added!",
  outOfStock: "Out of Stock",
  inStock: "In Stock",
  freeShippingGuarantee: "Free Express KSA Shipping Over 499 SAR",
  officialSaudiWarranty: "Official KSA Warranty & Replacement",
  zatcaVatInvoice: "ZATCA 15% VAT Tax Compliant Invoices",
  support247: "24/7 Enterprise Tech Support",
  yourCart: "Your Shopping Cart",
  subtotal: "Subtotal",
  vatTaxIncluded: "15% ZATCA VAT Included",
  proceedToCheckout: "Proceed to Checkout",
  continueShopping: "Continue Shopping",
  emptyCartMessage: "Your shopping cart is empty.",
};

const arTranslations: Translations = {
  freeShipping: "شحن مجاني",
  onOrdersOver: "للطلبات بأكثر من 499 ر.س",
  expressKSA: "توصيل سريع لكافة مناطق المملكة",
  currency: "ر.س",
  help: "المساعدة",
  home: "الرئيسية",
  catalog: "المنتجات",
  newArrivals: "وصل حديثاً",
  myOrders: "طلباتي",
  account: "حسابي",
  cart: "السلة",
  wishlist: "المفضلة",
  signIn: "تسجيل الدخول",
  createAccount: "إنشاء حساب",
  aboutUs: "من نحن",
  partners: "شركاؤنا",
  allCategories: "جميع الأقسام",
  networking: "شبكات وحلول المؤسسات",
  servers: "خوادم وسيرفرات التخزين",
  workstations: "محطات العمل الاحترافية",
  components: "مكونات الحاسوب",
  storage: "أقراص التخزين وSSD",
  powerUPS: "إمدادات الطاقة والـ UPS",
  cablesAdapters: "كابلات وألياف بصرية",
  searchPlaceholder: "ابحث عن معدات الشبكات، أجهزة الكمبيوتر، الأجزاء...",
  searchButton: "بحث",
  viewAll: "عرض الكل",
  viewAllNewArrivals: "عرض جميع المنتجات الجديدة",
  shopByCategoryTitle: "تسوق الأجهزة حسب القسم",
  featuredBrandsTitle: "شركاء التقنية المعتمدين في المملكة",
  bestSellersTitle: "المنتجات الأكثر مبيعاً وتقييماً",
  newArrivalsTitle: "أحدث المنتجات الواصلة حديثاً",
  topDealsTitle: "أقوى العروض والتخفيضات",
  addToCart: "أضف للسلة",
  addedToCart: "تمت الإضافة!",
  outOfStock: "غير متوفر",
  inStock: "متوفر",
  freeShippingGuarantee:
    "شحن مجاني سريع لجميع مدن المملكة عند الشراء بـ 499 ر.س",
  officialSaudiWarranty: "ضمان سعودي رسمي واستبدال فوري",
  zatcaVatInvoice: "فواتير ضريبية معتمدة 15% من هيئة الزكاة والضريبة والجمارك",
  support247: "دعم فني وتأهيل شبكي على مدار 24/7",
  yourCart: "سلة التسوق الخاص بك",
  subtotal: "المجموع الفرعي",
  vatTaxIncluded: "شامل ضريبة القيمة المضافة 15% ZATCA",
  proceedToCheckout: "إتمام الشراء والطلب",
  continueShopping: "متابعة التسوق",
  emptyCartMessage: "سلة التسوق فارغة حالياً.",
};

interface LanguageState {
  language: Language;
  direction: Direction;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      direction: "ltr",
      t: enTranslations,
      setLanguage: (lang: Language) => {
        const direction = lang === "ar" ? "rtl" : "ltr";
        if (typeof document !== "undefined") {
          document.documentElement.dir = direction;
          document.documentElement.lang = lang;
        }
        set({
          language: lang,
          direction,
          t: lang === "ar" ? arTranslations : enTranslations,
        });
      },
      toggleLanguage: () => {
        const nextLang = get().language === "en" ? "ar" : "en";
        get().setLanguage(nextLang);
      },
    }),
    {
      name: "samud-language-storage",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.dir = state.direction;
          document.documentElement.lang = state.language;
        }
      },
    },
  ),
);
