export class Message {
    receiver: string;
    id: string;
    messages: any[] = [];
    time_stamp: string;

    constructor(response: any) {
        if (localStorage.getItem('user') === response.firstUser) {
            this.receiver = response.secondUser;
        } else {
            this.receiver = response.firstUser;
        }
        this.id = response._id;
        this.messages = response.messages;
    }

}
