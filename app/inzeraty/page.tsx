'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../supabase'
import { mesta, zoznamMiest } from '../mesta'

function InzeratyContent() {
  const searchParams = useSearchParams()
  const [inzeraty, setInzeraty] = useState<any[]>([])
  const [filter, setFilter] = useState('vsetky')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showFiltre, setShowFiltre] = useState(false)

  const [mesto, setMesto] = useState('vsetky')
  const [lokalita, setLokalita] = useState('vsetky')
  const [cenaMax, setCenaMax] = useState(1000)
  const [plochaMin, setPlochaMin] = useState(0)
  const [balkon, setBalkon] = useState('vsetky')

  const [spoluPohlavie, setSpoluPohlavie] = useState('vsetky')
  const [spoluStatus, setSpoluStatus] = useState('vsetky')
  const [spoluVekMin, setSpoluVekMin] = useState(18)
  const [spoluVekMax, setSpoluVekMax] = useState(99)

  useEffect(() => {
    const urlFilter = searchParams.get('filter')
    if (urlFilter) setFilter(urlFilter)
  }, [searchParams])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const zmenitMesto = (novemesto: string) => {
    setMesto(novemesto)
    setLokalita('vsetky')
  }

  const maAktivnyFilterSpolu = spoluPohlavie !== 'vsetky' || spoluStatus !== 'vsetky' || spoluVekMin > 18 || spoluVekMax < 99

  useEffect(() => {
    const fetchInzeraty = async () => {
      setLoading(true)

      let spoluIds: string[] | null = null
      if (maAktivnyFilterSpolu) {
        let spoluQuery = supabase.from('spoluobyvatelia').select('inzerat_id')
        if (spoluPohlavie !== 'vsetky') spoluQuery = spoluQuery.eq('pohlavie', spoluPohlavie)
        if (spoluStatus !== 'vsetky') spoluQuery = spoluQuery.eq('status', spoluStatus)
        spoluQuery = spoluQuery.gte('vek', spoluVekMin).lte('vek', spoluVekMax)

        const { data: spoluData } = await spoluQuery
        spoluIds = Array.from(new Set((spoluData || []).map(s => s.inzerat_id)))

        if (spoluIds.length === 0) {
          setInzeraty([])
          setLoading(false)
          return
        }
      }

      let query = supabase
        .from('inzeraty')
        .select('*, profiles(meno, fotka_url)')
        .order('created_at', { ascending: false })

      if (filter !== 'vsetky') query = query.eq('typ', filter)
      if (mesto !== 'vsetky') query = query.eq('mesto', mesto)
      if (lokalita !== 'vsetky') query = query.eq('lokalita', lokalita)
      if (balkon !== 'vsetky') query = query.eq('balkon', balkon)
      query = query.lte('cena', cenaMax)
      if (plochaMin > 0) query = query.gte('plocha_m2', plochaMin)
      if (spoluIds) query = query.in('id', spoluIds)

      const { data } = await query
      setInzeraty(data || [])
      setLoading(false)
    }
    fetchInzeraty()
  }, [filter, mesto, lokalita, cenaMax, plochaMin, balkon, spoluPohlavie, spoluStatus, spoluVekMin, spoluVekMax])

  const aktivnychFiltrov = [
    mesto !== 'vsetky', cenaMax < 1000, plochaMin > 0, balkon !== 'vsetky', maAktivnyFilterSpolu,
  ].filter(Boolean).length

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
            <h1 className="text-2xl font-bold text-gray-900">Inzeráty na Slovensku a v Česku</h1>
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
            ⚙ Filtre {aktivnychFiltrov > 0 && `(${aktivnychFiltrov})`}
          </button>
        </div>

        {showFiltre && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mesto</label>
                <select
                  value={mesto}
                  onChange={e => zmenitMesto(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
                >
                  <option value="vsetky">Všetky mestá</option>
                  {zoznamMiest.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Časť mesta</label>
                <select
                  value={lokalita}
                  onChange={e => setLokalita(e.target.value)}
                  disabled={mesto === 'vsetky'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="vsetky">Všetky časti</option>
                  {mesto !== 'vsetky' && mesta[mesto].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Minimálna plocha: {plochaMin} m²</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={plochaMin}
                  onChange={e => setPlochaMin(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Balkón</label>
              <select
                value={balkon}
                onChange={e => setBalkon(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              >
                <option value="vsetky">Nezáleží</option>
                <option value="vlastny">Vlastný balkón</option>
                <option value="spolocny">Spoločný balkón</option>
                <option value="bez">Bez balkónu</option>
              </select>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Spolubývajúci</p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Pohlavie</label>
                  <select
                    value={spoluPohlavie}
                    onChange={e => setSpoluPohlavie(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="vsetky">Nezáleží</option>
                    <option value="muz">Muž</option>
                    <option value="zena">Žena</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Status</label>
                  <select
                    value={spoluStatus}
                    onChange={e => setSpoluStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="vsetky">Nezáleží</option>
                    <option value="zamestnany">Zamestnaný</option>
                    <option value="student">Študent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Vek od: {spoluVekMin}</label>
                  <input
                    type="range"
                    min={18}
                    max={99}
                    value={spoluVekMin}
                    onChange={e => setSpoluVekMin(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Vek do: {spoluVekMax}</label>
                  <input
                    type="range"
                    min={18}
                    max={99}
                    value={spoluVekMax}
                    onChange={e => setSpoluVekMax(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
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
                  <span className="text-xs text-gray-400">{inzerat.lokalita}, {inzerat.mesto}</span>
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
                  {inzerat.profiles?.fotka_url ? (
                    <img src={inzerat.profiles.fotka_url} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                      {inzerat.profiles?.meno?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
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

export default function Inzeraty() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <InzeratyContent />
    </Suspense>
  )
}