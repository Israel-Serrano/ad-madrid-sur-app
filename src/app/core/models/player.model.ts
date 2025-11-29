export interface Player {
  id: string;
  name: string;
  teamId: string;
  dorsal?: number;
  
  // Player Stats
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;

  // Optional details
  position?: string;
  dateOfBirth?: Date;
  photoUrl?: string;
  // Add any other player-specific details here
}
