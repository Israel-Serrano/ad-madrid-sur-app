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
          const userDoc = doc(this.firestore, `users/${firebaseUser.uid}`);
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            subscriber.next({ uid: firebaseUser.uid, ...userSnap.data() } as User);
          } else {
            // User exists in Auth but not in Firestore users collection
            // This could be an error state or you might want to create a default user profile
            subscriber.next(null); 
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
