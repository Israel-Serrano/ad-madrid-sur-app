export type Category = 'Prebenjamín' | 'Benjamín' | 'Alevín' | 'Infantil' | 'Cadete' | 'Juvenil';

export interface Team {
  id: string;
  name: string;
  category: Category;
  coachIds: string[]; // Array of user uids who are coaches for this team
  playerIds: string[]; // Array of player ids belonging to this team
}
