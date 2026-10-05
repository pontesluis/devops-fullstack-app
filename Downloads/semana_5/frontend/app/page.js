'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/health/')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao ligar ao backend');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Painel de Controle - DevOps App</h1>
      
      {loading && <p>Carregando dados do backend...</p>}
      
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