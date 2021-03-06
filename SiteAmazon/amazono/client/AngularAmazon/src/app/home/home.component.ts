import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
products : any;
  constructor(
    private data:DataService,
    private rest:RestApiService,
    private router : Router
  ) { }

 async ngOnInit() {
   try{
const data = await this.rest.get(
  'http://localhost:3030/api/products'
);
console.log(" liste des produits "+data['products']);
data['success']
  ? (this.products = data['products']) 
  : this.data.error('Could not fecth products.');
  
   }catch(error){
     this.data.error(error['message']);
   }
  }

  goToProduct(id){
    console.log("identifiant "+id);
    this.router.navigateByUrl('/product/'+id);
  }

}
