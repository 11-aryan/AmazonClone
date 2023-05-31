import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Cart } from '../Models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = 'http://localhost:4600/api'

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code:${error.status}\nMessafe:${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }


  constructor(private httpClient: HttpClient) { }

  getCarts(): Observable<Cart[]> {
    return this.httpClient.get<Cart[]>(this.baseUrl + '/carts')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addCarts(c: Cart): Observable<Cart> {
    return this.httpClient.post<Cart>(this.baseUrl + '/carts', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }
  

  updateCart(c: Cart): Observable<Cart> {
    return this.httpClient.put<Cart>(`${this.baseUrl}/carts/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteCart(id: string): Observable<Cart> {
    return this.httpClient.delete<Cart>(`${this.baseUrl}/carts/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      
      
  getCartById(id: string): Observable<Cart> {
    return this.httpClient.get<Cart>(this.baseUrl + '/carts/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }
}
