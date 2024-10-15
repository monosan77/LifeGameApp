export interface RoomInfo {
  id: number;
  limitPlayer: number;
  member: Members[];
}
export interface Members {
  id: string;
  name: string;
  host: boolean;
}
