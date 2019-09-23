export class ProfileModel {
    email: string;
    username: string;
    birthday: string;
    followers: string[];
    following: string[];
    dateCreated: Date;
    gamesPlayed: string[];
    gamesRated: [{
      game_id: string,
      rating: number,
    }]
    inbox: string[];
    wishList: string[];

    constructor(response: any) {
        this.email = response.email;
        this.username = response.username;
        this.birthday = response.birthday;
        this.dateCreated = response.date_created;
        this.gamesPlayed = response.games_played;
        this.gamesRated =  response.games_rated;
        this.inbox = response.inbox;
        this.wishList = response.wish_list;
        this.followers = response.followers;
        this.following = response.following;
    }

}
