import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ProductModel } from "src/app/modules/product-management/models/product.model";


@Injectable({
    providedIn: 'root',
  })
  export class BasketService {
    private _basket$ = new BehaviorSubject<ProductModel[]>([])
    public basket$ = this._basket$.asObservable()

    private _localStorage: Storage;

    constructor() {
        this._localStorage = localStorage;
     }

    
    setBasket(data: ProductModel[]) {
        this._basket$.next([])

        const jsonData = JSON.stringify(data)
        this._localStorage.setItem('basket', jsonData)
        this._basket$.next(data)
    }

    loadBasket() {
        const data = JSON.parse(this._localStorage.getItem('basket') as string) as ProductModel[];
        this._basket$.next(data)
    }
}