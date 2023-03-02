import { Photo } from "./photo";

export interface Member {
  id: number;
  userName: string;
  photoUrl: string;
  dateOfBirth: Date;
  knownAs: string;
  created: Date;
  lastActive: Date;
  age: number;
  introduction: string;
  lookingFor: string;
  interests: string;
  city: string;
  country: string;
  photos: Photo[];
}
