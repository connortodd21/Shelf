export class Feed {
    event: string;
    user: string;
    timeStamp: Date;
    userRatedGame: Boolean;
    game_id: string;
    rating: Number
    gameName: string

    constructor(response: any) {
        this.event = response.event;
        this.user = response.user;
        this.timeStamp = response.time_stamp;
        this.userRatedGame = response.userRatedGame
        if(response.userRatedGame){
            this.game_id = response.game_id;
            this.rating = response.rating
            this.gameName = response.gameName
        }
    }

}
