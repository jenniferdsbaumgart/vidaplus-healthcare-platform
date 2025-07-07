
import { api } from '../lib/api/axios';

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  const response = await api.post('/auth/login', data);
  const token = response.data.token;

  localStorage.setItem('token', token);

  return response.data;
}
