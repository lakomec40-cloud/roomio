'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Spravy() {
  const [konverzacie, setKonverzacie] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: spravy } = await supabase
        .from('spravy')
        .select('*')
        .or(`od_user_id.eq.${user.id},pre_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!spravy) { setLoading(false); return }

      const partnerIds = new Set<string>()
      const poslednaSprava: Record<string, any> = {}

      for (const s of spravy) {
        const partnerId = s.od_user_id === user.id ? s.pre_user_id : s.od_user_id
        if (!partnerIds.has(partnerId)) {
          partnerIds.add(partnerId)
          poslednaSprava[partnerId] = s
        }
      }

      const ids = Array.from(partnerIds)
      const { data: profily } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids)

      const zoznam = ids.map(id => ({
        userId: id,
        profil: profily?.find(p => p.id === id),
        poslednaSprava: poslednaSprava[id],
      }))

      setKonverzacie(zoznam)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Späť na dashboard</a>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Správy</h1>

        {loading && <p className="text-gray-400 text-center py-12">Načítavam...</p>}

        {!loading && konverzacie.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">Zatiaľ žiadne konverzácie</p>
            <a href="/inzeraty" className="mt-4 inline-block text-indigo-600 text-sm hover:underline">Prezri si inzeráty →</a>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {konverzacie.map(k => (
            <a key={k.userId} href={"/spravy/" + k.userId} className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-600 flex-shrink-0">
                  {k.profil?.meno?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{k.profil?.meno || 'Anonymný užívateľ'}</p>
                  <p className="text-sm text-gray-400 truncate">{k.poslednaSprava?.obsah}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}