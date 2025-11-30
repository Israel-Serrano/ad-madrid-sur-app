import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore, private auth: Auth) { }

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, { idField: 'uid' }) as Observable<User[]>;
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    const q = query(this.usersCollection, where('role', '==', role));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  /**
   * Creates a user in both Firebase Authentication and Firestore.
   * @param user User data including email and temporary password
   * @param tempPassword Temporary password for the new user
   */
  async createUserWithAuth(user: User, tempPassword: string): Promise<void> {
    try {
      // 1. Create user in Firebase Authentication
      const authResult = await createUserWithEmailAndPassword(this.auth, user.email, tempPassword);
      const uid = authResult.user.uid;

      // 2. Update profile with display name
      await updateProfile(authResult.user, { displayName: user.displayName });

      // 3. Create user document in Firestore with the auth UID
      const userData: User = {
        ...user,
        uid: uid
      };
      const userDoc = doc(this.firestore, `users/${uid}`);
      await setDoc(userDoc, userData);

      console.log('✅ User created successfully in Auth and Firestore:', uid);
    } catch (error: any) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Creates a user document in Firestore only.
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
