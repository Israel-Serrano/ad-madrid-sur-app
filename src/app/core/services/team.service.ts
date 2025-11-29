import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsCollection = collection(this.firestore, 'teams');
  private readonly CACHE_KEY = 'teams_list';
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor(
    private firestore: Firestore,
    private cacheService: CacheService
  ) { }

  // Get all teams (con caché)
  getTeams(): Observable<Team[]> {
    return this.cacheService.get(
      this.CACHE_KEY,
      () => collectionData(this.teamsCollection, { idField: 'id' }) as Observable<Team[]>,
      this.CACHE_TTL
    );
  }

  // Get teams for a specific coach
  getTeamsForCoach(coachId: string): Observable<Team[]> {
    const q = query(this.teamsCollection, where('coachIds', 'array-contains', coachId));
    return collectionData(q, { idField: 'id' }) as Observable<Team[]>;
  }

  // Get a single team by id
  getTeam(id: string): Observable<Team> {
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return docData(teamDoc, { idField: 'id' }) as Observable<Team>;
  }

  // Create a new team (invalida caché)
  createTeam(team: Omit<Team, 'id'>) {
    this.cacheService.invalidate(this.CACHE_KEY);
    return addDoc(this.teamsCollection, team);
  }

  // Update an existing team (invalida caché)
  updateTeam(id: string, data: Partial<Team>) {
    this.cacheService.invalidate(this.CACHE_KEY);
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return updateDoc(teamDoc, data);
  }

  // Delete a team (invalida caché)
  deleteTeam(id: string) {
    this.cacheService.invalidate(this.CACHE_KEY);
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return deleteDoc(teamDoc);
  }
}
