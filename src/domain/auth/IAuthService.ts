import { User, SignUpDTO, SignInDTO, AuthResult } from './types';

export interface IAuthService {
  signUp(dto: SignUpDTO): Promise<AuthResult>;
  signIn(dto: SignInDTO): Promise<AuthResult>;
  signInWithGoogle(): Promise<AuthResult>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
