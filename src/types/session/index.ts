export interface RoomInfo {
  id: string;
  limitPlayer: number;
  member: Members[];
}
export interface Members {
  id: string;
  name: string;
  host: boolean;
  gameRoomId: string;
}
