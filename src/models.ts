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

export interface Comment{
  id : string,
  userId : string,
  content : string,
  userName : string,
  subCount : number,
  createdAt : string
}

export interface WatchVideo{
  id : string,
  title : string,
  description : string,
  url : string,
  userId: string,
  userName : string,
  viewCount : number,
  likeCount : number,
  dislikeCount: number
  createdAt : string
}