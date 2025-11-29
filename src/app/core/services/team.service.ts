import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsCollection = collection(this.firestore, 'teams');

  constructor(private firestore: Firestore) { }

  // Get all teams
  getTeams(): Observable<Team[]> {
    return collectionData(this.teamsCollection, { idField: 'id' }) as Observable<Team[]>;
  }

  // Get a single team by id
  getTeam(id: string): Observable<Team> {
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return docData(teamDoc, { idField: 'id' }) as Observable<Team>;
  }

  // Create a new team
  createTeam(team: Omit<Team, 'id'>) {
    return addDoc(this.teamsCollection, team);
  }

  // Update an existing team
  updateTeam(id: string, data: Partial<Team>) {
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return updateDoc(teamDoc, data);
  }

  // Delete a team
  deleteTeam(id: string) {
    const teamDoc = doc(this.firestore, `teams/${id}`);
    return deleteDoc(teamDoc);
  }
}
