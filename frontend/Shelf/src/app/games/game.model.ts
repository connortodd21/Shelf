export interface GameModel {
  total_rating_value: number;
  number_of_players: number;
  number_of_ratings: number;
  game_id: string;
  comments: [{
    comment: string,
    username: string,
    time_stamp: Date,
    score: number,
    comment_id: string
  }];
}
