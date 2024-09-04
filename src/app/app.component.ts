import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


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

  constructor (
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        console.log(credcheck);
        if(credcheck.valid){
          this.validuser = true
          this.credentials = credcheck
          this.username = credcheck.username
          this.currentuserrole = credcheck.roles;
        }
      } catch {
        this.validuser = false
        this.router.navigate(['login']);
      }
    }else {
      this.currentuserrole = [];
    }
  

    for(let i=0; i<this.currentuserrole.length; i++){
      if(this.currentuserrole[i]=="SuperAdmin"){
        this.canSeeRequests = true;
      }
    }
  }

  logout(){
    if(isPlatformBrowser(this.platformID)){
      localStorage.removeItem("credentials");
      window.location.replace("/");
      this.validuser = false
    }
  }


}
