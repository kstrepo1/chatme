import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  grouplist:any;
  curentuserrole:any;
  currentusergroups:any;
  canCreateGroup:any = false;
  localsession:any;

  constructor(private groups:GroupService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService
  ){
  }

  ngOnInit(){


    if(isPlatformBrowser(this.platformID)){
      try{
        this.localsession =  localStorage.getItem("session");
        this.UserService.sessionValid(this.localsession).subscribe ( (data)=>{

          if(data.valid){
            this.curentuserrole = data.userDetails[0].roles;
            this.currentusergroups = data.userDetails[0].groups
          }


        this.groups.getGroupList(this.localsession).subscribe((data:any)=>{
          this.grouplist = data
          console.log(data)
    
          //Checks if a user has joined the group already. 
          let authgroupcheck = [];
          let matched = false
          for(let a=0; a<this.grouplist.length;a++){
            matched = false
            for(let b=0; b<this.currentusergroups.length;b++){
              
              if(this.grouplist[a].id == this.currentusergroups[b]){
                authgroupcheck.push({id:a, joined:true, groupname: this.grouplist[a].groupname, channels: this.grouplist[a].channels , groupAdminAccess: this.grouplist[a].groupAdminAccess})
                matched = true
              } 
            }
            if(!matched){
              authgroupcheck.push({id:a, joined:false, groupname: this.grouplist[a].groupname, channels: this.grouplist[a].channels , groupAdminAccess: this.grouplist[a].groupAdminAccess})
            }
          }
          this.grouplist = authgroupcheck
    
          //Checks to see if current user can create groups
          for(let a =0; a<this.curentuserrole.length; a++){
            if(this.curentuserrole[a]=="GroupAdmin" || this.curentuserrole[a]=="SuperAdmin"){
              this.canCreateGroup = true;
            }
          }
        })
      });


      } catch {
        console.log('error on user component')
      }
      } else {
        this.curentuserrole = [];
        this.currentusergroups = [];
    }

    
  }

  createNewGroup(){
    this.router.navigate(['newgroup']);
  }

  groupView(groupid:any){
    this.router.navigate(['group/'+groupid]);
  }


}
