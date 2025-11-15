export type Message = {
  sender_id:number,
  id: number;
  text: string;
  user_id: number;
  receiver_id: number | null;
  username: string;
  created_at: string;
  image_url: string;
}

export type UserType = {
  id: number;
  username: string;
  email: string;
}

export type DecodedToken = {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}