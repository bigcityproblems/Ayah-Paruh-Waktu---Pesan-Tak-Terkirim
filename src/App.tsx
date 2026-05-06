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
  "https://i.imgur.com/g5h5GPo.png",
  "https://i.imgur.com/LusXz2Q.png",
  "https://i.imgur.com/ofwuItm.png",
  "https://i.imgur.com/W5QhTaV.png",
  "https://i.imgur.com/jwCs2GW.png",
  "https://i.imgur.com/nJSJIXs.png",
  "https://i.imgur.com/4YNml8n.png",
  "https://i.imgur.com/RrAOMCi.png",
  "https://i.imgur.com/40L63Vk.png",
  "https://i.imgur.com/IjFokz1.png",
  "https://i.imgur.com/c98euJS.png",
  "https://i.imgur.com/GWff4TU.png",
  "https://i.imgur.com/f3BqlPu.png",
  "https://i.imgur.com/Zwoz2ZB.png",
  "https://i.imgur.com/TfiUw1C.png",
  "https://i.imgur.com/Ml4wgpM.png",
  "https://i.imgur.com/0l8k2oG.png",
  "https://i.imgur.com/3iFDhUs.png",
  "https://i.imgur.com/FvVO2To.png",
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
      const randomIndex = Math.floor(Math.random() * PREDETERMINED_CARDS.length);
      const url = PREDETERMINED_CARDS[randomIndex];
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
        const randomIndex = Math.floor(Math.random() * PREDETERMINED_CARDS.length);
        setSelectedCard(PREDETERMINED_CARDS[randomIndex]);
      }
    }
    if (next === 'LANDING') {
      setFormData({
        text: '',
        name: '',
        email: '',
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
          className="absolute -left-[600px] -top-[150px] md:-left-[450px] md:-top-[200px] lg:-left-[400px] w-[800px] h-auto opacity-30 brightness-0 invert"
          alt=""
        />
        <img 
          src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778057561/stars_dlvhj3.svg" 
          className="absolute -right-[600px] -bottom-[150px] md:-right-[450px] md:-bottom-[200px] lg:-right-[400px] w-[800px] h-auto opacity-30 brightness-0 invert scale-x-[-1]"
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
              <div className="w-full max-w-[192px] mb-4 mx-auto">
                <img 
                  src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778050290/apwhug_txmpek.svg" 
                  alt="Feature Visual" 
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[14px] handwriting text-white/80 mb-1 lowercase">
                Sebuah Arsip —
              </span>
              <h1 className="serif text-[38px] leading-tight mb-3 font-normal text-brand-text">
                Pesan Tak Terkirim
              </h1>
              <p className="text-[15px] text-white/90 mb-4 leading-relaxed">
                Ribuan hal tersimpan antara anak dan ayah. Kami sedang mengumpulkannya.
              </p>
              <div className="w-12 border-t-thin border-white/30 mb-4"></div>
              <p className="text-[12px] text-white/80 italic mb-6 leading-relaxed font-sans">
                Beberapa di antaranya akan kami kirimkan sesuatu —<br />
                sebagai tanda bahwa pesanmu sudah sampai.
              </p>
              <div>
                <button
                  onClick={() => nextStep('WRITE')}
                  className="border-thin border-white text-white px-10 py-3 text-[13px] rounded-full hover:bg-white hover:text-brand-bg transition-all duration-300 font-medium tracking-wide"
                >
                  Tulis milikmu →
                </button>
              </div>
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
                <span className="text-[14px] handwriting text-brand-muted lowercase">menghimpun pesan —</span>
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
                className="aspect-[4/5] w-full max-w-[320px] relative overflow-hidden rounded-lg shadow-2xl"
              >
                <img 
                  src={selectedCard} 
                  alt="Shareable Card" 
                  className="w-full h-full object-cover"
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
              <p className="text-[17px] handwriting text-white mb-2 leading-relaxed lowercase">
                Bagaimana kalau ayahmu juga punya pesan yang tak terkirim?
              </p>
              <p className="text-[14px] font-sans text-white/90 mb-8 leading-relaxed mx-auto max-w-[400px]">
                Buku ini ditulis untuk menjawab pertanyaan yang jarang berani kita tanyakan.
              </p>

              {/* BOOK COVER IMAGE */}
              <div className="w-full max-w-[280px] mb-8 mx-auto shadow-2xl rounded-sm">
                <img 
                  src="https://res.cloudinary.com/dkhf63xbe/image/upload/v1778053561/apwbook_chr7lq.png" 
                  alt="Pesan Tak Terkirim" 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* PRIMARY ACTIONS */}
              <div className="flex flex-col gap-3 mb-10 w-full max-w-[320px] mx-auto">
                <button 
                  className="w-full bg-white text-brand-bg py-4 rounded-full text-[13px] font-bold tracking-widest uppercase hover:bg-white/90 transition-all shadow-lg"
                  onClick={() => window.open('https://linktr.ee/ayahparuhwaktu', '_blank')}
                >
                  Wishlist Buku →
                </button>
                <button 
                  className="w-full bg-[#25D366] text-white py-4 rounded-full text-[13px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg"
                  onClick={() => window.open('https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20klaim%20voucher%20diskon%20buku%20Pesan%20Tak%20Terkirim', '_blank')}
                >
                  Voucher Discount (WA) →
                </button>
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
      </main>
    </div>
  );
}
