import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;

  btnDisavled = false;

  constructor(private router: Router,
              private data:DataService,
              private rest:RestApiService) { }

  ngOnInit() {
  }

  validate(){
    if(this.name){
       if(this.email){
              if(this.password){
                  if(this.password1){
                    if(this.password === this.password1){
                      return true;
                    }else{
                      this.data.error('Passwords do not match.');
                    }
                  }else{
                    this.data.error('Confirmation Password is not entered');
                  }
              }else{
                this.data.error('Password is not entered');
              }
       }else{
         this.data.error('Email is not entered.');
       }
    }else{
      this.data.error('Name is not entered.');
    }
  }

  async register(){
    this.btnDisavled = true;
    try{
        if(this.validate()){
          const data = await this.rest.post(
            'http://localhost:3030/api/accounts/signup',
            {
              name: this.name,
              email: this.email,
              password: this.password,
              isSeller: this.isSeller
            }
          );
          if(data['success']){
            localStorage.setItem('token',data['token']);
         //   this.data.success('Registration Successful!');
            await this.data.getProfile();//appel la methode getProfil quand l'user s'est bien connecté
            this.router.navigate(['profile/address'])
              .then(()=>{
                this.data.success(
                    'Registration Successful! Please enter your shipping address below.'
                );
              }).catch(error => this.data.error(error));
          }else{
            this.data.error(data['message']);
          }
        }
    }catch(error){
      this.data.error(error['message']);
    }
    this.btnDisavled = false;
  }

}
