export class ProfileModel {
    email: string;
    username: string;
    birthday: string;
    friends: string[];
    dateCreated: Date;
    gamesPlayed: string[];
    gamesRated: string[];
    inbox: string[];
    wishList: string[];

    constructor(response: any) {
        this.email = response.email;
        this.username = response.username;
        this.birthday = response.birthday;
        this.friends = response.friends;
        this.dateCreated = response.date_created;
        this.gamesPlayed = response.games_played;
        this.gamesRated = response.games_rated;
        this.inbox = response.inbox;
        this.wishList = response.wish_list;
    }

}
