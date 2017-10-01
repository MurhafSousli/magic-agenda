import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AgendaItem } from './agenda.model';

@Injectable()
export class AgendaService {

  /** Agenda items storage */
  private arr: AgendaItem[] = [];

  /** Subject to notify components when items get updated */
  data = new BehaviorSubject(this.arr);

  /** Add agenda item */
  add(name: string, parent?) {
    let index = 0;
    if (parent) {
      parent.children.push(name);
    } else {
      index = this.arr.push({name: name, children: [], files: []}) - 1;
    }
    this.data.next([...this.arr]);

    /** return parent item */
    return this.arr[index];
  }

  /** Remove agenda item */
  remove(item: AgendaItem | string, parent?: AgendaItem) {

    if (parent && parent.children) {
      parent.children = parent.children.filter(x => x !== item);
    } else {
      this.arr = this.arr.filter(x => x !== item);
    }
    this.data.next([...this.arr]);
  }

  /** Add files to agenda item */
  addFiles(item: AgendaItem, files) {
    item.files = [...item.files, ...files];
    this.data.next([...this.arr]);
  }
}
