import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Customer } from '../Models/customer';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

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

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.baseUrl + '/customers')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addCustomers(c: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.baseUrl + '/customers', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }
  

  updateCustomer(c: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.baseUrl}/customers/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteCustomer(id: string): Observable<Customer> {
    return this.httpClient.delete<Customer>(`${this.baseUrl}/customers/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      
      
  getCustomerById(id: string): Observable<Customer> {
    return this.httpClient.get<Customer>(this.baseUrl + '/customers/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  getCustomerByEmail(customerEmail: string): Observable<Customer[]> {
    const params = new HttpParams()
        .set("customerEmail", customerEmail); 

    return this.httpClient.get<Customer[]>(this.baseUrl + '/search/customers', { params })
        .pipe(
          retry(1),
          catchError(this.httpError)
      );
  }

}
