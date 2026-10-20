'use client';

import { useState } from 'react';

export default function ProductVariantPicker({ variants = ['Original', 'Pedas', 'Manis'] }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4 p-4 border rounded">
      <div>
        <label className="block font-medium mb-1">Pilih Varian:</label>
        <div className="flex gap-2">
          {variants.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setSelectedVariant(v)}
              className={`px-3 py-1 rounded border ${
                selectedVariant === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Jumlah:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 bg-gray-200 rounded font-bold"
          >
            -
          </button>
          <span className="font-semibold px-2">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 bg-gray-200 rounded font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}