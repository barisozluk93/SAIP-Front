import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AlertComponent } from '../alert/alert.component';
import { BasketService } from 'src/app/_metronic/partials/layout/basket/basket.service';
import { BasketManagementService } from './basket-management.service';
import { BasketModel } from './models/basket.model';
import { ProductModel } from '../product-management/models/product.model';

@Component({
  selector: 'app-basket-management',
  templateUrl: './basket-management.component.html',
  styleUrls: ['./basket-management.component.scss'],
})
export class BasketManagementComponent implements OnInit, OnDestroy {

  @ViewChild('deleteConfirmationComponent') private deleteConfirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  header: string = "Sepetim";
  basket: BasketModel[] = [];
  basketFromStorage: ProductModel[] = [];
  numberOfItem: number = 0;
  totalPrice: number = 0;

  constructor(private basketManagementService: BasketManagementService, private basketService: BasketService) {
  }

  confirm(event: any) {

  }

  delete(event: number) {
    
      let temp: ProductModel[] = [];
      this.basketFromStorage.forEach(item => {
        if(item.id != event) {
          temp.push(item);
        }
      })

      this.basketService.setBasket(temp);
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.basketService.basket$.subscribe(result => {
      this.numberOfItem = 0;
      this.totalPrice = 0;
      this.basket = [];

      this.basketFromStorage = result;

      result.forEach(item => {
        this.numberOfItem += 1;
        this.totalPrice += item.price;
        
        if(this.basket.length == 0) {
          this.basket.push({id: item.id, name: item.name, fileResult: item.fileResult, numberOf: 1, price: item.price});
        }
        else{
          let itemInBasket = this.basket.filter(f => f.id == item.id);
          if(itemInBasket.length > 0) {
            itemInBasket[0].numberOf += 1;
            itemInBasket[0].price += item.price;
          }
          else{
            this.basket.push({id: item.id, name: item.name, fileResult: item.fileResult, numberOf: 1, price: item.price});
          }
        }
      })
    });
  }

  openDeleteModal(id: number) {
    this.deleteConfirmationComponent.openModal('Delete', id);
  }
}
