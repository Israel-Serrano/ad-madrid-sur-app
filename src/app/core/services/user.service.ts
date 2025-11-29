import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) { }

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    const q = query(this.usersCollection, where('role', '==', role));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  /**
   * Creates a user document in Firestore.
   * NOTE: This assumes a user has already been created in Firebase Authentication,
   * as creating auth users from the client is a security risk. 
   * This should ideally be handled by a Cloud Function that creates both records.
   */
  createUser(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, user);
  }

  updateUser(uid: string, data: Partial<User>): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDoc, data);
  }

  deleteUser(uid: string): Promise<void> {
    // This only deletes the user from the Firestore collection.
    // Deleting from Firebase Auth requires a cloud function for security reasons.
    const userDoc = doc(this.firestore, `users/${uid}`);
    return deleteDoc(userDoc);
  }
}
