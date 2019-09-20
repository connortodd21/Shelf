export const NEW_FOLLOWER_NOTIFICATION = (sender, receiver) => {
    return ('Hello ' + receiver + ', ' + sender + ' has begun following you!');
};

export const SEND_MESSAGE_NOTIFICATION = (sender, receiver) => {
    return ( 'Hello ' + receiver + ', you have a new message from ' + sender);
};
