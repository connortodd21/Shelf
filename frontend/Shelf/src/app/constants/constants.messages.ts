export const ADD_FRIEND_NOTIFICATION = (sender, receiver) => {
    return ('Hello ' + receiver + ', ' + sender + ' would like to add you as a friend!');
};

export const SEND_MESSAGE_NOTIFICATION = (sender, receiver) => {
    return ( 'Hello ' + receiver + ', you have a new message from ' + sender);
};
