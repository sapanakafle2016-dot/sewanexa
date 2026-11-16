'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ne' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isNepali: boolean;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ne: {
    // Brand & Header
    'nav.brandSubtitle': 'तपाईंको स्थानीय सेवा, अब छिटो र भरपर्दो',
    'nav.allServices': 'सबै सेवाहरू',
    'nav.howItWorks': 'कसरी काम गर्छ?',
    'nav.myBookings': 'मेरा बुकिङहरू',
    'nav.admin': 'प्रशासन',
    'nav.earn': 'पार्टनर बन्नुहोस्',
    'nav.login': 'लग इन',
    'nav.register': 'साइन अप',
    'nav.logout': 'लग आउट',
    'nav.profile': 'मेरो प्रोफाइल',
    'nav.gps': 'स्थान',
    'nav.locating': 'स्थान पत्ता लगाउँदै...',
    'nav.switchLanguage': 'नेपाली',

    // Hero Section
    'hero.badge': '🇳🇵 नेपालको अग्रणी अन-डिमान्ड स्थानीय सेवा प्लेटफर्म',
    'hero.titleLine1': 'एप एक,',
    'hero.titleLine2': 'सेवा अनेक।',
    'hero.subtitle': 'प्रमाणित प्लम्बर, मेकानिक, इलेक्ट्रिसियन, मिस्त्री र प्राविधिकहरू १५ मिनेटमै तपाईंको ढोकामा। ईसेवा र खल्तीबाट सुरक्षित भुक्तानी।',
    'hero.searchPlaceholder': 'प्लम्बर, मेकानिक, एसी मर्मत, डकर्मी, पेन्टर खोज्नुहोस्...',
    'hero.searchButton': 'नजिकै खोज्नुहोस्',
    'hero.withinRadius': 'दायरा',
    'hero.km': 'कि.मि.',
    'hero.quickSearch': 'लोकप्रिय सेवाहरू:',

    // Trust Metrics
    'trust.fastDispatch': '१५ मिनेटमा सेवा',
    'trust.fastDispatchSub': 'नजिकैको सक्रिय प्राविधिक तुरुन्त प्रस्थान',
    'trust.vettedPros': '१००% नागरिकता प्रमाणित',
    'trust.vettedProsSub': 'सरकारी परिचयपत्र तथा सीप परीक्षण गरिएको',
    'trust.secureEscrow': 'ईसेवा तथा खल्ती एस्क्रो',
    'trust.secureEscrowSub': 'काम सम्पन्न भएपछि मात्र भुक्तानी फुकुवा',
    'trust.satisfaction': '४.९ / ५ ग्राहक सन्तुष्टि',
    'trust.satisfactionSub': '१,२०० भन्दा बढी सफल सेवाहरू सम्पन्न',

    // Category Section
    'category.badge': 'श्रेणी अनुसार खोज्नुहोस्',
    'category.title': 'आज तपाईंलाई कुन सेवा आवश्यक छ?',
    'category.subtitle': 'नेपालका मुख्य ६ श्रेणीहरूमा ४५ भन्दा बढी विशेष स्थानीय सेवाहरू उपलब्ध छन्।',
    'category.viewAll': 'सबै ४५+ सेवाहरू हेर्नुहोस्',
    'category.browsePros': 'प्राविधिकहरू हेर्नुहोस्',

    // Categories
    'cat.home': 'घर मर्मत तथा प्लम्बिङ',
    'cat.homeDesc': 'प्लम्बर, इलेक्ट्रिसियन, रङरोगन, एसी, पानी ट्यांकी तथा फर्निचर मर्मत',
    'cat.auto': 'सवारी तथा सडक सहायता',
    'cat.autoDesc': '२४/७ बाइक तथा कार मोबाइल मेकानिक, टोइङ र पन्चर मर्मत',
    'cat.construction': 'निर्माण तथा डकर्मी काम',
    'cat.constructionDesc': 'डकर्मी, टायल मार्बल, वेल्डिङ, आल्मुनियम, सिसा तथा घर पुनर्निर्माण',
    'cat.personal': 'व्यक्तिगत हेरचाह तथा सौन्दर्य',
    'cat.personalDesc': 'होम सलुन, मेकअप, फोटोग्राफी, गृहशिक्षक तथा टेलरिङ सेवा',
    'cat.gadgets': 'प्रविधि तथा ग्याजेट मर्मत',
    'cat.gadgetsDesc': 'ल्यापटप, मोबाइल, सीसीटीभी क्यामेरा जडान तथा इन्टरनेट नेटवर्किङ',
    'cat.support': 'दैनिक सहयोग तथा ढुवानी',
    'cat.supportDesc': 'चालक, घर सार्ने/प्याकर्स, लुगा धुने, बगैंचा तथा सहयोगीहरू',

    // Nearby Providers
    'pros.badge': 'अहिले तत्काल उपलब्ध',
    'pros.title': 'तपाईंको नजिकका प्रमाणित प्राविधिकहरू',
    'pros.subtitle': 'लोकन्थली र काठमाडौँ उपत्यकामा तुरुन्त सेवा दिन तयार दक्ष पेशाकर्मीहरू।',
    'pros.verified': 'प्रमाणित',
    'pros.completed': 'काम सम्पन्न',
    'pros.baseFee': 'सुरुवाती शुल्क',
    'pros.bookNow': 'अहिले बुक गर्नुहोस्',
    'pros.viewProfile': 'प्रोफाइल हेर्नुहोस्',

    // How It Works
    'how.badge': 'कसरी काम गर्छ?',
    'how.title': 'सरल र सुरक्षित ४ चरणमा सेवा प्राप्त गर्नुहोस्',
    'how.subtitle': 'खोज्नुहोस्, तुरुन्त म्याच गर्नुहोस्, ढोकामै सेवा लिनुहोस् र ढुक्कसँग डिजिटल भुक्तानी गर्नुहोस्।',
    'how.forCustomers': 'ग्राहकहरूको लागि',
    'how.forProviders': 'सेवा प्रदायकहरूको लागि (दैनिक कमाउनुहोस्)',
    'how.step1Title': 'सेवा र नजिकको दूरी छनोट गर्नुहोस्',
    'how.step1Desc': 'आफ्नो आवश्यकता अनुसार सेवा छान्नुहोस् र आफ्नो वडा वा १ देखि १५ कि.मि. दूरीभित्रका दक्ष व्यक्ति खोज्नुहोस्।',
    'how.step2Title': 'प्रमाणित प्रोफाइल र दररेट जाँच्नुहोस्',
    'how.step2Desc': 'नेपाली नागरिकता प्रमाणित, ग्राहक समीक्षाहरू र पारदर्शी नेपाली रुपैयाँ (NPR) दररेट हेर्नुहोस्। कुनै मोलतोल चाहिँदैन।',
    'how.step3Title': '१५ मिनेटमै ढोकामा सेवा प्रस्थान',
    'how.step3Desc': 'नजिकैको प्राविधिक बाइकमा तुरुन्त तपाईंको ठेगानामा आइपुग्छ। वास्तविक समयमा आगमन ट्र्याक गर्नुहोस्।',
    'how.step4Title': 'ईसेवा वा खल्तीबाट सुरक्षित भुक्तानी',
    'how.step4Desc': 'काम पूर्ण रूपमा सन्तोषजनक सम्पन्न भएपछि मात्र ईसेवा, खल्ती वा नगदबाट सुरक्षित भुक्तानी गर्नुहोस्।',

    // Partner Recruitment
    'partner.badge': 'सेवा पार्टनर बन्नुहोस् र दैनिक कमाउनुहोस्',
    'partner.title': 'के तपाईं अनुभवी प्लम्बर, मेकानिक, इलेक्ट्रिसियन वा प्राविधिक हुनुहुन्छ?',
    'partner.desc': 'नेपालभरका हजारौँ दक्ष कामदारहरूसँग जोडिनुहोस्। आफ्नो वडामा दैनिक काम पाउनुहोस्, ९०% आम्दानी आफैं राख्नुहोस्, र ईसेवा/खल्तीमा सिधै रकम प्राप्त गर्नुहोस्।',
    'partner.registerBtn': 'पार्टनरको रूपमा दर्ता हुनुहोस्',
    'partner.howItWorksBtn': 'कसरी काम गर्छ?',

    // Payments Section
    'pay.badge': 'नेपालका आधिकारिक वालेटहरू',
    'pay.title': 'सुरक्षित तथा डिजिटल भुक्तानी प्रणाली',
    'pay.desc': 'SEWANEXA ले नेपालका प्रमुख डिजिटल भुक्तानी प्रणालीहरूलाई समर्थन गर्दछ। ग्राहकका लागि कुनै अतिरिक्त शुल्क छैन।',
    'pay.esewa': 'ईसेवा (eSewa)',
    'pay.khalti': 'खल्ती (Khalti)',
    'pay.cod': 'काम पछिको नगद भुक्तानी',

    // Footer
    'footer.tagline': 'नेपालको सबैभन्दा भरपर्दो स्थानीय सेवा बजार। साङ्गालो टेक प्रा.लि., लोकन्थली, भक्तपुर।',
    'footer.company': 'कम्पनी',
    'footer.about': 'हाम्रोबारे',
    'footer.services': 'सेवाहरूको सूची',
    'footer.safety': 'सुरक्षा तथा नीति',
    'footer.terms': 'सर्त तथा नियमहरू',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.support': 'सहयोग तथा हेल्पलाइन',
    'footer.rights': 'सर्वाधिकार सुरक्षित। साङ्गालो टेक प्रा.लि. द्वारा सञ्चालित।',
  },

  en: {
    // Brand & Header
    'nav.brandSubtitle': 'Your Local Services Connected',
    'nav.allServices': 'All Services',
    'nav.howItWorks': 'How It Works',
    'nav.myBookings': 'My Bookings',
    'nav.admin': 'Admin Portal',
    'nav.earn': 'Become a Partner',
    'nav.login': 'Log In',
    'nav.register': 'Sign Up',
    'nav.logout': 'Log Out',
    'nav.profile': 'My Profile',
    'nav.gps': 'Location',
    'nav.locating': 'Locating...',
    'nav.switchLanguage': 'English',

    // Hero Section
    'hero.badge': '🇳🇵 Nepal’s #1 On-Demand Local Services Marketplace',
    'hero.titleLine1': 'One App,',
    'hero.titleLine2': 'Endless Services.',
    'hero.subtitle': 'Verified plumbers, mechanics, electricians, masons, and technicians at your doorstep in 15 minutes. 100% escrow protected via eSewa & Khalti.',
    'hero.searchPlaceholder': 'Search plumbers, mechanics, AC repair, masons, painters...',
    'hero.searchButton': 'Search Nearby',
    'hero.withinRadius': 'Within',
    'hero.km': 'km',
    'hero.quickSearch': 'Popular Services:',

    // Trust Metrics
    'trust.fastDispatch': '15-Min Proximity Arrival',
    'trust.fastDispatchSub': 'Nearest active technician dispatched immediately',
    'trust.vettedPros': 'Citizenship Verified Pros',
    'trust.vettedProsSub': 'National ID and skills vetted by Sangalo Tech',
    'trust.secureEscrow': 'eSewa & Khalti Escrow',
    'trust.secureEscrowSub': 'Funds released only upon 100% job satisfaction',
    'trust.satisfaction': '4.9 / 5 Rating',
    'trust.satisfactionSub': 'Over 1,200+ completed jobs across Nepal',

    // Category Section
    'category.badge': 'Explore by Category',
    'category.title': 'What do you need done today?',
    'category.subtitle': 'Browse 6 core categories with over 45+ specialized local services across Nepal.',
    'category.viewAll': 'View All 45+ Services',
    'category.browsePros': 'Browse Professionals',

    // Categories
    'cat.home': 'Home Maintenance & Repair',
    'cat.homeDesc': 'Plumbing, Electricians, House Painting, AC, Water Tank & Carpentry',
    'cat.auto': 'Vehicle & Roadside Assistance',
    'cat.autoDesc': '24/7 Car & Bike Mechanics, Towing, Roadside Assistance & Tyre Repair',
    'cat.construction': 'Construction & Civil Trades',
    'cat.constructionDesc': 'Masons, Tile & Marble, Welding, Aluminium, Glass & House Renovation',
    'cat.personal': 'Personal Care & Lifestyle',
    'cat.personalDesc': 'Home Salon, Beauticians, Photography, Home Tutors & Tailoring',
    'cat.gadgets': 'Gadgets & Technology',
    'cat.gadgetsDesc': 'Laptop, Mobile Repair, CCTV Camera Setup & Internet Networking',
    'cat.support': 'Daily Support & Errands',
    'cat.supportDesc': 'Drivers, Movers & Packers, Laundry, Gardening & House Helpers',

    // Nearby Providers
    'pros.badge': 'Available Right Now',
    'pros.title': 'Verified Professionals Nearby',
    'pros.subtitle': 'Active tradespeople in your immediate neighborhood ready for rapid dispatch.',
    'pros.verified': 'Verified',
    'pros.completed': 'Completed',
    'pros.baseFee': 'Base Rate',
    'pros.bookNow': 'Book Now',
    'pros.viewProfile': 'View Profile',

    // How It Works
    'how.badge': 'Simple 4-Step Process',
    'how.title': 'How SEWANEXA Works',
    'how.subtitle': 'From discovering nearby professionals to completing payment securely via eSewa or Khalti.',
    'how.forCustomers': 'For Customers & Homes',
    'how.forProviders': 'For Service Pros (Earn Daily)',
    'how.step1Title': 'Choose Service & Proximity',
    'how.step1Desc': 'Select from 45+ trades and set your preferred distance from 1 to 15 km of your doorstep.',
    'how.step2Title': 'Compare Vetted Pros & Transparent Rates',
    'how.step2Desc': 'Check citizenship badges, real customer reviews, and clear rates in NPR. No bargaining needed.',
    'how.step3Title': '15-Minute Rapid Doorstep Dispatch',
    'how.step3Desc': 'The nearest pro heads to your location on bike. Track real-time arrival and call directly.',
    'how.step4Title': 'Escrow Guarantee via eSewa & Khalti',
    'how.step4Desc': 'Pay only after satisfaction via eSewa, Khalti, or Cash with full platform escrow protection.',

    // Partner Recruitment
    'partner.badge': 'Earn Daily as a Service Partner',
    'partner.title': 'Are you an experienced plumber, mechanic, electrician, or technician?',
    'partner.desc': 'Join thousands of skilled workers in Nepal receiving daily job requests in their locality. Keep 90% of your earnings, set your own working hours, and get paid directly.',
    'partner.registerBtn': 'Register as Partner',
    'partner.howItWorksBtn': 'How it Works',

    // Payments Section
    'pay.badge': 'Official Nepal Gateways',
    'pay.title': 'Direct & Protected Payments Across Nepal',
    'pay.desc': 'SEWANEXA integrates directly with Nepal’s leading digital wallets. No hidden markups for customers.',
    'pay.esewa': 'eSewa ePay v2',
    'pay.khalti': 'Khalti v2',
    'pay.cod': 'Cash on Delivery',

    // Footer
    'footer.tagline': 'Nepal’s most trusted local services marketplace. Sangalo Tech Pvt. Ltd., Lokanthali, Bhaktapur.',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.services': 'All Services',
    'footer.safety': 'Safety Guidelines',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.support': 'Support & Helpline',
    'footer.rights': 'All rights reserved. Powered by Sangalo Tech Pvt. Ltd.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ne');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sewanexa_lang') as Language;
      if (stored === 'ne' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // Default to Nepali ('ne')
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sewanexa_lang', lang);
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ne' ? 'en' : 'ne');
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.ne;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isNepali: language === 'ne',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

