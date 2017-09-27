import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FilesService {

  /** Store files items (mock) */
  arr = [];

  /** Subject to notify components when items are updated */
  data = new BehaviorSubject(this.arr);

  /** Add document item */
  add(file: File) {
    this.arr.push(file);
    this.data.next([...this.arr]);
  }

  /** Remove document item */
  remove(item: File) {
    this.arr = this.arr.filter(x => x !== item);
    this.data.next([...this.arr]);
  }

}

