import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';

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

  constructor(private groups:GroupService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object
  ){
  }

  ngOnInit(){
    this.grouplist = this.groups.getGroupList();
    console.log(this.grouplist);

    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.curentuserrole = credcheck.roles;
          this.currentusergroups = credcheck.groups;
        }
      } catch {
        console.log('error on user component')
      }
    } else {
      this.curentuserrole = [];
      this.currentusergroups = [];
    }

    //Checks if a user has joined the group already. 
    let authgroupcheck = [];
    let matched = false
    for(let a=0; a<this.grouplist.length;a++){
      matched = false
      for(let b=0; b<this.currentusergroups.length;b++){
        
        if(this.grouplist[a].id == this.currentusergroups[b]){
          console.log("match");
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
    console.log(this.curentuserrole);
    for(let a =0; a<this.curentuserrole.length; a++){
      if(this.curentuserrole[a]=="GroupAdmin" || this.curentuserrole[a]=="SuperAdmin"){
        this.canCreateGroup = true;
      }
    }
  }

  createNewGroup(){
    this.router.navigate(['newgroup']);
  }


}
