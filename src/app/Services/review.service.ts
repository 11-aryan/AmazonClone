import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Review } from '../Models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

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

  getReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.baseUrl + '/reviews')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  addReviews(c: Review): Observable<Review> {
    return this.httpClient.post<Review>(this.baseUrl + '/reviews', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }
  

  updateReview(c: Review): Observable<Review> {     
    return this.httpClient.put<Review>(`${this.baseUrl}/reviews/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteReview(id: string): Observable<Review> {
    return this.httpClient.delete<Review>(`${this.baseUrl}/reviews/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      

  getReviewById(id: string): Observable<Review> {
    return this.httpClient.get<Review>(this.baseUrl + '/reviews/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  getReviewsByProductId(productId: string): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.baseUrl + '/reviews/product/' + productId)
    .pipe(
      retry(1), 
      catchError(this.httpError)
    )
  }


  getReviewByProductAndCustomerId(productId: string, customerId: string): Observable<Review> {
    const params = new HttpParams().set('productId', productId).set('customerId', customerId);
    return this.httpClient.get<Review>(`${this.baseUrl}/reviews/productAndCustomer/productId`, { params })
      .pipe(
        retry(1),
        catchError(this.httpError)
    );
  }

  
}
