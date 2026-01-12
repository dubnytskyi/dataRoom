import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { IAuthService } from '../../domain/auth/IAuthService';
import { User, SignUpDTO, SignInDTO, AuthResult } from '../../domain/auth/types';

export class FirebaseAuthService implements IAuthService {
  private mapFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }

  async signUp(dto: SignUpDTO): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, dto.email, dto.password);

      if (dto.displayName) {
        await updateProfile(userCredential.user, {
          displayName: dto.displayName,
        });
      }

      return {
        success: true,
        user: this.mapFirebaseUser(userCredential.user),
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  async signIn(dto: SignInDTO): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, dto.email, dto.password);

      return {
        success: true,
        user: this.mapFirebaseUser(userCredential.user),
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      return {
        success: true,
        user: this.mapFirebaseUser(userCredential.user),
      };
    } catch (error: any) {
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  getCurrentUser(): User | null {
    return this.mapFirebaseUser(auth.currentUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      callback(this.mapFirebaseUser(firebaseUser));
    });
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/user-disabled':
        return 'User account is disabled';
      case 'auth/user-not-found':
        return 'No user found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time';
      default:
        return 'An error occurred during authentication';
    }
  }
}
