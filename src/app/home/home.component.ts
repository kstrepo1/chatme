import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { GroupService } from './services/group.service';
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


  this.router.navigate(['groups']);
}
}
