import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  grouplist:any;
  currentusergroups:any;
  usersgrouplist:any[] = [];

  constructor(private groups:GroupService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformID: object
  ){
  }

  ngOnInit(){
    this.grouplist = this.groups.getGroupList();
    console.log(this.grouplist)

    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.currentusergroups = credcheck.groups;
          console.log(this.currentusergroups)
        }
      } catch {
        console.log('error on user component');
      }
    } else{
      this.currentusergroups= []
    }

    //Checks which groups a user is currently in.
    for(let a=0; a<this.grouplist.length;a++){
      for(let i=0; i<this.currentusergroups.length;i++){
        let reference = this.currentusergroups[i];
        if(this.grouplist[a].id==reference){
          this.usersgrouplist.push(this.grouplist[a]);
        }
      }
    }
    console.log(this.usersgrouplist);

  }


  groupView(g:any){
    console.log(g);
    this.router.navigate(["group/"+g])
  }

}
