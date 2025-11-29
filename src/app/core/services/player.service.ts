import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersCollection = collection(this.firestore, 'players');

  constructor(private firestore: Firestore) { }

  // Get all players
  getPlayers(): Observable<Player[]> {
    return collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>;
  }

  // Get players for a specific team
  getPlayersByTeam(teamId: string): Observable<Player[]> {
    const q = query(this.playersCollection, where('teamId', '==', teamId));
    return collectionData(q, { idField: 'id' }) as Observable<Player[]>;
  }

  // Create a new player
  createPlayer(player: Omit<Player, 'id'>) {
    return addDoc(this.playersCollection, player);
  }

  // Update an existing player
  updatePlayer(id: string, data: Partial<Player>) {
    const playerDoc = doc(this.firestore, `players/${id}`);
    return updateDoc(playerDoc, data);
  }

  // Delete a player
  deletePlayer(id: string) {
    const playerDoc = doc(this.firestore, `players/${id}`);
    return deleteDoc(playerDoc);
  }
}
