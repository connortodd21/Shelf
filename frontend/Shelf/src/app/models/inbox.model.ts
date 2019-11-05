export class Inbox {
    sender: string;
    message: string;
    timeStamp: string;
    hasBeenRead: boolean;
    type: string;

    constructor(response: any, type: string) {
        this.sender = response.sender;
        this.message = response.message;
        this.timeStamp = response.time_stamp;
        this.hasBeenRead = response.hasBeenRead;
        this.type = type;
    }

}
