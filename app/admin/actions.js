"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/session";

export async function login(arg1, arg2) {
  let formData = null;
  if (arg2 instanceof FormData) {
    formData = arg2;
  } else if (arg1 instanceof FormData) {
    formData = arg1;
  } else if (arg2 && typeof arg2.get === "function") {
    formData = arg2;
  } else if (arg1 && typeof arg1.get === "function") {
    formData = arg1;
  }

  const email = String(formData?.get?.("email") || "").trim();
  const password = String(formData?.get?.("password") || "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials" || error.message?.includes("Invalid login credentials")) {
      return { error: "Email atau password salah. Periksa kembali akun Anda." };
    }
    return { error: error.message || "Gagal masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function loginAction(arg1, arg2) {
  return login(arg1, arg2);
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function logoutAction() {
  return logout();
}

export async function gantiPassword(arg1, arg2) {
  let formData = null;
  if (arg2 instanceof FormData) {
    formData = arg2;
  } else if (arg1 instanceof FormData) {
    formData = arg1;
  } else if (arg2 && typeof arg2.get === "function") {
    formData = arg2;
  } else if (arg1 && typeof arg1.get === "function") {
    formData = arg1;
  }

  const passwordBaru = String(formData?.get?.("password_baru") || "");
  const konfirmasiPassword = String(formData?.get?.("konfirmasi_password") || "");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi Anda telah berakhir atau belum login. Silakan masuk kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: "Password berhasil diganti." };
}

export async function gantiPasswordAction(arg1, arg2) {
  return gantiPassword(arg1, arg2);
}

export async function updatePassword(arg1, arg2) {
  return gantiPassword(arg1, arg2);
}

export async function tambahProduk(arg1, arg2) {
  let formData = null;
  if (arg2 instanceof FormData) {
    formData = arg2;
  } else if (arg1 instanceof FormData) {
    formData = arg1;
  } else if (arg2 && typeof arg2.get === "function") {
    formData = arg2;
  } else if (arg1 && typeof arg1.get === "function") {
    formData = arg1;
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const nama = String(formData?.get?.("nama") || "").trim();
  const hargaRaw = formData?.get?.("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = String(formData?.get?.("kategori") || "").trim();
  const foto_url = String(formData?.get?.("foto_url") || "").trim();
  const deskripsi = String(formData?.get?.("deskripsi") || "").trim();

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url: foto_url || "/produk/kopi.svg",
    deskripsi,
  });

  if (error) {
    return { error: error.message || "Gagal menyimpan produk baru." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function tambahProdukAction(arg1, arg2) {
  return tambahProduk(arg1, arg2);
}

export async function ubahProduk(arg1, arg2) {
  let formData = null;
  if (arg2 instanceof FormData) {
    formData = arg2;
  } else if (arg1 instanceof FormData) {
    formData = arg1;
  } else if (arg2 && typeof arg2.get === "function") {
    formData = arg2;
  } else if (arg1 && typeof arg1.get === "function") {
    formData = arg1;
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const id = formData?.get?.("id");
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const nama = String(formData?.get?.("nama") || "").trim();
  const hargaRaw = formData?.get?.("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = String(formData?.get?.("kategori") || "").trim();
  const foto_url = String(formData?.get?.("foto_url") || "").trim();
  const deskripsi = String(formData?.get?.("deskripsi") || "").trim();

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url: foto_url || "/produk/kopi.svg",
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal memperbarui produk." };
  }

  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProdukAction(arg1, arg2) {
  return ubahProduk(arg1, arg2);
}

export async function hapusProduk(arg1, arg2) {
  let formData = null;
  if (arg2 instanceof FormData) {
    formData = arg2;
  } else if (arg1 instanceof FormData) {
    formData = arg1;
  } else if (arg2 && typeof arg2.get === "function") {
    formData = arg2;
  } else if (arg1 && typeof arg1.get === "function") {
    formData = arg1;
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const id = formData?.get?.("id");
  if (!id) {
    throw new Error("ID produk tidak valid.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal menghapus produk.");
  }

  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function hapusProdukAction(arg1, arg2) {
  return hapusProduk(arg1, arg2);
}
