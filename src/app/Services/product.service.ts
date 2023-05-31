import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Product } from '../Models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl + '/products')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  addProducts(c: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl + '/products', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }
  

  updateProduct(c: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/products/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteProduct(id: string): Observable<Product> {
    return this.httpClient.delete<Product>(`${this.baseUrl}/products/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(this.baseUrl + '/products/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }

  getProductsBySellerId(sellerId: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl + '/products/seller/' + sellerId)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  getPaginatedProducts(pageNumber: number, pageSize: number, productCategories: string[], sortVal: number): Observable<{ data: Product[], totalCount: number }> {
    const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('productCategories', productCategories.join(','))
        .set('pageSize', pageSize.toString())
        .set('sortVal', sortVal.toString());
    
    return this.httpClient.get<{ data: Product[], totalCount: number }>(this.baseUrl + '/pagination/products', { params })
        .pipe(
            retry(1),
            catchError(this.httpError)
        );
  } 


  getProductsByProductName(productName: string): Observable<Product[]>  {
    const params = new HttpParams()
        .set("productName", productName); 

    return this.httpClient.get<Product[]>(this.baseUrl + '/search/products', { params })
        .pipe(
          retry(1),
          catchError(this.httpError)
      );
  }

  
}
