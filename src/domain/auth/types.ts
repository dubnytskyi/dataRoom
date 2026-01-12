export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpDTO {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: User | null;
}
