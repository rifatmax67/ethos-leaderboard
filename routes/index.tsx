// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";

interface User {
  twitterHandle: string;
  earnings: number;
  vouches: number;
}

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const search = url.searchParams.get("q")?.toLowerCase();
    const res = await fetch("https://api.ethos.network/v1/users/leaderboard");
    const data: User[] = await res.json();

    const filtered = search
      ? data.filter((u) => u.twitterHandle.toLowerCase().includes(search))
      : data;

    return ctx.render(filtered);
  },
};

export default function Home({ data }: PageProps<User[]>) {
  return (
    <div class="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-4xl font-extrabold text-blue-600 dark:text-blue-400 animate-fade-in">
          🚀 Top $ETHOS Earners
        </h1>
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
          class="px-4 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Toggle Dark Mode
        </button>
      </div>

      <form method="GET" class="mb-6 flex justify-center">
        <input
          type="text"
          name="q"
          placeholder="Search Twitter handle..."
          class="border border-gray-300 dark:border-gray-700 p-3 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white dark:bg-gray-800 text-black dark:text-white"
        />
      </form>

      <ul class="space-y-4 animate-fade-in">
        {data.map((user, index) => (
          <li class="p-4 border dark:border-gray-700 rounded shadow-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200">
            <div class="flex items-center justify-between">
              <div class="text-lg font-semibold dark:text-white">
                🏅 Rank #{index + 1}: @{user.twitterHandle}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                📢 {user.vouches} Vouches
              </div>
            </div>
            <div class="mt-2 text-gray-700 dark:text-gray-300">
              💰 <span class="font-medium">Earnings:</span> {user.earnings.toFixed(2)} $ETHOS
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
