import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { ProductModel } from './models/product.model';
import { AuthModel } from '../auth/models/auth.model';
import { FileModel } from 'src/app/models/file.model';

const API_PRODUCT_URL = `${environment.apiUrl}/Product`;
const API_FILE_URL = `${environment.apiUrl}/File`;

@Injectable({
    providedIn: 'root',
})
export class ProductManagementService {

    constructor(private http: HttpClient) { }

    // public methods
    all(): Observable<any> {
        return this.http.get<ResultModel<ProductModel[]>>(`${API_PRODUCT_URL}/All`);
    }

    paging(pageNumber: number, pageSize: number): Observable<ResultModel<PagingResult<ProductModel[]>>> {
        return this.http.get<ResultModel<PagingResult<ProductModel[]>>>(`${API_PRODUCT_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize) });
    }

    getById(id: number): Observable<ResultModel<ProductModel>> {
        return this.http.get<ResultModel<ProductModel>>(`${API_PRODUCT_URL}/${id}`);
    }

    save(data: ProductModel): Observable<ResultModel<ProductModel>> {
        return this.http.post<ResultModel<ProductModel>>(`${API_PRODUCT_URL}/Save`, data);
    }

    edit(data: ProductModel): Observable<ResultModel<ProductModel>> {
        return this.http.post<ResultModel<ProductModel>>(`${API_PRODUCT_URL}/Update`, data);
    }

    delete(id: number): Observable<ResultModel<ProductModel>> {
        return this.http.delete<ResultModel<ProductModel>>(`${API_PRODUCT_URL}/Delete/${id}`);
    }

    upload(data: FormData): Observable<ResultModel<FileModel>> {
        return this.http.post<ResultModel<FileModel>>(`${API_FILE_URL}/Save`, data);
    }
}
