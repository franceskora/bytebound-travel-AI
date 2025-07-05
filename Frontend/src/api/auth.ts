/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

export async function registerUser(data: { name: string; email: string; password: string; }) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include', 
  });

  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function loginUser(data: { email: string; password: string; }) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Not authenticated');
  return response.json();
}

export async function logoutUser() {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}