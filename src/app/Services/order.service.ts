import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Order } from '../Models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

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

  getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl + '/orders')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addOrder(c: Order): Observable<Order> {    
    return this.httpClient.post<Order>(this.baseUrl + '/orders', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }


  updateOrder(c: Order): Observable<Order> {
    return this.httpClient.put<Order>(`${this.baseUrl}/orders/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteOrder(id: string): Observable<Order> {
    return this.httpClient.delete<Order>(`${this.baseUrl}/orders/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      
      
  getOrdersByCustomerId(id: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl + '/orders/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }
}
