import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductModel } from 'src/app/modules/product-management/models/product.model';
import { BasketService } from './basket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {

  total: string = "0";
  basket: ProductModel [] = [];

  constructor(private basketService: BasketService, private router: Router) {}

  ngOnInit(): void {
    this.basketService.loadBasket();
    this.basketService.basket$.subscribe(result => {
      this.basket = result;
      
      let totalPrice = 0;
      this.basket.forEach(product => {
        totalPrice += product.price;
      })

      this.total = totalPrice.toFixed(2);
    })
  }

  showBasket() {
    this.router.navigate(['/basketmanagement']);
  }
  
}
