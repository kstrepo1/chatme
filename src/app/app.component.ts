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
          console.log("valid")
          this.validuser = true
          this.credentials = credcheck
          this.username = credcheck.username
        }
      } catch {
        console.log('notvalid');
        this.validuser = false
        this.router.navigate(['login']);
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
