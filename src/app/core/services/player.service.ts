import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersCollection = collection(this.firestore, 'players');
  private readonly CACHE_KEY = 'players_list';
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    private firestore: Firestore,
    private cacheService: CacheService
  ) { }

  // Get all players (con caché)
  getPlayers(): Observable<Player[]> {
    return this.cacheService.get(
      this.CACHE_KEY,
      () => collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>,
      this.CACHE_TTL
    );
  }

  // Get players for a specific team
  getPlayersByTeam(teamId: string): Observable<Player[]> {
    const q = query(this.playersCollection, where('teamId', '==', teamId));
    return collectionData(q, { idField: 'id' }) as Observable<Player[]>;
  }

  // Create a new player (invalida caché)
  createPlayer(player: Omit<Player, 'id'>) {
    this.cacheService.invalidate(this.CACHE_KEY);
    return addDoc(this.playersCollection, player);
  }

  // Update an existing player (invalida caché)
  updatePlayer(id: string, data: Partial<Player>) {
    this.cacheService.invalidate(this.CACHE_KEY);
    const playerDoc = doc(this.firestore, `players/${id}`);
    return updateDoc(playerDoc, data);
  }

  // Delete a player (invalida caché)
  deletePlayer(id: string) {
    this.cacheService.invalidate(this.CACHE_KEY);
    const playerDoc = doc(this.firestore, `players/${id}`);
    return deleteDoc(playerDoc);
  }
}
