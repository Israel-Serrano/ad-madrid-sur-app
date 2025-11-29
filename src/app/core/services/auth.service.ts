import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseAuthUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.currentUser$ = new Observable(subscriber => {
      onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
        if (firebaseUser) {
          try {
            const userDoc = doc(this.firestore, `users/${firebaseUser.uid}`);
            const userSnap = await getDoc(userDoc);
            
            if (userSnap.exists()) {
              // User exists in Firestore with full profile
              subscriber.next({ uid: firebaseUser.uid, ...userSnap.data() } as User);
            } else {
              // User exists in Auth but not in Firestore users collection
              // Determine role from email pattern
              let role: 'admin' | 'coach' = 'coach';
              const email = firebaseUser.email || '';
              
              if (email.includes('admin@')) {
                role = 'admin';
              }
              
              // Create a temporary user object with basic info
              subscriber.next({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Usuario',
                role: role
              } as User);
            }
          } catch (error) {
            console.error('Error fetching user from Firestore:', error);
            // On error, create minimal user object to prevent infinite loading
            let role: 'admin' | 'coach' = 'coach';
            const email = firebaseUser.email || '';
            if (email.includes('admin@')) {
              role = 'admin';
            }
            subscriber.next({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Usuario',
              role: role
            } as User);
          }
        } else {
          subscriber.next(null);
        }
      });
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
