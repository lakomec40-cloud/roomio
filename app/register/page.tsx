'use client'
import { useState } from 'react'
import { supabase } from '../supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [meno, setMeno] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        meno,
        mesto: 'Bratislava',
      })
      setMessage('Skontroluj email a potvrď registráciu!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-10 border border-gray-100 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registrácia</h1>
        <p className="text-gray-500 mb-8">Vytvor si účet na Roomio</p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Meno"
            value={meno}
            onChange={e => setMeno(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
          />
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Registrujem...' : 'Registrovať sa'}
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-indigo-600">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Už máš účet?{' '}
          <a href="/login" className="text-indigo-600 font-medium">Prihlásiť sa</a>
        </p>
      </div>
    </div>
  )
}