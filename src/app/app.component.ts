import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './home/services/user.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatme';
  credentials:any;
  username:string = "";
  validuser:boolean = false;
  canSeeRequests:boolean = false;
  currentuserrole:any;
  localsession:any;
  avatar:any;

  constructor (
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService
  ){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try{

        this.localsession =  localStorage.getItem("session");
        if(this.localsession != undefined){
          this.UserService.sessionValid(this.localsession).subscribe ( (data)=>{
          console.log(data);
          if(data.valid){
              this.validuser = true
              this.credentials = data.userDetails;
              this.username = data.userDetails[0].username
              this.currentuserrole = data.userDetails[0].roles;
              this.avatar = data.userDetails[0].avatarPath;

              for(let i=0; i<this.currentuserrole[0].length; i++){
                if(this.currentuserrole[i]=="SuperAdmin"){
                  this.canSeeRequests = true;
                }
              }

            } else {
              this.validuser = false
              this.router.navigate(['login']);
            }
          })
        } else {
          this.router.navigate(['login']);
        }

      } catch {
        this.validuser = false
        this.router.navigate(['login']);
      }
    }else {
      this.currentuserrole = [];
    }
  }

  logout(){
    if(isPlatformBrowser(this.platformID)){
      localStorage.removeItem("session");
      window.location.replace("/");
      this.validuser = false;

      this.UserService.logOut(this.localsession).subscribe()
    }
  }

  groups(){
    this.router.navigateByUrl('/groups')
  }

  users(){
    this.router.navigate(["users"])
  }

  requests(){
    this.router.navigate(['requests'])
  }


}
