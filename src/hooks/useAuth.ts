import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // ajuste se o path for diferente

export const useAuth = () => useContext(AuthContext);