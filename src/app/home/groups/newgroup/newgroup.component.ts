import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';

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

  groupAdminAccess:any = [];

  constructor(private group:GroupService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object
  ){}

  ngOnInit(){
    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.currentUserID = credcheck.id;
        }
      } catch {
        console.log('error on user component')
      }
    }
  }

  addChanel(){
    this.newchannels.push(this.newchannel);
    this.newchannel = "";
  }

  addGroup(){
    this.group.newGroup(this.groupName, this.newchannels, this.groupAdminAccess, this.currentUserID);
    this.router.navigate(['groups']);
  }

}
