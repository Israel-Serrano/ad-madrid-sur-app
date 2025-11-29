import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseAuthUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { switchMap, shareReplay, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.currentUser$ = from(new Promise<FirebaseAuthUser | null>(resolve => {
      // Set a timeout to prevent hanging forever
      const timeoutId = setTimeout(() => resolve(null), 10000);
      
      onAuthStateChanged(this.auth, (firebaseUser: FirebaseAuthUser | null) => {
        clearTimeout(timeoutId);
        resolve(firebaseUser);
      });
    })).pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          return of(null);
        }
        
        // Try to get user from Firestore, but with a quick fallback
        return from(this.getUserWithTimeout(firebaseUser)).pipe(
          catchError(error => {
            console.warn('Error fetching user from Firestore, using fallback:', error);
            // Return fallback user based on email
            return of(this.createFallbackUser(firebaseUser));
          })
        );
      }),
      shareReplay(1)
    );
  }

  /**
   * Get user from Firestore with timeout
   */
  private async getUserWithTimeout(firebaseUser: FirebaseAuthUser): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userSnap = await getDoc(userDocRef);
      
      if (userSnap.exists()) {
        return { uid: firebaseUser.uid, ...userSnap.data() } as User;
      }
      
      // User doesn't exist in Firestore, return fallback
      return this.createFallbackUser(firebaseUser);
    } catch (error) {
      console.error('Error fetching user from Firestore:', error);
      return this.createFallbackUser(firebaseUser);
    }
  }

  /**
   * Create a fallback user object when Firestore is unavailable
   */
  private createFallbackUser(firebaseUser: FirebaseAuthUser): User {
    let role: 'admin' | 'coach' = 'coach';
    const email = firebaseUser.email || '';
    
    if (email.includes('admin@')) {
      role = 'admin';
    }
    
    return {
      uid: firebaseUser.uid,
      email: email,
      displayName: firebaseUser.displayName || 'Usuario',
      role: role
    };
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
