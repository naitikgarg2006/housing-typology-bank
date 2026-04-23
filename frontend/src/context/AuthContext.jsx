import { createContext, useContext } from 'react';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const session = authClient.useSession();
  const user = session.data?.user ?? null;
  const loading = session.isPending;

  const login = async (email, password) => {
    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Sign in failed');
    }

    return result.data;
  };

  const register = async (name, email, password) => {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Sign up failed');
    }

    return result.data;
  };

  const logout = async () => {
    const result = await authClient.signOut();
    if (result?.error) {
      throw new Error(result.error.message || 'Sign out failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
