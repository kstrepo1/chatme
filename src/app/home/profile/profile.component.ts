import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  //Variables for the user page 
  userid:any;
  username:any = ""
  email:any = "";
  currentuserrole:any;
  promoteusersuperadmin:any = false;
  promoteusergroupadmin:any = false;
  deleteuseravailable:boolean = false;
  usergroups:any;
  userinfo:any;
  password:any;
  avatar:any;
  fileUpload:any;
  fileUploaded:Boolean = false;
  fileUploadedName:any = "";
  fileUploadedPath:any;
  avatarUpdateButton:boolean = true;
  successfullUpdate:any;

  //Constructor uses activated route to determine which user to load. 
  constructor(
    private router:Router,
    private group:GroupService,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService
  ){
  }

  ngOnInit(){

//Pull Session token and get user data
    if(isPlatformBrowser(this.platformID)){
      try{
        let localsession:any =   localStorage.getItem("session");

        this.UserService.sessionValid(localsession).subscribe ( (data)=>{
          console.log(data.userDetails[0]);
        this.userinfo = data.userDetails[0]
        this.email = data.userDetails[0].email;
        this.username = data.userDetails[0].username;
        this.avatar = data.userDetails[0].avatarPath;
        console.log(this.avatar)

      })} catch {
        this.router.navigate(['login']);
      }
    }
  }



  sendFile(){
    const formData = new FormData();
    formData.append('file', this.fileUpload)

    this.group.sendImage(formData).subscribe(
      (res) => {
        console.log(res);
        this.fileUploaded = true
        this.fileUploadedName = res.originalname
        this.fileUploadedPath = res.path
        this.UserService.updateAvatarImage(this.userinfo, this.fileUploadedPath).subscribe((res)=>{
          console.log(res)
          location.reload();
        })
      },
      (err) => console.log(err)
    )
  }

  onFileChange(event:any){
    this.fileUpload = event.target.files[0];
  }

  updateAvatarButton(){
    if (this.avatarUpdateButton){
      this.avatarUpdateButton = false
    } else {
      this.avatarUpdateButton = true
    }
  }

  updateUserInfo(){
    let data = {
      username: this.username,
      email: this.email,
      password: this.password
    }
    this.UserService.updateUserDetails(this.userinfo, data).subscribe((res=>{
      console.log(res);
      if(res.updatedUserDetails){
      this.successfullUpdate = true
      } else {
        this.successfullUpdate = false
      }
    }))
  }

}
