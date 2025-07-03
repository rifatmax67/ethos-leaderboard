import { useEffect, useState } from 'react';

type Kol = {
  author_name: string;
  score: number;
  twitter_id: string;
};

export default function Home() {
  const [kols, setKols] = useState<Kol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setKols(data?.data?.slice(0, 100) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">🔥 ETHOSNETWORK Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {kols.map((kol, i) => (
            <li
              key={kol.twitter_id}
              className="bg-gray-800 p-4 rounded-lg shadow flex justify-between"
            >
              <span>
                #{i + 1} - {kol.author_name}
              </span>
              <span className="text-green-400 font-semibold">{kol.score}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
