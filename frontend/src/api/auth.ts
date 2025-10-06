import { BASE_URL } from "./url";

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;
  return await res.json(); // { id, username, email }
};

export const login = async (name: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json", // ✅ Important for Flask to parse JSON
    },
    body: JSON.stringify({ name, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.msg || "Login failed");
  }

  const data = await res.json();
  return data;
};

export const signup = async (name: string, email: string, password: string) => {
console.log("🔗 Signup URL:", `${BASE_URL}/auth/signup`);
  
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    // credentials: "include",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    return new Error("Sign Up Failed");
  }
  const data = await res.json();
  return data;
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    return new Error("Error");
  }
  const data = await res.json();
  return data;
};
