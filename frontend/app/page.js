'use client';

import { useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';

// Configuração básica do Firebase (o emulador só precisa do projectId)
const firebaseConfig = {
  projectId: "ailab6-98ea2",
};

// Evita inicializar o Firebase múltiplas vezes no Next.js (Hot Reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Liga ao Emulador se a flag de ambiente for verdadeira
if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } catch (error) {
    // Ignora erro se já estiver ligado
  }
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

        if (dataSource === 'firestore') {
          // Busca os dados no Firestore (Emulador ou Nuvem)
          const querySnapshot = await getDocs(collection(db, "items"));
          const itemsList = querySnapshot.docs.map(doc => doc.id); // Usamos o ID do documento como nome do item
          
          setData({
            status: "ok (Firestore)",
            items: itemsList.length > 0 ? itemsList : ["Nenhum item encontrado no banco de dados ainda."]
          });
        } else {
          // Mantém a lógica antiga caso a fonte não seja 'firestore'
          const res = await fetch('/api/health/');
          if (!res.ok) throw new Error('Falha ao ligar ao backend!');
          const apiData = await res.json();
          setData(apiData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Painel de Controle - DevOps App (Versão B)</h1>
      
      {loading && <p>Carregando dados...</p>}
      
      {error && (
        <p style={{ color: 'red' }}>
          <strong>Erro:</strong> {error}
        </p>
      )}

      {data && (
        <div>
          <p>
            <strong>Status da API:</strong>{' '}
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              {data.status}
            </span>
          </p>
          <h3>Tarefas do Desafio:</h3>
          <ul>
            {data.items?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}