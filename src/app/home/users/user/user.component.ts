import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthcheckService } from '../../../services/authcheck.service';
import { GroupService } from '../../../services/group.service';

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
  userinfo:any;
  currentuserrole:any;
  promoteusersuperadmin:any = false;
  promoteusergroupadmin:any = false;
  deleteuseravailable:boolean = false;
  usergroups:any;

  //Constructor uses activated route to determine which user to load. 
  constructor(
    private activatedRoute: ActivatedRoute,
    private authcheck:AuthcheckService,
    private router:Router,
    private group:GroupService,
    @Inject(PLATFORM_ID) private platformID: object
  ){
    this.activatedRoute.params.subscribe(params => this.userid = params["id"])
  }

  ngOnInit(){
    this.userinfo = this.authcheck.getUser(this.userid);
    console.log(this.userinfo);

    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.currentuserrole = credcheck.roles;
        }
      } catch {
        console.log('error on user component');
        this.currentuserrole = [];
      }
    } else {
      this.currentuserrole = [];
    }


    console.log(this.currentuserrole);

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
    let fullgrouplist = this.group.getGroupList()
    console.log(fullgrouplist);

    for(let a=0; a<this.userinfo.groups.length; a++){
      for(let b = 0; b<fullgrouplist.length; b++){
        if(this.userinfo.groups[a]== fullgrouplist[b].id){
          this.usergroups.push(fullgrouplist[b].groupname)
        }
      }
    }

  }





}


