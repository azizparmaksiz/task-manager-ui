import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class OptionService {

  options = {};


  constructor() {

  }

  getHeader() {
    return this.options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
  }

}
