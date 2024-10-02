import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-newgroup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './newgroup.component.html',
  styleUrl: './newgroup.component.scss'
})
export class NewgroupComponent {

  newchannels:any[] = [];
  newchannel:any = "";
  groupName:string = "";
  currentUserID:any;
  localsession:any;

  groupAdminAccess:any = [];

  constructor(private group:GroupService,
    private router:Router,
    private UserService:UserService,
    @Inject(PLATFORM_ID) private platformID: object
  ){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      //Session Check 
      try{
        this.localsession =  localStorage.getItem("session");
        this.UserService.sessionValid(this.localsession).subscribe ( (data)=>{
          if(data.valid){
            let currentuserinfo = data.userDetails;
            this.currentUserID = currentuserinfo[0]._id
          } 
        })
      } catch {
        console.log('error on new Group component');

      }
    }
  }

  addChanel(){
    this.newchannels.push(this.newchannel);
    this.newchannel = "";
  }

  addGroup(){
    console.log("action")
    this.group.newGroup(this.groupName, this.newchannels, this.currentUserID, this.currentUserID).subscribe( (data)=>{
      console.log(data);
      if(data.successGroupAdd){
        this.router.navigate(['groups']);
      }
    })
  }

}
