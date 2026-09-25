'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Store, List, CheckCircle, Camera, Receipt } from 'lucide-react'
import { GlassButton } from '@/shared/components/ui/glass-button'

export default function NewsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const pointVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section id="berita" className="relative py-24 w-full bg-gradient-to-b from-[#0F1419] to-[#1a1f2e] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#4B7BFF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="w-full max-w-sm flex flex-col items-center">
              {/* Phone Frame */}
              <div className="w-full bg-[#1f2534] rounded-[1.5rem] border border-white/[0.06] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="w-full h-8 flex justify-between items-center mb-4 px-2">
                  <div className="text-[#6B7280] text-xs font-mono tabular-nums">09:41</div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#4B7BFF]/40"></div>
                    <div className="w-3 h-3 rounded-full bg-[#4B7BFF]/40"></div>
                  </div>
                </div>
                
                {/* Receipt Scanning Area */}
                <div className="relative w-full h-64 bg-[#0F1419] rounded-xl border border-[#4B7BFF]/15 flex flex-col items-center justify-center overflow-hidden mb-6">
                  <Receipt className="w-16 h-16 text-[#4B7BFF]/30 mb-4" />
                  <div className="text-[#6B7280] text-sm font-medium">Memindai Struk...</div>
                  
                  {/* Scanner Line */}
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-0.5 bg-[#4B7BFF] shadow-[0_0_12px_#4B7BFF]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#4B7BFF]/20 to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  />
                </div>

                {/* Extracted Data Points */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col gap-3"
                >
                  <motion.div variants={pointVariants} className="flex items-center gap-3 p-3 bg-[#1f2534] rounded-lg border border-[#4B7BFF]/15 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                    <div className="p-2 bg-[#2A9D8F]/15 text-[#2A9D8F] border border-[#2A9D8F]/30 rounded-md">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#6B7280] text-xs">Toko</span>
                      <span className="text-white font-medium text-sm">Alfamart</span>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={pointVariants} className="flex items-center gap-3 p-3 bg-[#1f2534] rounded-lg border border-[#4B7BFF]/15 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                    <div className="p-2 bg-[#4B7BFF]/15 text-[#4B7BFF] border border-[#4B7BFF]/30 rounded-md">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#6B7280] text-xs">Total</span>
                      <span className="text-white font-medium text-sm font-mono tabular-nums">Rp 45.500</span>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={pointVariants} className="flex items-center gap-3 p-3 bg-[#1f2534] rounded-lg border border-[#4B7BFF]/15 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                    <div className="p-2 bg-[#E8A76F]/15 text-[#E8A76F] border border-[#E8A76F]/30 rounded-md">
                      <List className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#6B7280] text-xs">Items</span>
                      <span className="text-white font-medium text-sm tabular-nums font-mono">3</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-jakarta">
              Scan Struk, Langsung Tercatat
            </h2>
            
            <p className="text-lg text-[#9CA3AF] mb-10 max-w-[65ch] leading-relaxed font-jakarta">
              Foto struk belanjamu dari manapun. AI FINUSA akan memindai toko, item, harga, dan total — lalu mencatatnya otomatis ke pembukuanmu. Tidak perlu input manual lagi.
            </p>

            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4B7BFF]/15 text-[#4B7BFF] border border-white/[0.06] rounded-xl shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg">Deteksi otomatis toko & tanggal</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4B7BFF]/15 text-[#4B7BFF] border border-white/[0.06] rounded-xl shrink-0">
                  <List className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg">Ekstrak item dan harga satu per satu</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4B7BFF]/15 text-[#4B7BFF] border border-white/[0.06] rounded-xl shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg">Langsung tersimpan ke Catat</h3>
              </div>
            </div>

            <div className="flex">
              <Link href="/receipt-scanner">
                <GlassButton variant="default" className="gap-2">
                  <Camera className="w-5 h-5" />
                  Coba Scan Struk
                </GlassButton>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export { NewsSection }
