export class Inbox {
    sender: string;
    message: string;
    timeStamp: string;
    hasBeenRead: boolean;

    constructor(response: any) {
        this.sender = response.sender;
        this.message = response.message;
        this.timeStamp = response.time_stamp;
        this.hasBeenRead = response.hasBeenRead;
    }

}
