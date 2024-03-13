import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API_ORDER_URL = `${environment.apiUrl}/Order`;

@Injectable({
    providedIn: 'root',
})
export class BasketManagementService {

    constructor(private http: HttpClient) { }

    // public methods
   
}
