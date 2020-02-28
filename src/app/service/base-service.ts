import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';

@Injectable()
export class BaseHttpService {

  constructor(private httpClient: HttpClient) {
  }


  getUrl(endpoint: string): string {
    return `${environment.host}${endpoint}`;
  }

  get(endpoint: string, options = {}) {
    return this.httpClient.get(this.getUrl(endpoint), options).toPromise()
      .then(res => res)
      .catch(err => this.handlePromiseError(err));
  }

  post(endpoint: string, body, options = {}) {
    return this.httpClient.post(this.getUrl(endpoint), body, options).toPromise()
      .then(res => res)
      .catch(err => this.handlePromiseError(err));
  }

  put(endpoint: string, body, options = {}) {
    return this.httpClient.put(this.getUrl(endpoint), body, options).toPromise()
      .then(res => res)
      .catch(err => this.handlePromiseError(err));
  }

  delete(endpoint: string, options = {}) {
    return this.httpClient.delete(this.getUrl(endpoint), options).toPromise()
      .then(res => res)
      .catch(err => this.handlePromiseError(err));
  }

  postObservable(endpoint: string, body, options = {}): Observable<any> {
    return this.httpClient.post(this.getUrl(endpoint), body, options).pipe(map(res => res),
      catchError(err => this.handleObservableError(err)));
  }

  getObservable(endpoint: string, options = {}): Observable<any> {
    return this.httpClient.get(this.getUrl(endpoint), options)
      .pipe(
        map(res => res),
        catchError(err => this.handleObservableError(err))
      );
  }

  handleObservableError(error): Observable<any> {


    let message = '';
    if (error instanceof HttpErrorResponse) {

      switch (error.status) {
        case 200: // OK
        case 201: // Created
        case 202: // Accepted
          message = error.message;
          break;

        case 400: // Bad Request
          message = 'BAD_REQUEST';
          break;
        case 401: // Unauthorized
          break;
        case 403: // Forbidden
        case 404: // Not Found
          if (!isNullOrUndefined(error.error)
            && !isNullOrUndefined(error.error.errorCode)) {
            message = error.error.errorCode;
          } else if (!isNullOrUndefined(error.error)) {
            message = JSON.stringify(error.error);
          } else {
            message = JSON.stringify(error);
          }
          break;
        case 405: // Method Not Allowed
        case 406: // Not Acceptable
        case 408: // Request Timeout

          message = JSON.stringify(error.error);
          break;
        case 0: // Request Timeout
          message = 'CONNECTION-ERROR';
          break;
        default:
          message = JSON.stringify(error);
          break;
      }
    }
    return of('');
  }

  handlePromiseError(error: any) {
    let message = '';

    console.log(error);
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 200: // OK
        case 201: // Created
        case 202: // Accepted
          message = error.message;
          return Promise.resolve(error.message);
        case 401: // Unauthorized
          return Promise.reject('UNAUTHORIZED_OR_LOGIN_EXPIRE');
        case 400: // Bad Request
        case 403: // Forbidden
        case 404: // Not Found
          if (!isNullOrUndefined(error.error)
            && !isNullOrUndefined(error.error.errorCode)) {
            return Promise.reject(error.error.errorCode);
          } else if (!isNullOrUndefined(error.error)) {
            return Promise.reject(JSON.stringify(error.error));
          } else {
            return Promise.reject(JSON.stringify(error));
          }
        case 405: // Method Not Allowed
        case 406: // Not Acceptable
        case 408: // Request Timeout

          return Promise.reject(error.error);
        case 0: // Request Timeout
          return Promise.reject('CONNECTION-ERROR');
        default:
          return Promise.reject(error.error);
      }

    }
  }
}
