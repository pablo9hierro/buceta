"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../api/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');  // Redireciona para a página de dashboard após login
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"  // Adicionada a classe text-black
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"  // Adicionada a classe text-black
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Entrar
      </button>
    </main>
  );
}
