'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../supabase'

export default function Inzeraty() {
  const searchParams = useSearchParams()
  const [inzeraty, setInzeraty] = useState<any[]>([])
  const [filter, setFilter] = useState('vsetky')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showFiltre, setShowFiltre] = useState(false)
  const [lokalita, setLokalita] = useState('vsetky')
  const [cenaMax, setCenaMax] = useState(1000)

  useEffect(() => {
    const urlFilter = searchParams.get('filter')
    if (urlFilter) setFilter(urlFilter)
  }, [searchParams])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  useEffect(() => {
    const fetchInzeraty = async () => {
      setLoading(true)
      let query = supabase
        .from('inzeraty')
        .select('*, profiles(meno, fotka_url)')
        .order('created_at', { ascending: false })

      if (filter !== 'vsetky') {
        query = query.eq('typ', filter)
      }
      if (lokalita !== 'vsetky') {
        query = query.eq('lokalita', lokalita)
      }
      query = query.lte('cena', cenaMax)

      const { data } = await query
      setInzeraty(data || [])
      setLoading(false)
    }
    fetchInzeraty()
  }, [filter, lokalita, cenaMax])

  const lokality = ['vsetky', 'Staré Mesto', 'Ružinov', 'Petržalka', 'Nové Mesto', 'Dúbravka', 'Karlova Ves', 'Rača', 'Vajnory', 'Košice', 'Brno', 'Praha']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <div className="flex items-center gap-3">
          {user ? (
            <a href="/dashboard" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Môj účet</a>
          ) : (
            <>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Prihlásiť sa</a>
              <a href="/register" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Registrovať sa</a>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inzeráty na Slovensku</h1>
            <p className="text-sm text-gray-400 mt-1">{inzeraty.length} inzerátov</p>
          </div>
          <a href="/inzerat/novy" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            + Pridať inzerát
          </a>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { key: 'vsetky', label: 'Všetky' },
            { key: 'hladam', label: 'Hľadám izbu' },
            { key: 'ponukam', label: 'Ponúkam izbu' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.key ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setShowFiltre(!showFiltre)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${showFiltre ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'}`}
          >
            ⚙ Filtre {(lokalita !== 'vsetky' || cenaMax < 1000) && '•'}
          </button>
        </div>

        {showFiltre && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Lokalita</label>
              <select
                value={lokalita}
                onChange={e => setLokalita(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              >
                {lokality.map(l => <option key={l} value={l}>{l === 'vsetky' ? 'Všetky lokality' : l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Maximálna cena: {cenaMax} €</label>
              <input
                type="range"
                min={50}
                max={1000}
                step={10}
                value={cenaMax}
                onChange={e => setCenaMax(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && inzeraty.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">🏠</p>
            <p className="text-gray-500 font-medium">Žiadne inzeráty nezodpovedajú filtru</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5">
          {inzeraty.map(inzerat => (
            <a key={inzerat.id} href={"/inzerat/" + inzerat.id} className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all">
              {inzerat.fotky && inzerat.fotky[0] ? (
                <img src={inzerat.fotky[0]} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-3xl">🏠</div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inzerat.typ === 'hladam' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {inzerat.typ === 'hladam' ? 'Hľadám' : 'Ponúkam'}
                  </span>
                  <span className="text-xs text-gray-400">{inzerat.lokalita}</span>
                </div>
                <h2 className="font-semibold text-gray-900 mb-1 truncate">{inzerat.nazov}</h2>
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">{inzerat.popis}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-indigo-600">{inzerat.cena} €</span>
                    <span className="text-xs text-gray-400">/mes</span>
                  </div>
                  {inzerat.plocha_m2 && (
                    <span className="text-xs text-gray-400">{inzerat.plocha_m2} m²</span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                    {inzerat.profiles?.meno?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-gray-400 truncate">{inzerat.profiles?.meno || 'Anonymný užívateľ'}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}