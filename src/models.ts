export interface VideoDTO {
  id: string | number;
  title: string;
  thumbnail: string;
  url: string;

  userName: string;
  userId: string | number;

  viewCount: number;
  createdAt: string; // e.g., "2 hours ago" from getTimeAgo()
}
