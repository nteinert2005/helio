'use client'

import { useRouter } from 'next/navigation'
import { Scale, Utensils, Activity, Stethoscope, X } from 'lucide-react'

export default function QuickLogDrawer({ isOpen, onClose }) {
  const router = useRouter()

  const handleAction = (path) => {
    router.push(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="bg-helio-obsidian/95 backdrop-blur-xl border-t border-helio-ash-divider rounded-t-3xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-helio-ash-divider/50">
            <h3 className="text-lg font-semibold text-helio-bone">Quick Log</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-helio-ash-divider transition-colors"
            >
              <X className="w-5 h-5 text-helio-muted-titanium" />
            </button>
          </div>

          {/* 2x2 Grid */}
          <div className="p-6 pb-8">
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* Weight Button */}
              <button
                onClick={() => handleAction('/quick-log/weight')}
                className="bg-helio-obsidian border border-helio-ash-divider rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-helio-ash-divider/30 hover:border-helio-solar-ember/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-xl bg-helio-solar-ember/10 flex items-center justify-center">
                  <Scale className="w-7 h-7 text-helio-solar-ember" />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium text-helio-bone">Weight</div>
                  <div className="text-xs text-helio-muted-titanium mt-1">Log today's weight</div>
                </div>
              </button>

              {/* Food Button */}
              <button
                onClick={() => handleAction('/quick-log/food')}
                className="bg-helio-obsidian border border-helio-ash-divider rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-helio-ash-divider/30 hover:border-helio-solar-ember/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-xl bg-helio-solar-ember/10 flex items-center justify-center">
                  <Utensils className="w-7 h-7 text-helio-solar-ember" />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium text-helio-bone">Food</div>
                  <div className="text-xs text-helio-muted-titanium mt-1">Track calories</div>
                </div>
              </button>

              {/* Exercise Button */}
              <button
                onClick={() => handleAction('/quick-log/exercise')}
                className="bg-helio-obsidian border border-helio-ash-divider rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-helio-ash-divider/30 hover:border-helio-solar-ember/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-xl bg-helio-solar-ember/10 flex items-center justify-center">
                  <Activity className="w-7 h-7 text-helio-solar-ember" />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium text-helio-bone">Exercise</div>
                  <div className="text-xs text-helio-muted-titanium mt-1">Log activity</div>
                </div>
              </button>

              {/* Symptoms Button */}
              <button
                onClick={() => handleAction('/quick-log/symptoms')}
                className="bg-helio-obsidian border border-helio-ash-divider rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-helio-ash-divider/30 hover:border-helio-solar-ember/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-xl bg-helio-solar-ember/10 flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-helio-solar-ember" />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium text-helio-bone">Symptoms</div>
                  <div className="text-xs text-helio-muted-titanium mt-1">Track symptoms</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
