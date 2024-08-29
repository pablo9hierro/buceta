"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../api/supabase';

export default function Registrar() {
  const [name, setName] = useState(''); // Novo estado para o nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); // Novo estado para o endereço
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Inserir dados na tabela user_metadata
      const { error: metadataError } = await supabase
        .from('user_metadata')
        .insert({
          id: data.user?.id, // Referência ao ID do usuário na tabela 'users'
          name: name, // Nome do usuário
          email: email, // Email do usuário
          address: address, // Endereço do usuário
        });

      if (metadataError) {
        setError(metadataError.message);
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Registrar</h1>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"
      />
      <input
        type="text"
        placeholder="Endereço"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded text-black"
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
