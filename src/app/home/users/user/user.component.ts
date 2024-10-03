import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  //Variables for the user page 
  userid:any;
  thisuserinfo:any = {username:"", email:""}
  userinfo:any = {username:"", email:""};
  currentuserrole:any;
  promoteusersuperadmin:any = false;
  promoteusergroupadmin:any = false;
  deleteuseravailable:boolean = false;
  usergroups:any;

  //Constructor uses activated route to determine which user to load. 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private group:GroupService,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService
  ){
    this.activatedRoute.params.subscribe(params => this.userid = params["id"])
  }

  ngOnInit(){

    this.UserService.getUserInfo(1,this.userid).subscribe( (data)=>{
      this.userinfo = data[0]
    })

    if(isPlatformBrowser(this.platformID)){
      try{
        let localsession:any =   localStorage.getItem("session");

        this.UserService.sessionValid(localsession).subscribe ( (data)=>{
          this.thisuserinfo = data.userDetails[0]
          this.currentuserrole = data.userDetails[0].roles

        //Promote Eligibility Check 
        for(let i=0; i<this.currentuserrole.length; i++){
          if(this.currentuserrole[i]=="SuperAdmin"){
            this.promoteusersuperadmin = true;
            this.deleteuseravailable = true;
          }
          if(this.currentuserrole[i]=="GroupAdmin"){
            this.promoteusergroupadmin = true;
          }
        }
      
        for(let i=0; i<this.userinfo.roles.length; i++){
          if(this.userinfo.roles[i]=="SuperAdmin"){
            this.promoteusersuperadmin = false;
          }
          if(this.userinfo.roles[i]=="GroupAdmin"){
            this.promoteusergroupadmin = false;
          }
        }
    
        //Checks user groups that viewed user belongs to for showing on view. 
        this.usergroups = [];
        this.group.getGroupList(localsession).subscribe((data)=>{
          let fullgrouplist = data
          console.log(this.userinfo.groups);
          for(let a=0; a<this.userinfo.groups.length; a++){
            for(let b = 0; b<fullgrouplist.length; b++){
              if(this.userinfo.groups[a]== fullgrouplist[b].id){
                this.usergroups.push(fullgrouplist[b].groupname)
              }
            }
          }
          console.log(fullgrouplist);
        })

      

      })} catch {
        //this.validuser = false
        this.router.navigate(['login']);
      }
    } else {
      this.currentuserrole = [];
    }
  }


  promoteToGroupAdmin(){
    this.UserService.promoteUser(this.thisuserinfo._id, this.userinfo._id, "GroupAdmin" ).subscribe( (data)=>{
      console.log(data);
      location.reload();
    })
      
  }

  promoteToSuperAdmin(){
    this.UserService.promoteUser(this.thisuserinfo._id, this.userinfo._id, "SuperAdmin" ).subscribe( (data)=>{
      console.log(data);
      location.reload();
    })
  }


}
    

