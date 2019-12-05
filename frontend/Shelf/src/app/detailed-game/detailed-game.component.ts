import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { GamesService } from '../games/games.service';
import { COVER_BIG, SCREENSHOT_BIG } from '../constants/constants.images';
import { Location } from '@angular/common';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-detailed-game',
  templateUrl: './detailed-game.component.html',
  styleUrls: ['./detailed-game.component.scss']
})

export class DetailedGameComponent implements OnInit {
  id;
  game;
  coverPath;
  screenshotPath;
  artworkUrls;
  globalRating: number;
  userRating: number;
  comments;
  images;
  gameName: string;
  isWishListed: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private gamesService: GamesService,
              private userService: UserService, private location: Location) {
    this.route.params.subscribe(params => this.id = params.id);
    this.comments = [];
    this.images = [];
  }
  ngOnInit() {
    // if we navigated from home page, then we can save tons of time and use these

    if (history.state.userRating !== undefined && history.state.globalRating !== undefined) {
      this.globalRating = history.state.globalRating;
      this.userRating = history.state.userRating;
      this.getDetailedGameData(false);
      this.getComments();
    }
    // tslint:disable: one-line
    else {
      this.getDetailedGameData(true);
      this.getComments();
    }
    this.getIsWishListed();

    this.coverPath = COVER_BIG;
    this.screenshotPath = SCREENSHOT_BIG;
  }

  getIsWishListed() {
    const username = localStorage.getItem('user');
    this.userService.fetchUser(username).subscribe(response => {
      if (response.wish_list.includes(this.id)) {
        this.isWishListed = true;
      } else {
        this.isWishListed = false;
      }
    });
  }

  getComments(){
    this.gamesService.getGlobalRatingInfo(this.id).subscribe(
      // tslint:disable: no-shadowed-variable
      response => {
        console.log(response);
        let i = 0;
        response.comments.forEach(element => {
          this.comments[i] = element;
          this.comments[i].comment_id = element._id;
          i++;
        });
      }
    );
  }

  getDetailedGameData(shouldFetchRatings: boolean) {
    this.gamesService.getDetailedInfoAboutGame(this.id).subscribe(
      (response) => {
        this.game = response.shift();
        this.game.release_date = this.getDateString(this.game.first_release_date);
        this.artworkUrls = [];
        if (this.game.artworks) {
          this.game.artworks.forEach(artwork => {
            this.artworkUrls.push(`${SCREENSHOT_BIG}${artwork.image_id}.jpg`);
          });
        }

        console.log(shouldFetchRatings);

        this.gamesService.getGlobalRatingInfo(this.id).subscribe(
          // tslint:disable: no-shadowed-variable
          resp => {
            if (shouldFetchRatings) {
              console.log(resp);
              this.globalRating = resp.total_rating_value / resp.number_of_ratings;
            }
            for (let i = 0; i < resp.images.length; i++) {
              this.images.push(resp.images[i].url);
            }
          }
        );

        this.gamesService.fetchUserRating(this.id).subscribe(
          response => {
            this.userRating = response.rating;
          }
        );
      }
    );
  }

  getDateString(timestamp) {
    const date = new Date(timestamp * 1000);
    // tslint:disable: max-line-length
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  gotoGamePage() {
    window.open(this.game.url, '_blank');
  }

  goBack() {
    this.location.back();
  }


  handleRate(event) {
    let coverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + this.game.cover.image_id + ".jpg";
    this.gamesService.submitRatingToUser(event.value, this.userRating, this.id, coverUrl).subscribe(
      () => {

        this.gamesService.submitRatingToGame(event.value, this.userRating, this.id, this.game.name).subscribe(
          () => {

            this.gamesService.getGlobalRatingInfo(this.id).subscribe(
              response => {
                this.globalRating = response.total_rating_value / response.number_of_ratings;

                if (event.value === this.userRating) {
                  this.userRating = 0;
                }
                else {
                  this.userRating = event.value;
                }
              }
            );
          }
        );
      }
    );
  }

  upvote(comment) {
    this.gamesService.upvote(comment.comment_id, this.id).then(res => {
      // window.location.reload();
      this.getTopComments();
      comment.score += 1
    });
  }

  downvote(comment) {
    this.gamesService.downvote(comment.comment_id, this.id).then(res => {
      // window.location.reload();
    });
  }

  addComment(comment) {
    this.gamesService.addComment(comment, this.id).then(res => {
      this.getComments()
    });
  }

  deleteComment(comment) {
    this.gamesService.deleteComment(comment.comment_id, this.id).then(res => {
      this.getComments()
    });
  }

  getBottomComments(){
    this.comments.sort((a: { score: number; }, b: { score: number; }) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));
  }

  getTopComments(){
    this.comments.sort((a: { score: number; }, b: { score: number; }) => (b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0));
  }

  addToWishList() {
    this.gamesService.addToWishList(this.id, this.game.name).then(x => {
      this.isWishListed = true;
    });
  }

  processFile(event) {
    let file = event.target.files[0]
    let formdata = new FormData()
    console.log(file)
    formdata.append('image', file, file.name)
    formdata.append('gameId', this.id)
    this.gamesService.addImage(formdata, this.id).then((res) => {
      this.images.push(res['url'])
      console.log(res)
    })
  }
  
  removeFromWishList() {
    this.gamesService.removeFromWishList(this.id).then(x => {
      this.isWishListed = false;
    });
  }

  routeToSearch(genre) {
    let routeStringTemp = genre;
    routeStringTemp.replace('/', '_');
    const routeString = '/search/:' + routeStringTemp;
    this.router.navigate([routeString]);
  }

  goToProfile = (username: string) => {
    window.location.replace(`/profile/${username}`);
  }

}
