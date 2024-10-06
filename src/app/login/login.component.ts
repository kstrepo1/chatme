import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { UserService } from '../home/services/user.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  emailaddress:string ="super@super.com";
  password:string= "";
  error:string="";

  constructor (
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object,
    private userService:UserService
  ){ }


  //On init angualr checks if there is a local storage credential 
  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try {
        let credc:any = localStorage.getItem("session");

        if (credc!=undefined){
          this.userService.sessionValid(credc).subscribe( (data)=>{
            console.log(data);
            if(data.valid){
              this.router.navigate(['home']);
            } else {
              console.log("No Authentication Token Detected");
            }
          })
        }

      } catch {
        console.log("Error in login component");
      }
    }
  }

  signin(){
    this.userService.login(this.emailaddress, this.password).subscribe( (data)=>{
      if(data.valid){
        localStorage.setItem("session", data.session);
        window.location.replace("/home");
      } else {
        this.error="Sign Error, Please Try Again"
      }
    })
  }
}
