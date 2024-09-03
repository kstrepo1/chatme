import { Component,Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthcheckService } from '../../../services/authcheck.service';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  groupid:any;
  groupName:any;


    //Constructor uses activated route to determine which user to load. 
    constructor(
      private activatedRoute: ActivatedRoute,
      private authcheck:AuthcheckService,
      private router:Router,
      private group:GroupService,
      @Inject(PLATFORM_ID) private platformID: object
    ){
      this.activatedRoute.params.subscribe(params => this.groupid = params["id"])
    }

    ngOnInit(){
      this.groupName = this.group.getGroupList()[this.groupid].groupname
    }

}
