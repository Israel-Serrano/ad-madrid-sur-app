import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseAuthUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay, catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private authUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    // Set up auth state listener
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseAuthUser | null) => {
      console.log('🔐 Auth state changed:', firebaseUser?.email || 'logged out');
      
      if (firebaseUser) {
        try {
          // Try to get user from Firestore
          const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
          const userSnap = await Promise.race([
            getDoc(userDocRef),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ]);
          
          const userData = (userSnap as any).data();
          if (userData) {
            console.log('✅ User found in Firestore:', userData.email);
            this.authUserSubject.next({ uid: firebaseUser.uid, ...userData } as User);
          } else {
            console.log('⚠️ User not in Firestore, using fallback');
            this.authUserSubject.next(this.createFallbackUser(firebaseUser));
          }
        } catch (error) {
          console.warn('⚠️ Error fetching from Firestore, using fallback:', error);
          this.authUserSubject.next(this.createFallbackUser(firebaseUser));
        }
      } else {
        console.log('🚪 User logged out');
        this.authUserSubject.next(null);
      }
    });
    
    this.currentUser$ = this.authUserSubject.asObservable().pipe(shareReplay(1));
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
    
    console.log(`👤 Fallback user: ${email} (${role})`);
    
    return {
      uid: firebaseUser.uid,
      email: email,
      displayName: firebaseUser.displayName || 'Usuario',
      role: role
    };
  }

  login(email: string, password: string) {
    console.log('🔑 Logging in:', email);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    console.log('🚪 Logging out');
    return signOut(this.auth);
  }
}
