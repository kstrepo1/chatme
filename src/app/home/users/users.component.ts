import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthcheckService } from '../services/authcheck.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private authcheck:AuthcheckService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object
  ){}

  userlist:any;
  curentuserrole:any;
  addUserActive:Boolean = false;

  ngOnInit(){
    this.userlist = this.authcheck.userlist();

    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.curentuserrole = credcheck.roles;
        }
      } catch {
        console.log('error on user component')
      }
    }

  }

  navUser(id:any){
    this.router.navigate(['user/'+id]);

  }

  addNewUserToggle(){
    if(!this.addUserActive){
      this.addUserActive = true;
    } else { 
      this.addUserActive = false;
    }

  }

}
