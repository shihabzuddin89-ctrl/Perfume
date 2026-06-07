import { Sparkles, ShieldCheck, Zap, Droplet, Award, Star } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] pt-8 pb-16 lg:pt-10 lg:pb-20 text-zinc-900 border-b border-zinc-200">
      {/* Exquisite minimal grid vector overlay & clean geometric layouts */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-30 pointer-events-none" />
      <div className="absolute -top-12 right-1/4 h-[400px] w-[400px] rounded-full bg-zinc-200/40 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-16 left-1/12 h-[300px] w-[300px] rounded-full bg-zinc-200/30 blur-3xl opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 text-left">
          
          {/* Left panel: Ultra Polished Brand Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.12] leading-tight"
              >
                The Art of <br />
                <span className="font-serif italic font-light text-zinc-500 block sm:inline">Fragrance Decanting</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-650 font-sans"
              >
                Experience the globe's finest niche masterpiece perfumes without committing to full multi-thousand Taka retail bottles. Utilizing hospital-clean ISO sterile air-lock pump extraction, we decant imports of Creed, Tom Ford, Chanel, and Dior into premium, glass-clasped atomizers.
              </motion.p>
            </div>

            {/* Quick trust metrics row - Styled with high class minimalist boxes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 pt-2 max-w-lg"
            >
              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between hover:border-zinc-900 transition-all shadow-sm">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">01. CERTIFIED</span>
                <div className="mt-2.5">
                  <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-widest font-sans flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-950 shrink-0" />
                    Double Tags
                  </h4>
                  <p className="text-[9.5px] text-zinc-550 mt-1 leading-snug font-sans">Original batch barcode matching guaranteed.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between hover:border-zinc-900 transition-all shadow-sm">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">02. STERILE</span>
                <div className="mt-2.5">
                  <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-widest font-sans flex items-center gap-1">
                    <Droplet className="h-3.5 w-3.5 text-zinc-950 shrink-0" />
                    Zero Loss
                  </h4>
                  <p className="text-[9.5px] text-zinc-550 mt-1 leading-snug font-sans">100% sterile vacuum syringes. Zero air exposure.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between hover:border-zinc-900 transition-all shadow-sm">
                <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider">03. EXPRESS</span>
                <div className="mt-2.5">
                  <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-widest font-sans flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-zinc-950 shrink-0" />
                    Secure Cash
                  </h4>
                  <p className="text-[9.5px] text-zinc-550 mt-1 leading-snug font-sans">Cash on delivery. Inspect contents at doorstep.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right panel: Exquisite interactive spotlight showcase with Chanel-style minimal aesthetics */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full max-w-sm rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl overflow-hidden self-center group"
            >
              {/* High end top border black line accent */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-zinc-950" />
              
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-zinc-950" />
                    <span className="font-mono text-[9px] font-bold tracking-widest text-zinc-950 uppercase">
                      Curated Spotlight
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold text-white bg-zinc-950 px-2 py-0.5 rounded tracking-wider">
                    BEST SELLER
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="relative overflow-hidden rounded-xl bg-zinc-50 h-24 w-24 border border-zinc-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=200"
                      alt="Rouge 540 Extra"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="font-mono text-[8px] font-extrabold uppercase tracking-[0.25em] text-zinc-400 block mb-0.5">
                      Maison Francis Kurkdjian
                    </span>
                    <h4 className="font-serif text-lg font-bold leading-tight text-zinc-950 truncate">
                      Baccarat Rouge 540
                    </h4>
                    <span className="text-[10.5px] font-sans text-zinc-500 block mt-1 leading-snug font-light">
                      Sensual ambergris fusion, blooming rich Moroccan jasmine, and freshly toasted sweet cedarwood.
                    </span>
                  </div>
                </div>

                {/* Scent structure analysis bars (Pristine Grey-Scale look) */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-left space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] font-bold tracking-widest text-zinc-500 uppercase block">
                      Accords analysis
                    </span>
                    <div className="flex items-center text-zinc-950 gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-zinc-950 text-zinc-950" />
                      <span className="text-[9px] text-zinc-950 font-bold">4.9 (95 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2 font-sans">
                    <div>
                      <div className="flex justify-between text-[9px] text-zinc-600 font-medium">
                        <span>Sandalwood & Saffron (Top)</span>
                        <span className="text-zinc-950 font-bold">92%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden mt-0.5">
                        <div className="bg-zinc-950 h-full rounded-full" style={{ width: "92%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] text-zinc-600 font-medium">
                        <span>Warm Cedar sillage (Longevity)</span>
                        <span className="text-zinc-950 font-bold">87%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden mt-0.5">
                        <div className="bg-zinc-800 h-full rounded-full" style={{ width: "87%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decant Specimen Label */}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-200 mt-2 font-sans">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block">Specimen Price</span>
                    <p className="text-base font-extrabold text-zinc-950 mt-0.5">
                      ৳ 1,850 <span className="text-[10px] font-normal text-zinc-500">/ 5ml sample</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-950 font-bold block">10ml Premium size</span>
                    <p className="text-[11px] text-zinc-600 font-medium font-sans">৳ 3,500 <span className="text-[9.5px] text-emerald-600 font-semibold block">In Stock • Save ৳200</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
