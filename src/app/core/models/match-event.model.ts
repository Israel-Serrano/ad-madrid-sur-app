export type MatchEventType = 'Goal' | 'Assist' | 'Yellow Card' | 'Red Card';

export interface MatchEvent {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  type: MatchEventType;
  minute: number;
  matchDate: Date;
  assistantPlayerId?: string; // Optional, for 'Goal' events
}
