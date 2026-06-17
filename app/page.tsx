'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <span className="text-xl font-bold text-indigo-600">Roomio</span>
        <div className="flex items-center gap-3">
          <a href="/inzeraty" className="text-sm text-gray-600 hover:text-gray-900">Inzeráty</a>
          {user ? (
            <a href="/dashboard" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Môj účet
            </a>
          ) : (
            <>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Prihlásiť sa</a>
              <a href="/register" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Registrovať sa
              </a>
            </>
          )}
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full mb-6">
          Nová platforma pre spolubývanie
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Nájdi izbu.<br />
          <span className="text-indigo-600">Vyber si spolubývajúcich.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Vidíš profily všetkých v byte, ich vek, povolanie aj životný štýl. Žiadne prekvapenia.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/inzeraty?filter=ponukam" className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-base font-medium hover:bg-indigo-700 transition-colors">
            Hľadám izbu
          </a>
          <a href="/inzerat/novy" className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors">
            Pridať inzerát
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-indigo-600 text-lg">👤</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Profily spolubývajúcich</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Pred kontaktom vidíš vek, povolanie a krátke bio každého v byte.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-indigo-600 text-lg">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Filtre podľa teba</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Filtruj podľa mesta, ceny, veľkosti izby aj životného štýlu spolubývajúcich.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-indigo-600 text-lg">💬</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Priama komunikácia</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Napíš správu priamo cez platformu.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between flex-wrap gap-6">
          <p className="text-gray-400 text-sm">© 2025 Roomio. Platforma pre spolubývanie.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/inzeraty" className="hover:text-gray-600">Inzeráty</a>
            <a href="/register" className="hover:text-gray-600">Registrácia</a>
          </div>
        </div>
      </section>
    </div>
  )
}