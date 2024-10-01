import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthcheckService } from '../home/services/authcheck.service';

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

  constructor (private authcheck:AuthcheckService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object,
    private userService:UserService
  ){ }


  //On init angualr checks if there is a local storage credential 
  ngOnInit(){
    // if(isPlatformBrowser(this.platformID)){
    //   try {
    //     let credc:any = localStorage.getItem("credentials");
    //     let credcheck:any = JSON.parse(credc);
    //     console.log(credcheck);
    //     if(credcheck.valid){
    //       console.log("valid")
    //       this.router.navigate(['home']);
    //     } else {
    //       this.router.navigate(['login'])
    //     }
    //   } catch {
    //     console.log("No Authentication Token Detected");
    //   }
    // }
  }

  signin(){
    console.log(this.emailaddress, this.password);
    let signin = this.authcheck.credCheck(this.emailaddress,this.password);
    this.userService.login(this.emailaddress, this.password).subscribe( (data)=>{
      console.log('login data from proxy');
      console.log(data)
      localStorage.setItem("session", data.session);
      if(data.valid){
        window.location.replace("/home");
      }
    })
    console.log(signin);
    if(signin.valid){
      let creds = JSON.stringify(signin)
      localStorage.setItem("credentials", creds);
    } else {
      this.error = "Password Error, Please Try Again."
    }

  }

}
