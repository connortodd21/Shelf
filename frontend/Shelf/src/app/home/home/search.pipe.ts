import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, sortOption: number): any[] {

    if(!items) return [];

    if (sortOption >= 0) {
      this.comparison(items, sortOption);
    }

    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.name.toLowerCase().includes(searchText);
    });
  }

  private comparison(items: any[], sortOption: number) {
    if (sortOption == 0) {
      return this.shuffle(items);
    }
    else if (sortOption == 1) {
      return items.sort(this.globalAscending);
    }
    else if (sortOption == 2) {
      return items.sort(this.globalDescending);
    }
    else if (sortOption == 3) {
      return items.sort(this.userAscending);
    }
    else if (sortOption == 4) {
      return items.sort(this.userDescending);
    }

  }

  private globalAscending(a, b) : number {

    const r1 = a.globalRating;
    const r2 = b.globalRating;

    if (r1 > r2) {
      return 1;
    }
    else if ( r1 < r2) {
      return -1;
    }
    else {
      return 0;
    }

  }

  private globalDescending(a, b): number {
    const r1 = a.globalRating;
    const r2 = b.globalRating;

    if (r1 > r2) {
      return -1;
    }
    else if ( r1 < r2) {
      return 1;
    }
    else {
      return 0;
    }

  }

  private userAscending(a, b): number {
    const r1 = a.userRating;
    const r2 = b.userRating;

    if (r1 > r2) {
      return 1;
    }
    else if ( r1 < r2) {
      return -1;
    }
    else {
      return 0;
    }

  }

  private userDescending(a, b): number {
    const r1 = a.userRating;
    const r2 = b.userRating;

    if (r1 > r2) {
      return -1;
    }
    else if ( r1 < r2) {
      return 1;
    }
    else {
      return 0;
    }
  }

  private shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
  }

}
