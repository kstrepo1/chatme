import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthcheckService } from '../../../authcheck.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  userid:any;
  userinfo:any;

  //Constructor uses activated route to determine which user to load. 
  constructor(private activatedRoute: ActivatedRoute,
    private authcheck:AuthcheckService
  ){
    this.activatedRoute.params.subscribe(params => this.userid = params["id"])
  }

  ngOnInit(){
    this.userinfo = this.authcheck.getUser(this.userid);
    console.log(this.userinfo);
  }

}
