import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  title = 'chatme';
  credentials:any;
  username:string = "";
  email:string = "";
  validuser:boolean = false;
  roles:any;
  groups:any;

  constructor (private router:Router,
    @Inject(PLATFORM_ID) private platformID: object
  ){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.validuser = true
          this.credentials = credcheck
          this.username = credcheck.username
          this.email = credcheck.email;
          this.roles = credcheck.roles;
          this.groups = credcheck.groups;
        }
      } catch {
        console.log('error on profile component')
      }
    }
  }
}
