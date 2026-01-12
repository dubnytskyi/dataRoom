import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SignUpDTO, SignInDTO, AuthResult } from '../../domain/auth/types';
import { FirebaseAuthService } from '../../infrastructure/auth/FirebaseAuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (dto: SignUpDTO) => Promise<AuthResult>;
  signIn: (dto: SignInDTO) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authService = new FirebaseAuthService();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (dto: SignUpDTO): Promise<AuthResult> => {
    return authService.signUp(dto);
  };

  const signIn = async (dto: SignInDTO): Promise<AuthResult> => {
    return authService.signIn(dto);
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    return authService.signInWithGoogle();
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
