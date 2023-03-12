export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
  isApproved: boolean;
  isRejected: boolean;
  username: string;
  userId: number,
}
