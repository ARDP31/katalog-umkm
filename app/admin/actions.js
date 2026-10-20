"use server";

import { redirect } from "next/navigation";
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

