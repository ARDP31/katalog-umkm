'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('search', term);
    else params.delete('search');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }

  function handleCategory(category) {
    const params = new URLSearchParams(searchParams);
    if (category) params.set('category', category);
    else params.delete('category');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        type="text"
        placeholder="Cari produk..."
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        defaultValue={searchParams.get('category') || ''}
        onChange={(e) => handleCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Semua Kategori</option>
        <option value="makanan">Makanan</option>
        <option value="minuman">Minuman</option>
        <option value="kerajinan">Kerajinan</option>
      </select>
    </div>
  );
}