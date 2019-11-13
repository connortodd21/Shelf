export class Feed {
    event: string;
    user: string;
    timeStamp: Date;

    constructor(response: any) {
        this.event = response.event;
        this.user = response.user;
        this.timeStamp = response.time_stamp;
    }

}
