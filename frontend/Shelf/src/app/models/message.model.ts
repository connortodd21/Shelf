export class Message {
    sender: string;
    message: string;
    timeStamp: Date;

    constructor(response: any) {
        this.sender = response.sender;
        this.message = response.message;
        this.timeStamp = response.timeStamp;
    }

}
