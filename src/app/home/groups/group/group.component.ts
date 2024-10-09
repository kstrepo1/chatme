import { Component,Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { SocketioService } from '../../services/socketio.service';
import { ToastrService } from 'ngx-toastr';
import { Peer } from "peerjs"
import { map } from 'rxjs';


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
  groupChannels:any;
  groupMembers:any;
  currentuserinfo:any;
  curentuserrole:any = [];
  currentusergroups:any = [];
  currentUserJoined:boolean = false;
  currentUserID:any;

  canaddchanel:boolean = false;
  addingChannel:Boolean = false;
  newChannelName:any;
  options:Boolean = false;
  channelSelected:any;
  localsession:any
  approvaltoJoin:boolean = false;
  showAttachmentDiv:boolean = false;
  chatHistory:any = []

  socket:any  
  ioConnection:any;
  ioConnection2:any;
  messagecontent:any = "";
  fileUpload:any;
  avatar:any;
  peer:any;
  channelError:any;



  //Constructor uses activated route to determine which user to load. 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private group:GroupService,
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService,
    public SocketioService:SocketioService,
    private toastr:ToastrService
  ){
    this.activatedRoute.params.subscribe(params => this.groupid = params["id"]);
  }

  ngOnInit(){


    if(isPlatformBrowser(this.platformID)){
      try{
        this.localsession =  localStorage.getItem("session");
        this.peer = new Peer(this.localsession);
        this.UserService.sessionValid(this.localsession).subscribe ( (data)=>{
          if(data.valid){
            this.currentuserinfo = data.userDetails;

            this.curentuserrole = data.userDetails[0].roles;
            this.avatar = data.userDetails[0].avatarPath;
            this.getGrouplist();
            for(let i=0; i<this.curentuserrole.length; i++){
              if(this.curentuserrole[i]=="SuperAdmin"){
                this.curentuserrole = true;
                this.approvaltoJoin = false;
                this.canaddchanel = true;
              } else if(this.curentuserrole[i] == "GroupAdmin"){
                this.canaddchanel = true;
              } else {
                this.approvaltoJoin = true;
              }

            }
            this.currentusergroups = this.currentuserinfo[0].groups;


                //Join Check
            for(let i=0; i<this.currentusergroups.length; i++){
              if(this.currentusergroups[i] == this.groupid){
                this.currentUserJoined = true
              }
            }

          } else {
            this.router.navigate(['login']); 
          }

          this.group.getMessages(this.localsession, this.groupid).subscribe ( (data)=>{
            for(let i=0;i<data.length;i++){
              this.chatHistory.push(data[i].message)
            };
            console.log(this.chatHistory);
          });
          //Check if user is approved for this group before initatiing sockets
          if(this.currentUserJoined){
            this.initIoConnection();
          }

        })
      } catch {
        console.log('error on user component');
        this.curentuserrole= [];
      } 
    }


    this.UserService.getUserList().subscribe((data) => {
      let matchedUsers = [];
      
      for (let user of data) {
        if (user.groups.includes(this.groupid)) {
          matchedUsers.push(user);
        }
      }
      
      this.groupMembers = matchedUsers;
    });


    
  }

   async initIoConnection(){
    this.SocketioService.initSocket();
    this.ioConnection = this.SocketioService.onMessage()
    .subscribe((message:any) => {
      console.log(message)
      this.chatHistory.unshift(message);
      console.log(this.chatHistory)
    });

    this.ioConnection2 = this.SocketioService.onJoin()
    .subscribe((joinMessage:any) => {
      setTimeout(()=>{
        console.log(joinMessage)
        if(joinMessage.user != this.currentuserinfo[0].username){
          if(joinMessage.groupid === this.groupid){
            this.groupJoinToastActivate(joinMessage)
          }
        }
      },1500)
    })
  }

    
  //Navigate back to groups 
  navgroups(){
    this.router.navigate(['groups'])
  }

  getGrouplist(){
    this.group.getGroupList().subscribe((data)=>{
      this.groupName = data[this.groupid].groupname;
      this.groupChannels = data[this.groupid].channels;
      this.channelSelected=this.groupChannels[0];
      this.SocketioService.join({user: this.currentuserinfo[0].username, group: this.groupName, groupid: this.groupid})
    });
  }

  //Add new channel function
  addChanel(name:any){

    if(this.addingChannel){
      console.log(name)
      if(name=="" || name == undefined){
        this.channelError = "Please Enter A Name"
      } else {
        this.channelError = null
        this.group.addChannel(this.currentuserinfo, this.groupid, name).subscribe(data => {
          if(data.ChannelSuccessAdd){
            this.addingChannel = false;
            this.groupChannels.push(name);
            this.newChannelName = "";
          }
        });
      }

    } else {
      this.addingChannel = true;
    }



  }
//Toggles the options button
  toggleOptions(){
    if(this.options){
      this.options = false;
    } else {
      this.options = true;
    }
  }

  selectedChannel(channel:any){
    this.channelSelected = channel;
  }

  joinGroup(){
    this.group.joinGroup(this.currentuserinfo[0]._id, this.groupid,).subscribe(data => {
      console.log(data);
      location.reload();
    });
  }

  leaveGroup(){
    this.group.leaveGroup(this.currentuserinfo, this.groupid,).subscribe(data => {
      console.log(data);
      location.reload();
    });
  }

  deleteGroup(){
    this.group.deleteGroup(this.currentuserinfo, this.groupid).subscribe( data => {
      let d = data
      console.log(data);
      this.router.navigate(['groups'])
    }

    )
  }

  sendMessage(){
    console.log("sent");
    if(this.messagecontent){
      let transmission =   {
        username: this.currentuserinfo[0].username,
        _id: this.currentuserinfo[0]._id,
        groupID: this.groupid,
        groupName: this.groupName,
        channel: this.channelSelected,
        datetime: new Date(),
        message: this.messagecontent,
        image: false,
        avatar: this.avatar

      }
      this.SocketioService.send(transmission)
      this.messagecontent="";
      this.fileUpload=null;
    } 
  }

  sendFile(){
    const formData = new FormData();
    formData.append('file', this.fileUpload)
    console.log(formData)

    this.group.sendImage(formData).subscribe(
      (res) => {console.log(res)
        let transmission =   {
          username: this.currentuserinfo[0].username,
          _id: this.currentuserinfo[0]._id,
          groupID: this.groupid,
          groupName: this.groupName,
          channel: this.channelSelected,
          datetime: new Date(),
          image: true,
          fileOriginalName: res.originalname,
          filename: res.filename,
          path: res.path,
          avatar: this.avatar
        }

        this.SocketioService.send(transmission);
        this.attachFile()
      },
      (err) => console.log(err)
    )

  }

  attachFile(){
    if(this.showAttachmentDiv){
      this.showAttachmentDiv = false
      this.fileUpload = null;
    } else {
      this.showAttachmentDiv = true
    }
  }

  onFileChange(event:any){
    this.fileUpload = event.target.files[0];
    console.log(event);
  }

  requestToJoinGroup(){
    let request = {userID: this.currentuserinfo[0]._id, groupID: this.groupid}
    this.group.requestApprovalToJoin(request).subscribe((data)=> {
      console.log(data);
      if(data.requestedApproval){
        this.toastr.success('Approval Requested');
      }
    })
  }

  groupJoinToastActivate(data:any){
    this.toastr.info(data.user + ' Has Joined ');
  }
}
