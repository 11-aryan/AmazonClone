import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Seller } from '../Models/seller';


@Injectable({
  providedIn: 'root'
})
export class SellerService {

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


  getSellers(): Observable<Seller[]> {
    return this.httpClient.get<Seller[]>(this.baseUrl + '/sellers')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addSeller(u: Seller): Observable<Seller> {
    return this.httpClient.post<Seller>(this.baseUrl + '/sellers', JSON.stringify(u), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  getSellerById(SellerId: string): Observable<Seller> {
    return this.httpClient.get<Seller>(this.baseUrl + '/sellers/' + SellerId)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  updateSeller(u: Seller): Observable<Seller> {
    return this.httpClient.put<Seller>(`${this.baseUrl}/sellers/${u._id}`, JSON.stringify(u), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteSeller(SellerId: number): Observable<Seller> {
    return this.httpClient.delete<Seller>(`${this.baseUrl}/sellers/${SellerId}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }
}
