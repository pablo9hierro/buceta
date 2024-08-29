// app/page.tsx
"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/registrar');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Sistema de Relatórios</h1>
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Cadastrar
      </button>
    </main>
  );
}
