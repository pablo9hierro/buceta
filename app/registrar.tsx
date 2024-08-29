// app/registrar.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from './api/supabase';

export default function Registrar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Registrar</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Registrar
      </button>
    </main>
  );
}
