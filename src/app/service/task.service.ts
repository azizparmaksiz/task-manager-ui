import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {isNullOrUndefined} from 'util';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  getUrl(endpoint: string): string {
    return `${environment.host}${endpoint}`;
  }


  getHeader() {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    };
  }

  getTasks() {
    return this.getObservable('task/all', this.getHeader());
  }

  deleteTask(taskId: any) {
    return this.httpClient.delete(this.getUrl('task/delete/' + taskId)).toPromise();
  }

  private getObservable(endpoint: string, options = {}): Observable<any> {
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


}
