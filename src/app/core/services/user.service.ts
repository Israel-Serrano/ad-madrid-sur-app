import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) { }

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  updateUserRole(uid: string, role: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDoc, { role });
  }

  deleteUser(uid: string) {
    // This only deletes the user from the Firestore collection.
    // Deleting from Firebase Auth requires a cloud function for security reasons.
    const userDoc = doc(this.firestore, `users/${uid}`);
    return deleteDoc(userDoc);
  }
}
