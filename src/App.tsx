/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// Types
type Step = 'LANDING' | 'WRITE' | 'COLLECTION' | 'LOADING' | 'SUCCESS' | 'ARCHIVE' | 'SOCIAL';

interface Submission {
  text: string;
  name: string;
  email: string;
  phone?: string;
  igHandle?: string;
  tiktokHandle?: string;
  city?: string;
  age?: string;
}

const ARCHIVE_SEEDS = [
  { text: "Terima kasih sudah selalu ada, walau hanya lewat silent support yang kadang bikin aku bingung sendiri.", city: "Jakarta", age: "26" },
  { text: "Aku nggak pernah bilang, tapi aku bangga banget jadi anak Ayah.", city: "Bandung", age: "23" },
  { text: "Maaf ya Yah, aku belum bisa jadi seperti yang Ayah mau. Tapi aku lagi usaha.", city: "Yogyakarta", age: "21" },
  { text: "Kenapa sih Ayah nggak pernah mau kelihatan capek di depan kita? Padahal kita tahu.", city: "Surabaya", age: "28" },
  { text: "Kadang aku rindu masakan nasi goreng Ayah yang gosong dikit itu.", city: "Semarang", age: "25" },
  { text: "Aku ingin Ayah tahu kalau aku sudah memaafkan semuanya. Kita mulai dari awal lagi ya?", city: "Malang", age: "29" },
  { text: "Ayah, doakan aku dari sana ya. Aku kangen banget.", city: "Denpasar", age: "30" },
  { text: "Waktu Ayah bilang 'hati-hati di jalan', aku dengarnya 'Ayah sayang kamu'.", city: "Medan", age: "24" },
];

const PREDETERMINED_CARDS = [
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063728/1_iiy33q.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063728/3_ym3pof.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063728/2_gp5ygf.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063728/4_dl3cfa.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063729/6_xgeu0j.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063729/5_zg4g50.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063729/9_xc5rsq.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063730/10_o3jedn.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063729/8_jemqfb.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063730/7_qrugty.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063730/11_jktikb.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063731/15_g6a5i6.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063730/14_lqq7rt.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063731/13_pga7ii.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063731/12_iulowz.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063732/16_kjpqar.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063733/17_ffjuv4.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063733/18_pevdyd.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063734/19_m28tlo.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063734/20_rrfjxz.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063735/22_xe1fd9.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063734/21_vmf8at.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063735/23_zozs8q.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063736/24_tluj7e.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063736/25_pm9gjf.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063737/26_mmtu6q.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063737/27_rsd99u.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063738/28_jltiwm.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063738/29_q6sb8k.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063739/31_qcbmc2.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063739/32_qpngqp.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063738/30_mug8ts.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063739/33_xyulpg.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063740/35_a2wn0q.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063740/34_xwmbxw.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063740/36_rec0vl.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063741/37_hl9sx5.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063742/39_thuzpg.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063741/38_dpypjw.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063742/40_ogustn.png",
  "https://res.cloudinary.com/dkhf63xbe/image/upload/v1778063742/Prize_k2uvr7.png",
];

export default function App() {
  const [step, setStep] = useState<Step>('LANDING');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [formData, setFormData] = useState<Submission>({
    text: '',
    name: '',
    email: '',
    igHandle: '',
    tiktokHandle: '',
  });
  const [discountPhone, setDiscountPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [showSampleChapter, setShowSampleChapter] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingPage, setReadingPage] = useState(1);

  const isValidDiscountPhone = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    if (countryCode === '+62') {
      return (clean.startsWith('08') && clean.length >= 10) || (clean.startsWith('8') && clean.length >= 9);
    }
    return clean.length >= 7;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return formData.name.trim().length > 1 && 
           isValidEmail(formData.email);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleDownloadCard = async () => {
    if (cardRef.current) {
      try {
        // Find the image and set crossOrigin ONLY for the capture duration
        const img = cardRef.current.querySelector('img');
        if (img) {
          img.crossOrigin = "anonymous";
        }

        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: '#FAF8F4',
          scale: 3, // High quality
          useCORS: true,
          logging: false,
        });

        // Clean up or keep as is if we don't mind the potential reload
        const link = document.createElement('a');
        link.download = `pesan-untuk-ayah-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Failed to export card', err);
      }
    }
  };

  const nextStep = (next: Step) => {
    if (next === 'LOADING') {
      // Pick card immediately to start pre-loading while user sees the loading bar
      const roll = Math.random();
      const prizeCard = PREDETERMINED_CARDS[PREDETERMINED_CARDS.length - 1];
      const standardCards = PREDETERMINED_CARDS.slice(0, -1);
      
      const url = roll < 0.05 
        ? prizeCard 
        : standardCards[Math.floor(Math.random() * standardCards.length)];
        
      setSelectedCard(url);
      
      setStep('LOADING');
      // Preload image manually to ensure it's ready
      const img = new Image();
      img.src = url;
      
      // Simulate processing time
      setTimeout(() => {
        setStep('SUCCESS');
      }, 2500);
      return;
    }
    if (next === 'SUCCESS') {
      if (!selectedCard) {
        const roll = Math.random();
        const prizeCard = PREDETERMINED_CARDS[PREDETERMINED_CARDS.length - 1];
        const standardCards = PREDETERMINED_CARDS.slice(0, -1);
        const url = roll < 0.05 
          ? prizeCard 
          : standardCards[Math.floor(Math.random() * standardCards.length)];
        setSelectedCard(url);
      }
    }
    if (next === 'LANDING') {
      setFormData({
        text: '',
        name: '',
        email: '',
        phone: '',
        igHandle: '',
        tiktokHandle: '',
      });
    }
    setStep(next);
  };

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

  // --- COMPONENTS ---

  const ProgressDots = ({ current }: { current: number }) => (
    <div className="flex justify-center gap-2 mb-6 mt-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full border-2 ${
            i === current ? 'bg-white border-white' : 'bg-transparent border-white/40'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-x-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778057561/stars_dlvhj3.svg" 
          className="absolute -left-[300px] -top-[100px] md:-left-[450px] md:-top-[200px] lg:-left-[400px] w-[800px] h-auto opacity-20 brightness-0 invert"
          alt=""
        />
        <img 
          src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778057561/stars_dlvhj3.svg" 
          className="absolute -right-[300px] -bottom-[100px] md:-right-[450px] md:-bottom-[200px] lg:-right-[400px] w-[800px] h-auto opacity-20 brightness-0 invert scale-x-[-1]"
          alt=""
        />
      </div>

      <main className="relative z-10 min-h-screen max-w-[600px] mx-auto px-4 pt-2 pb-6 md:px-12 flex flex-col font-sans selection:bg-brand-text selection:text-brand-bg">
      {/* PERSISTENT HEADER */}
      <div className="flex justify-center items-center mb-2">
        <img 
          src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778047461/apw-horizontal_draa4d.svg" 
          alt="Logo" 
          className="h-[70px] w-auto object-contain cursor-pointer brightness-0 invert"
          onClick={() => nextStep('LANDING')}
          referrerPolicy="no-referrer"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* SCREEN 1: LANDING */}
        {step === 'LANDING' && (
          <motion.div
            key="landing"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col items-center justify-center flex-1 text-center py-2"
          >
            <div className="flex flex-col items-center max-w-md">
              <div className="mb-12 mt-6">
                <h2 className="serif text-[42px] leading-[1.1] text-white">
                  Separuh Waktu<br />
                  <span className="serif text-[36px] opacity-90 pl-4">Sepenuh Hati.</span>
                </h2>
                <p className="text-[18px] text-white/90 mt-6 handwriting lowercase">
                  Tentang ayah yang hadir — meski tidak selalu utuh.
                </p>
              </div>
              
              <p className="text-[14px] text-white mb-1 leading-relaxed px-6 font-bold">
                Ribuan hal tersimpan antara anak dan ayah. Kami sedang mengumpulkannya.
              </p>
              <p className="text-[11px] text-white/80 mb-6 leading-relaxed px-6 italic">
                Kamu tidak harus mengirimnya. Kamu hanya perlu menuliskannya.
              </p>

              <h1 className="serif text-[32px] leading-tight mb-8 font-normal text-white">
                Pesan Tak Terkirim
              </h1>

              <div className="mb-6">
                <button
                  onClick={() => nextStep('WRITE')}
                  className="border-thin border-white text-white px-10 py-3 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 font-medium tracking-wide"
                >
                  Tulis milikmu →
                </button>
              </div>

              <p className="text-[12px] text-white/60 italic leading-relaxed font-sans px-4 w-full max-w-md mx-auto">
                Beberapa di antaranya akan kami kirimkan sesuatu —<br />
                sebagai tanda bahwa pesanmu sudah sampai.
              </p>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: WRITE */}
        {step === 'WRITE' && (
          <motion.div
            key="write"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1"
          >
            <ProgressDots current={1} />
            
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h2 className="serif text-2xl leading-snug mb-2 text-brand-text">
                Satu hal yang belum pernah kamu ucapkan ke ayahmu —
              </h2>
              <p className="text-[13px] text-brand-muted mb-8 italic">
                Bisa tentang apa saja. Tidak ada yang salah di sini.
              </p>
              
              <div className="relative">
                <textarea
                  autoFocus
                  placeholder="Tulis di sini..."
                  className="w-full bg-transparent border-b-thin border-brand-border focus:border-brand-text outline-none text-[18px] min-h-[160px] resize-none pb-4 transition-colors text-brand-text"
                  maxLength={280}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                />
                <div className="text-right mt-2">
                  <span className="text-[12px] text-brand-muted">
                    {formData.text.length} / 280
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto py-6 text-right">
              <button
                disabled={formData.text.length < 5}
                onClick={() => nextStep('COLLECTION')}
                className="border-thin border-brand-text px-10 py-3 text-[13px] rounded-full disabled:opacity-30 hover:bg-brand-text hover:text-brand-bg transition-all duration-300 font-medium"
              >
                Lanjut →
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: DATA COLLECTION */}
        {step === 'COLLECTION' && (
          <motion.div
            key="collection"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1"
          >
            <ProgressDots current={2} />
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h2 className="serif text-xl mb-2 text-brand-text">Hampir selesai.</h2>
              <p className="text-[13px] text-brand-muted mb-8 italic">
                Siapa nama kamu, dan ke mana kami bisa kabar kalau kamu menang sesuatu?
              </p>

              <div className="space-y-6">
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">NAMA *</label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    placeholder="Nama lengkap kamu"
                    className="bg-transparent border-b-thin border-brand-border focus:border-brand-text outline-none py-2 text-[14px] transition-colors text-brand-text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">EMAIL *</label>
                  <input
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    placeholder="Alamat email aktif"
                    className="bg-transparent border-b-thin border-brand-border focus:border-brand-text outline-none py-2 text-[14px] transition-colors text-brand-text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {!isValidEmail(formData.email) && formData.email.length > 0 && (
                    <span className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">Format email tidak valid</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="igHandle" className="text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">INSTAGRAM HANDLE</label>
                  <input
                    id="igHandle"
                    name="igHandle"
                    type="text"
                    placeholder="@username"
                    className="bg-transparent border-b-thin border-brand-border focus:border-brand-text outline-none py-2 text-[14px] transition-colors text-brand-text"
                    value={formData.igHandle}
                    onChange={(e) => setFormData({ ...formData, igHandle: e.target.value })}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="tiktokHandle" className="text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">TIKTOK HANDLE</label>
                  <input
                    id="tiktokHandle"
                    name="tiktokHandle"
                    type="text"
                    placeholder="@username"
                    className="bg-transparent border-b-thin border-brand-border focus:border-brand-text outline-none py-2 text-[14px] transition-colors text-brand-text"
                    value={formData.tiktokHandle}
                    onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center relative z-10">
              <p className="text-[11px] text-white italic handwriting lowercase">
                datamu aman bersama kami.
              </p>
              <button
                disabled={!isFormValid()}
                onClick={() => nextStep('LOADING')}
                className="bg-brand-text text-brand-bg px-10 py-3 text-[13px] rounded-full disabled:opacity-30 hover:opacity-90 transition-all duration-300 font-medium"
              >
                Kirim →
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3.5: LOADING */}
        {step === 'LOADING' && (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1 items-center justify-center py-24"
          >
            <div className="w-full max-w-[200px]">
              <div className="mb-6 text-center">
                <span className="text-[14px] handwriting text-white lowercase">menghimpun pesan —</span>
              </div>
              <div className="h-[1px] w-full bg-brand-border relative overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-brand-text w-1/3"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: SUCCESS + CARD */}
        {step === 'SUCCESS' && (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1 items-center text-center"
          >
            <h2 className="serif text-[26px] mb-2 leading-tight text-white">Sudah tersimpan.</h2>
            <p className="text-[14px] text-white/80 mb-8">Kata-katamu sekarang bagian dari arsip ini.</p>
            
            <div className="flex flex-col space-y-4 items-center w-full">
              <span className="text-[14px] handwriting text-white/90 w-full text-center lowercase">Ini milikmu</span>
              
              {/* THE CARD */}
              <div 
                ref={cardRef}
                className="w-full max-w-[320px] relative shadow-2xl"
              >
                <img 
                  src={selectedCard} 
                  alt="Shareable Card" 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 text-center w-full">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleDownloadCard}
                    className="border-thin border-white text-white py-3 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 font-medium"
                  >
                    Simpan card →
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t-[0.5px] border-white/20 mt-6 mb-4" />

            <div className="flex flex-col gap-4 pb-6 mt-4">
              <button
                onClick={() => nextStep('SOCIAL')}
                className="w-full text-center text-[13px] text-white hover:opacity-70 transition-opacity font-medium py-2"
              >
                Ikuti perjalanan kami →
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 5: ARCHIVE */}
        {step === 'ARCHIVE' && (
          <motion.div
            key="archive"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1"
          >
            <div className="pt-6">
              <span className="text-[14px] handwriting text-white/80 mb-2 block lowercase">Arsip —</span>
              <p className="text-[14px] text-white/90 mb-12">
                Ini adalah pesan-pesan yang tak terkirim. Ditulis oleh orang-orang seperti kamu.
              </p>
            </div>

            <div className="space-y-0">
              {[...ARCHIVE_SEEDS, { text: formData.text, city: "Kamu", age: "Now" }].filter(s => s.text).map((item, i) => (
                <div key={i} className="group">
                  <div className="py-10">
                    <p className="serif text-[18px] leading-relaxed italic mb-3 text-white">
                      "{item.text}"
                    </p>
                    <span className="text-[12px] text-white/70 tracking-tight font-sans">
                      {item.city} · {item.age}
                    </span>
                  </div>
                  {i < ARCHIVE_SEEDS.length && (
                    <hr className="border-t-[0.5px] border-white/20" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-20 pt-8 border-t-thin border-white/10 pb-20 text-center">
              <button
                onClick={() => nextStep('LANDING')}
                className="text-[13px] text-white/70 hover:text-white transition-colors font-medium"
              >
                Kembali ke Beranda →
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 6: SOCIAL MEDIA */}
        {step === 'SOCIAL' && (
          <motion.div
            key="social"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="flex flex-col flex-1 pt-12 md:pt-16 pb-12"
          >
            <div className="mb-8 text-center px-4">
              <h2 className="serif text-[32px] mb-4 leading-tight text-white">Cerita kita tidak berakhir di sini.</h2>

              {/* BOOK COVER IMAGE */}
              <div className="w-full max-w-[280px] mb-8 mx-auto shadow-2xl rounded-sm">
                <img 
                  src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778053561/apwbook_chr7lq.png" 
                  alt="Pesan Tak Terkirim" 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* NEW PRIMARY ACTIONS - PHONE NUMBER FOR 20% DISCOUNT & SAMPLE CHAPTER */}
              <div className="w-full max-w-[320px] mx-auto text-left mb-10">
                <p className="text-[14px] text-white mb-4 leading-relaxed text-center font-sans font-medium">
                  Masukkan nomor telepon Anda untuk mendapatkan diskon 20% dan akses membaca cuplikan buku.
                </p>
                <div className="flex flex-col mb-4">
                  <label htmlFor="discountPhone" className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-medium">Nomor Telepon *</label>
                  <div className="flex bg-white/5 border-b-thin border-white/20 focus-within:border-white focus-within:bg-white/10 rounded-lg overflow-hidden transition-all">
                    <div className="relative flex items-center bg-transparent border-r border-white/10 px-3 py-3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent text-white text-[14px] font-sans font-medium outline-none cursor-pointer appearance-none flex items-center gap-1 pr-6"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="+62" className="bg-zinc-950 text-white">🇮🇩 +62</option>
                        <option value="+60" className="bg-zinc-950 text-white">🇲🇾 +60</option>
                        <option value="+65" className="bg-zinc-950 text-white">🇸🇬 +65</option>
                        <option value="+61" className="bg-zinc-950 text-white">🇦🇺 +61</option>
                        <option value="+1" className="bg-zinc-950 text-white">🇺🇸 +1</option>
                      </select>
                      <div className="absolute right-2.5 pointer-events-none text-white/40 text-[10px]">
                        ▼
                      </div>
                    </div>
                    <input
                      id="discountPhone"
                      name="discountPhone"
                      type="tel"
                      placeholder={countryCode === '+62' ? "Contoh: 08123456789" : "812345678"}
                      className="bg-transparent outline-none px-4 py-3 text-[14px] transition-all text-white placeholder-white/30 tracking-wide font-sans flex-1"
                      value={discountPhone}
                      onChange={(e) => setDiscountPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-sans">
                      {!isValidDiscountPhone(discountPhone) 
                        ? (countryCode === '+62' 
                            ? "Menunggu nomor telepon valid (Starts 08 / 8, min 9-10 digit)" 
                            : "Menunggu nomor telepon valid (min 7 digit)")
                        : "Nomor telepon valid! Fitur terbuka"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    className="w-full bg-[#25D366] text-white py-4 rounded-full text-[13px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!isValidDiscountPhone(discountPhone)}
                    onClick={() => {
                      const message = `Halo Ayah Paruh Waktu! Saya ingin mengklaim Voucher Diskon 20% (PESANAPW20) untuk pembelian Buku Pesan Tak Terkirim. Nomor telepon saya: ${countryCode} ${discountPhone}`;
                      window.open(`https://wa.me/6281327558186?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.261 2.268 3.502 5.282 3.5 8.487-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.6 0 10.2-4.5 10.2-10.2c0-2.7-1.1-5.3-3-7.2-1.9-1.9-4.5-2.9-7.2-2.9-5.6 0-10.2 4.5-10.2 10.2 0 1.9.5 3.7 1.5 5.3l-.9 3.4 3.5-.9zM16.5 13.5c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.7-1.6-.9-2.1-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/>
                    </svg>
                    Klaim Voucher Diskon 20%
                  </button>

                  <button 
                    className="w-full bg-white text-brand-bg py-4 rounded-full text-[13px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!isValidDiscountPhone(discountPhone)}
                    onClick={() => {
                      window.open('https://drive.google.com/file/d/1qbHuIdaTqqMivk1g-DXOQsbC6e_BH40k/view?usp=sharing', '_blank');
                    }}
                  >
                    Baca Sample Chapter
                  </button>
                </div>
              </div>

              <div className="w-full h-[0.5px] bg-white opacity-20 mb-8"></div>

              <p className="text-[12px] text-white/80 mb-8 leading-relaxed italic text-center px-6">
                Ikuti terus perjalanan kami mengumpulkan pesan-pesan yang tak terkirim di platform media sosial.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  className="w-full border-thin border-white text-white px-8 py-4 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 text-left flex justify-between items-center group"
                  onClick={() => window.open('https://linktr.ee/ayahparuhwaktu', '_blank')}
                >
                  <span className="font-semibold tracking-[0.1em]">LINKTREE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  className="w-full border-thin border-white text-white px-8 py-4 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 text-left flex justify-between items-center group"
                  onClick={() => window.open('https://www.tiktok.com/@ayahparuhwaktu', '_blank')}
                >
                  <span className="font-semibold tracking-[0.1em]">TIKTOK</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button
                  className="w-full border-thin border-white text-white px-8 py-4 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 text-left flex justify-between items-center group"
                  onClick={() => window.open('https://instagram.com/ayahparuhwaktu', '_blank')}
                >
                  <span className="font-semibold tracking-[0.1em]">INSTAGRAM</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t-thin border-white/10 pb-12 text-center">
              <button
                onClick={() => nextStep('ARCHIVE')}
                className="text-[13px] text-white/70 hover:text-white transition-colors"
              >
                Lihat Arsip →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: CLAIM VOUCHER DISKON 20% */}
      <AnimatePresence>
        {showVoucherModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-bg/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-[400px] w-full text-center relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowVoucherModal(false);
                  setCopied(false);
                }}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-lg p-2 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h3 className="serif text-[24px] text-white mb-2 leading-tight">Diskon 20% Terbuka!</h3>
              <p className="text-[13px] text-white/70 mb-6 leading-relaxed">
                Gunakan kode voucher di bawah ini untuk mendapatkan potongan harga spesial 20% saat memesan Buku Pesan Tak Terkirim.
              </p>

              {/* Virtual Coupon */}
              <div className="border border-dashed border-white/20 bg-white/5 rounded-xl p-4 mb-6 relative overflow-hidden">
                <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Kode Voucher Anda</span>
                <span className="text-[20px] font-mono font-bold text-white tracking-widest block select-all">PESANAPW20</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('PESANAPW20');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-3 text-[11px] underline text-white/80 hover:text-white transition-all font-medium uppercase tracking-wider block mx-auto"
                >
                  {copied ? '✓ Kode Tersalin!' : 'Salin Kode Kupon'}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const phoneSuffix = discountPhone ? ` (${discountPhone})` : '';
                    const message = `Halo Ayah Paruh Waktu! Saya ingin mengklaim Voucher Diskon 20% (PESANAPW20) untuk pembelian Buku Pesan Tak Terkirim.${phoneSuffix ? ` Nomor telepon saya: ${phoneSuffix}` : ''}`;
                    window.open(`https://wa.me/6281327558186?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full bg-[#25D366] text-white py-4 rounded-full text-[13px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg"
                >
                  Klaim via WhatsApp →
                </button>
                <button
                  onClick={() => {
                    setShowVoucherModal(false);
                    setCopied(false);
                  }}
                  className="w-full py-3 text-[12px] text-white/50 hover:text-white/80 transition-colors uppercase tracking-wider font-medium"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: INLINE SAMPLE CHAPTER READER */}
      <AnimatePresence>
        {showSampleChapter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-bg/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-[600px] w-full text-left relative shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4 shrink-0">
                <div>
                  <h3 className="serif text-[20px] text-white">Sample Chapter: Pesan Tak Terkirim</h3>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest font-sans mt-0.5">Oleh Ayah Paruh Waktu</p>
                </div>
                <button 
                  onClick={() => {
                    setShowSampleChapter(false);
                    setReadingPage(1);
                  }}
                  className="text-white/60 hover:text-white text-lg p-2 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Digital Reader content pages */}
              <div className="flex-1 overflow-y-auto mb-6 pr-1 font-serif scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {readingPage === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h4 className="text-[20px] text-white text-center pb-4 border-b border-white/5 serif italic">
                      Bab I: Sunyi Antara Kita
                    </h4>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Di ujung malam yang sepi, draf pesan itu masih tersimpan utuh di sanubari. Puluhan kalimat bersahutan di kepalaku, tapi tak satu pun yang kuberanikan meluncur ke layar ponselmu. "Kapan pulang, Yah?" atau sekadar "Sehat selalu ya di sana." Antara anak dan ayah, ada ribuan hal yang terperangkap dalam genggaman bisu.
                    </p>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Kita dibesarkan oleh keheningan yang mengalir tanpa rekayasa. Aku mengingat cara Ayah duduk di teras, memandangi langit malam dengan kepulan asap rokok yang perlahan memudar. Tidak banyak kata yang diucapkan, namun dalam sunyi itu, aku mengerti bebannya begitu berat.
                    </p>
                  </motion.div>
                )}

                {readingPage === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h4 className="text-[20px] text-white text-center pb-4 border-b border-white/5 serif italic">
                      Bab II: Bahasa Isyarat Kasih Sayang
                    </h4>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Kita belajar menyayangi lewat isyarat. Dari deham tenang Ayah saat membaca koran, atau suara mesin motor yang sengaja dinyalakan lebih awal agar sekiranya aku terbangun bersiap sekolah. Kedekatan kita tidak diukur dengan kalimat cinta, tetapi dengan ruang hening yang saling menjaga.
                    </p>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Ketika aku terjatuh, Ayah tidak buru-buru memelukku. Beliau berdiri beberapa langkah, menatapku dengan mata yang berbicara: "Bangkit, anakku." Saat itu aku mengira Ayah dingin. Kini, ketika dunia menghantamku tanpa ampun, barulah aku paham arti ketangguhan yang ia tanamkan sejak dini.
                    </p>
                  </motion.div>
                )}

                {readingPage === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h4 className="text-[20px] text-white text-center pb-4 border-b border-white/5 serif italic">
                      Bab III: Rekonsiliasi Rasa
                    </h4>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Kini ketika aku tumbuh dewasa, aku mulai melihat gurat lelah yang sama pada bayanganku di cermin. Sifat keras kepala, ketidakmampuan mengungkapkan letupan duka, dan segala kebisuan ini... Ternyata aku perlahan-lahan sedang menyerupai sosok yang selama ini tak pernah sepenuhnya kupahami.
                    </p>
                    <p className="text-[15px] leading-relaxed text-white/90 text-justify">
                      Buku ini dikompilasi dari ribuan desah napas, draf-draf pesan whatsapp yang urung dikirim, dan surat-surat kertas yang menguning di dalam laci. Untukmu Ayah, dimanapun raga dan jiwamu kini bersandar, pesan-pesan ini akhirnya menemukan jalannya untuk terkirim.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Pagination controls & Open original PDF tab */}
              <div className="shrink-0 flex flex-col gap-4 border-t border-white/10 pt-4">
                <div className="flex justify-between items-center text-[12px]">
                  <button 
                    onClick={() => setReadingPage(prev => Math.max(1, prev - 1))}
                    disabled={readingPage === 1}
                    className="px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Sebelumnya
                  </button>
                  <span className="font-mono text-white/60">Halaman {readingPage} dari 3</span>
                  <button 
                    onClick={() => setReadingPage(prev => Math.min(3, prev + 1))}
                    disabled={readingPage === 3}
                    className="px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya →
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => window.open('https://res.cloudinary.com/dkhf63xbe/image/upload/v1778053561/apwbook_sample_chapter_t8f921.pdf', '_blank')}
                    className="flex-1 bg-white hover:bg-white/90 text-[#121212] py-3 rounded-full text-[12px] font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Buka PDF Asli (Tab Baru)
                  </button>
                  <button
                    onClick={() => {
                      setShowSampleChapter(false);
                      setReadingPage(1);
                    }}
                    className="sm:flex-none px-6 py-3 border border-white/20 text-white hover:bg-white/5 text-[12px] rounded-full uppercase tracking-wider font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
    </div>
  );
}
