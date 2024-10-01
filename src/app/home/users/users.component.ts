import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService
  ){}

  userlist:any;
  curentuserrole:any;
  addUserActive:Boolean = false;
  newUserEmail:any;
  newUserUsername:any;
  credcheck:any;

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try{


        let localsession:any =   localStorage.getItem("session");
        this.UserService.sessionValid(localsession).subscribe ( async(data)=>{
          console.log(data);
          
      })} catch {
        //this.validuser = false
        this.router.navigate(['login']);
      }
    } else {
      this.curentuserrole = [];
    }
    

    this.UserService.getUserList(this.credcheck).subscribe( (data)=>{
      this.userlist = data;
      console.log(this.userlist)
    });

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

  async addNewUser(){
    this.UserService.addNewUser({"email": this.newUserEmail, "username": this.newUserUsername}).subscribe ( (data)=>{
      console.log(data);
      try{
        this.userlist.push(data[0]);
        this.addUserActive = false;
        this.newUserEmail = "";
        this.newUserUsername = "";

      }
      catch{
        console.log('add new user error')
      }
    })
  }

}
