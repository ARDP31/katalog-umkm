"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

const kategoriUmum = [
  "Minuman",
  "Camilan",
  "Bumbu",
  "Kue kering",
  "Kerajinan",
  "Kain",
];

export default function FormProduk({ produk = {}, action, labelTombol }) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-xl border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      {produk.id && <input type="hidden" name="id" value={produk.id} />}
      {produk.foto_url && <input type="hidden" name="foto_lama" value={produk.foto_url} />}

      <Input label="Nama produk" name="nama" defaultValue={produk.nama || ""} required />

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga ?? ""}
        required
      />

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Kategori
        <input
          name="kategori"
          list="daftar-kategori"
          defaultValue={produk.kategori || ""}
          placeholder="Pilih atau ketik kategori..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          required
        />
        <datalist id="daftar-kategori">
          {kategoriUmum.map((kat) => (
            <option key={kat} value={kat} />
          ))}
        </datalist>
      </label>

      {produk.foto_url && (
        <div className="flex items-center gap-3 rounded-xl border border-garis bg-permukaan p-3">
          <img
            src={produk.foto_url}
            alt="Foto produk saat ini"
            className="h-12 w-12 rounded-lg object-cover bg-latar"
          />
          <div className="text-xs text-teks-lembut">
            <span className="font-semibold text-teks block">Foto saat ini</span>
            Upload file baru atau masukkan link baru jika ingin mengganti gambar.
          </div>
        </div>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Upload gambar {produk.foto_url ? "baru (opsional)" : "(opsional)"}
        <input
          type="file"
          name="foto_file"
          accept="image/*"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks file:mr-3 file:rounded-md file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teks hover:file:bg-garis"
        />
      </label>

      <Input
        label="Atau link foto (opsional)"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url || ""}
      />

      <Input label="Deskripsi" name="deskripsi" textarea defaultValue={produk.deskripsi || ""} />

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
