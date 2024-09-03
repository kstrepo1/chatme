import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../services/group.service';
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

  groupAdminAccess:any = [];

  constructor(private group:GroupService,
    private router:Router
  ){}

  addChanel(){
    this.newchannels.push(this.newchannel);
    this.newchannel = "";
  }

  addGroup(){
    this.group.newGroup(this.groupName, this.newchannels, this.groupAdminAccess);
    this.router.navigate(['groups']);
  }

}
