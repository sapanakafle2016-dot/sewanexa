'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Wrench,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AccordionItem {
  id: string;
  category: 'general' | 'safety' | 'pricing' | 'provider';
  categoryLabelNe: string;
  categoryLabelEn: string;
  questionNe: string;
  questionEn: string;
  answerNe: string;
  answerEn: string;
  icon: any;
  highlightNe?: string;
  highlightEn?: string;
}

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    categoryLabelNe: 'बुकिङ प्रक्रिया',
    categoryLabelEn: 'Booking Process',
    questionNe: 'Sewanexa मार्फत घरमै बसेर सेवा कसरी बुक गर्ने?',
    questionEn: 'How do I book a certified professional on Sewanexa?',
    answerNe:
      'तपाईंले वेबसाइट वा मोबाइल एपमा आफूलाई चाहिएको सेवा (जस्तै: प्लम्बर, बाइक मेकानिक, सरसफाइ) छान्नुहोस्। तपाईंको टोल वा वडा नजिकैका सक्रिय प्राविधिकहरू लाइभ देखिनेछन्। "तुरुन्त बुक गर्नुहोस्" मा थिचेर वा सिधै २४/७ हटलाइन ०१-५९०१२३४ मा फोन गरेर १५ देखि ३० मिनेटभित्र दक्ष पेशाकर्मी बोलाउन सक्नुहुन्छ।',
    answerEn:
      'Select your required trade (Plumber, Bike/Car Mechanic, Electrician, Deep Cleaning) on our website or mobile app. Our GPS radar immediately surfaces verified pros nearest to your ward. Tap "Book Now" or call our 24/7 hotline 01-5901234 to have a pro arrive within 15–30 minutes.',
    icon: Wrench,
    highlightNe: '१५-३० मिनेटभित्र द्रुत आगमन',
    highlightEn: '15-30 Min Rapid Dispatch',
  },
  {
    id: 'faq-2',
    category: 'safety',
    categoryLabelNe: 'सुरक्षा र भरोसा',
    categoryLabelEn: 'Trust & Safety',
    questionNe: 'Sewanexa का प्राविधिकहरू कति सुरक्षित र भरपर्दा हुन्छन्?',
    questionEn: 'How are technicians vetted for home and business safety?',
    answerNe:
      'हाम्रो प्लेटफर्ममा दर्ता हुने १००% सेवा प्रदायकहरूको सरकारी नेपाली नागरिकता, स्थायी ठेगाना, पुलिस चारित्रिक प्रमाणपत्र र सीप अनुभव साङ्गालो टेक प्रा.लि. को सुरक्षा टोलीद्वारा प्रत्यक्ष भौतिक उपस्थितिमा रुजु गरिन्छ। काम सम्पन्न भएपछि ग्राहकको ५-तारे मूल्याङ्कन प्रणालीबाट गुणस्तर निरन्तर अनुगमन गरिन्छ।',
    answerEn:
      'Every professional registered on Sewanexa undergoes mandatory 100% government citizenship verification, police background record check, and physical skills assessment by Sangalo Tech Pvt. Ltd. Ongoing ratings ensure only top-rated tradespeople remain active on the platform.',
    icon: ShieldCheck,
    highlightNe: '१००% नागरिकता र पुलिस रेकर्ड प्रमाणित',
    highlightEn: '100% Government & Police Vetted',
  },
  {
    id: 'faq-3',
    category: 'pricing',
    categoryLabelNe: 'पारदर्शी दररेट',
    categoryLabelEn: 'Fair Pricing',
    questionNe: 'के सेवा शुल्कमा मोलतोल गर्नुपर्छ? सुरुवाती मूल्य कति हो?',
    questionEn: 'Do I need to haggle or negotiate? How is the pricing structured?',
    answerNe:
      'कुनै मोलतोल वा लुकेको शुल्क लाग्दैन! प्रत्येक सेवाको आधारभूत सुरुवाती दर (जस्तै: प्लम्बिङ रु ५००, बाइक मर्मत रु ४००) पहिल्यै स्पष्ट रूपमा तोकिएको हुन्छ। प्राविधिकले काम सुरु गर्नु अगावै आवश्यक पार्टपुर्जा र कुल लागतको पारदर्शी डिजिटल अनुमान ग्राहकलाई देखाउँछन्।',
    answerEn:
      'Zero haggling and zero hidden fees! Every trade has a clear, standardized starting rate (e.g., Plumbing NPR 500, Bike Mechanic NPR 400). Technicians provide a transparent digital estimate before commencing any repairs or spare parts installation.',
    icon: CreditCard,
    highlightNe: 'पारदर्शी दररेट • मोलतोल शून्य',
    highlightEn: 'Standard Rates • Zero Haggling',
  },
  {
    id: 'faq-4',
    category: 'pricing',
    categoryLabelNe: 'भुक्तानी र वारेन्टी',
    categoryLabelEn: 'Payments & Warranty',
    questionNe: 'ईसेवा, खल्ती वा कामपछिको नगद (COD) भुक्तानी कसरी सुरक्षित हुन्छ?',
    questionEn: 'How does escrow protection work with eSewa, Khalti, and Cash on Delivery?',
    answerNe:
      'Sewanexa ले सुरक्षित डिजिटल एस्क्रो प्रणाली अपनाएको छ। तपाईंले ईसेवा (eSewa v2) वा खल्ती (Khalti Pidx) बाट गरेको भुक्तानी काम पूर्ण सम्पन्न भई ग्राहकले सन्तोषजनक रूपमा काम निरीक्षण गरेपछि मात्र फुकुवा हुन्छ। साथै, प्रत्येक काममा ७ दिने निःशुल्क सर्भिस वारेन्टी ग्यारेन्टी रहन्छ।',
    answerEn:
      'We use an escrow protection model. Digital payments made via eSewa v2 or Khalti Pidx are held securely and only released to the service provider after your physical inspection and approval. Plus, all jobs come with a 7-day service satisfaction warranty.',
    icon: CheckCircle2,
    highlightNe: '७ दिने निःशुल्क सर्भिस वारेन्टी',
    highlightEn: '7-Day Free Service Warranty',
  },
  {
    id: 'faq-5',
    category: 'general',
    categoryLabelNe: 'आकस्मिक सेवा',
    categoryLabelEn: 'Emergency Hotline',
    questionNe: 'के रातिको समयमा वा शनिबार पनि आपतकालीन सेवा उपलब्ध हुन्छ?',
    questionEn: 'Are emergency repairs available during late nights or public holidays?',
    answerNe:
      'हो! काठमाडौँ उपत्यकाभर (काठमाडौँ, ललितपुर र भक्तपुर) सडकमा बाइक/कार बिग्रिएमा, पानीको पाइप फुटेमा वा बिजुली सर्ट भएमा हाम्रो २४/७ आकस्मिक रेस्पोन्स टिम निरन्तर सक्रिय रहन्छ। तपाईंले ०१-५९०१२३४ वा ९८००-०००००० मा जुनसुकै समयमा सम्पर्क गर्न सक्नुहुन्छ।',
    answerEn:
      'Yes! For road vehicle breakdowns, burst water mains, or severe electrical shorts across Kathmandu Valley, our 24/7 Rapid Emergency Response team is on standby 365 days a year including weekends and holidays. Direct hotline: 01-5901234.',
    icon: Clock,
    highlightNe: '२४/७ उपत्यका आपतकालीन हटलाइन',
    highlightEn: '24/7 Valley Emergency Hotline',
  },
  {
    id: 'faq-6',
    category: 'provider',
    categoryLabelNe: 'साझेदार प्रदायक',
    categoryLabelEn: 'For Partners',
    questionNe: 'म दक्ष प्राविधिक हुँ, Sewanexa मा जोडिएर कसरी दैनिक आम्दानी बढाउने?',
    questionEn: 'I am a skilled technician. How can I join Sewanexa and get daily jobs?',
    answerNe:
      'यदि तपाईंसँग प्लम्बिङ, मेकानिक, विजुली वा अन्य कुनै सीप छ भने "सेवा प्रदायक बन्नुहोस्" फारम भर्नुहोस्। हाम्रो कमिसन मोडल केवल १०% पारदर्शी छ, र ९०% आम्दानी सिधै तपाईंको ईसेवा वा बैंक खातामा दैनिक भुक्तानी हुन्छ। साथै, निःशुल्क आधुनिक औजार तालिम र सुरक्षा सहयोग प्रदान गरिन्छ।',
    answerEn:
      'If you have trade skills, register online via our "Become a Partner" portal. We take only a fair 10% platform fee, with 90% of earnings disbursed directly to your eSewa, Khalti, or bank account daily. We also offer free modern tools training and safety support.',
    icon: Sparkles,
    highlightNe: 'दैनिक ९०% सिधा आम्दानी • पारदर्शी १०% कमिसन',
    highlightEn: 'Daily 90% Payout • Flat 10% Cut',
  },
];

export const FaqAccordion = () => {
  const { isNepali } = useLanguage();
  const [openId, setOpenId] = useState<string>('faq-1');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'general' | 'safety' | 'pricing' | 'provider'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedFilter === 'all' || item.category === selectedFilter;
    const query = searchFilter.toLowerCase();
    const matchesSearch =
      !query ||
      item.questionNe.toLowerCase().includes(query) ||
      item.questionEn.toLowerCase().includes(query) ||
      item.answerNe.toLowerCase().includes(query) ||
      item.answerEn.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 sm:py-16">
      {/* Header with high contrast and larger font size */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f6f4fb] border border-[#ded4f1] text-[#331e6a] text-xs sm:text-sm font-bold tracking-wide">
          <HelpCircle className="w-4 h-4 text-[#f59e0b]" />
          <span>{isNepali ? 'बारम्बार सोधिने प्रश्नहरू' : 'Frequently Asked Questions'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {isNepali
            ? 'तपाईंका जिज्ञासा र Sewanexa का स्पष्ट जवाफ'
            : 'Clear Answers to Your Common Inquiries'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isNepali
            ? 'सेवा बुकिङ, प्राविधिकहरूको सुरक्षा मापदण्ड, पारदर्शी मूल्य र भुक्तानी सुरक्षा सम्बन्धी सम्पूर्ण विवरणहरू।'
            : 'Everything you need to know about rapid dispatch, technician verification, fair pricing, and secure escrow payments.'}
        </p>

        {/* Interactive Search & Filter Chips */}
        <div className="pt-3 max-w-md mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isNepali ? 'प्रश्न खोज्नुहोस् (जस्तै: मूल्य, वारेन्टी, दर्ता)...' : 'Search questions (e.g., pricing, warranty)...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#331e6a]/30 focus:border-[#331e6a] shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', labelNe: 'सबै प्रश्नहरू', labelEn: 'All Questions' },
            { id: 'general', labelNe: 'बुकिङ र सेवा', labelEn: 'Booking' },
            { id: 'safety', labelNe: 'सुरक्षा र प्रमाणीकरण', labelEn: 'Trust & Safety' },
            { id: 'pricing', labelNe: 'दररेट र भुक्तानी', labelEn: 'Pricing & Escrow' },
            { id: 'provider', labelNe: 'सेवा प्रदायक', labelEn: 'For Partners' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-[#331e6a] text-white shadow-md shadow-[#331e6a]/20 scale-[1.02]'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {isNepali ? tab.labelNe : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Container */}
      <div className="max-w-4xl mx-auto space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
            {isNepali ? 'कुनै नतिजा फेला परेन। कृपया अर्को शब्द खोजी गर्नुहोस्।' : 'No matching questions found.'}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl transition-all duration-200 border overflow-hidden ${
                  isOpen
                    ? 'border-[#331e6a] shadow-lg shadow-[#331e6a]/8 ring-1 ring-[#331e6a]/20'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Accordion Header / Trigger Button */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#331e6a] text-white'
                          : 'bg-[#f6f4fb] text-[#331e6a] border border-[#ded4f1]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {isNepali ? faq.categoryLabelNe : faq.categoryLabelEn}
                        </span>
                        {faq.highlightNe && isOpen && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {isNepali ? faq.highlightNe : faq.highlightEn}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-bold transition-colors ${
                          isOpen ? 'text-[#331e6a]' : 'text-slate-900 hover:text-[#331e6a]'
                        }`}
                      >
                        {isNepali ? faq.questionNe : faq.questionEn}
                      </h3>
                    </div>
                  </div>

                  {/* Animated Chevron indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#331e6a]/10 text-[#331e6a] rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content / Body with smooth transition */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 border-t border-slate-100 animate-fadeIn">
                    <p className="text-sm sm:text-base leading-relaxed font-normal">
                      {isNepali ? faq.answerNe : faq.answerEn}
                    </p>

                    {/* Bottom pill highlight */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isNepali ? 'साङ्गालो टेक प्रा.लि. द्वारा प्रमाणित सेवा' : 'Verified by Sangalo Tech Pvt. Ltd.'}</span>
                      </div>
                      <a
                        href="tel:015901234"
                        className="inline-flex items-center gap-1.5 font-bold text-[#331e6a] hover:text-[#f59e0b] transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isNepali ? 'कुनै अन्य जिज्ञासा भए ०१-५९०१२३४' : 'Further Assistance: 01-5901234'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

