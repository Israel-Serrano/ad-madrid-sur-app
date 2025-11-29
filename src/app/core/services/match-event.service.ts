import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatchEvent } from '../models/match-event.model';

@Injectable({
  providedIn: 'root'
})
export class MatchEventService {
  private eventsCollection = collection(this.firestore, 'matchEvents');

  constructor(private firestore: Firestore) { }

  // Get all events for a specific team, ordered by minute
  getEventsByTeam(teamId: string): Observable<MatchEvent[]> {
    const q = query(
      this.eventsCollection, 
      where('teamId', '==', teamId),
      orderBy('minute', 'desc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<MatchEvent[]>;
  }

  // Get all events for all teams (for leaderboards)
  getAllEvents(): Observable<MatchEvent[]> {
    return collectionData(this.eventsCollection, { idField: 'id' }) as Observable<MatchEvent[]>;
  }

  // Create a new match event
  createEvent(event: Omit<MatchEvent, 'id'>) {
    return addDoc(this.eventsCollection, {
      ...event,
      matchDate: new Date() // Set the date when the event is created
    });
  }
}
