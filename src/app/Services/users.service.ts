import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = 'http://localhost:4600/api'


  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(private httpClient: HttpClient) { }


  private httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    }
    else {
      msg = `Error Code:${error.status}\nMessafe:${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }


  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl + '/users')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addUsers(u: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl + '/users', JSON.stringify(u), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  getUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + '/users/' + userId)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }



  updateUser(u: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseUrl}/users/${u._id}`, JSON.stringify(u), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteUser(userId: number): Observable<User> {
    return this.httpClient.delete<User>(`${this.baseUrl}/users/${userId}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }
}
