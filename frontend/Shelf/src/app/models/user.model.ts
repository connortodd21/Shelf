export interface UserModel {
  email: string;
  username: string;
  birthday: string;
  dateCreated: Date;
  gamesPlayed: string[];
  gamesRated: string[];
  inbox: string[];
  wishList: string[];
  inboxID: string;
  followers: string[];
  following: string[];
}
