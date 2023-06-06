import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

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

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseUrl + '/categories')
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  addCategories(c: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.baseUrl + '/categories', JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1), 
        catchError(this.httpError)
      )
  }
  

  updateCategory(c: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.baseUrl}/categories/${c._id}`, JSON.stringify(c), this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
      )
  }


  deleteCategory(id: string): Observable<Category> {
    return this.httpClient.delete<Category>(`${this.baseUrl}/categories/${id}`, this.httpHeader)
      .pipe(
        retry(1),
        catchError(this.httpError)
        )
  }
      
      
  getCategoryById(id: string): Observable<Category> {
    return this.httpClient.get<Category>(this.baseUrl + '/categories/' + id)
      .pipe(
        retry(1),
        catchError(this.httpError)
      );
  }


  getCategoriesByCategoryName(categoryName: string): Observable<Category[]>  {
    const params = new HttpParams()
        .set("categoryName", categoryName); 

    return this.httpClient.get<Category[]>(this.baseUrl + '/search/categories', { params })
        .pipe(
          retry(1),
          catchError(this.httpError)
      );
  }

}
