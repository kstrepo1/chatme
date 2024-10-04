import { Component,Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
//import { AuthcheckService } from '../../services/authcheck.service';
import { UserService } from '../../services/user.service';
import { SocketioService } from '../../services/socketio.service';


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

  canaddchanel:boolean = false;
  addingChannel:Boolean = false;
  newChannelName:any;
  options:Boolean = false;
  channelSelected:any;
  localsession:any
  approvaltoJoin:boolean = false;
  chatHistory:any = [{username: "Username",
                      datetime: 1727940945077,
                      message: "New Message"
  }]

  socket:any  
  ioConnection:any;
  messagecontent:any = "";


  //Constructor uses activated route to determine which user to load. 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private group:GroupService,
    //private auth:AuthcheckService, *RM
    @Inject(PLATFORM_ID) private platformID: object,
    private UserService:UserService,
    public SocketioService:SocketioService
  ){
    this.activatedRoute.params.subscribe(params => this.groupid = params["id"])
  }

  ngOnInit(){
    this.groupName = this.group.getGroupList()[this.groupid].groupname;

    this.groupChannels = this.group.grouplist[this.groupid].channels;
    this.channelSelected=this.groupChannels[0];

    if(isPlatformBrowser(this.platformID)){
      try{
        let credc:any = localStorage.getItem("credentials");
        let credcheck:any = JSON.parse(credc);
        if(credcheck.valid){
          this.curentuserrole = credcheck.roles;
          this.currentuserinfo = credcheck
          this.currentusergroups = this.currentuserinfo.groups
        }
      } catch {
        console.log('error on user component');
        this.curentuserrole= [];
      }
    }
    // Can Add Channel Check 
    for( let x = 0; x<this.curentuserrole.length; x++){
      if(this.curentuserrole[x] == "GroupAdmin" || this.curentuserrole[x] == "SuperAdmin"){
        this.canaddchanel = true
      }
    }

                //Join Check
            for(let i=0; i<this.currentusergroups.length; i++){
              if(this.currentusergroups[i] == this.groupid){
                this.currentUserJoined = true
              }
            }

          } else {
            this.router.navigate(['login']);
          }
          this.initIoConnection();
        })
      } catch {
        console.log('error on user component');
        this.curentuserrole= [];
      }
    }

    this.group.getGroupList(this.localsession).subscribe((data)=>{
      this.groupName = data[this.groupid].groupname;
      this.groupChannels = data[this.groupid].channels;
      this.channelSelected=this.groupChannels[0];
    })

    this.UserService.getGroupUserlist(this.groupid, this.localsession).subscribe(matchedUsers => {
      this.groupMembers = matchedUsers;
    });
    
  }
  
  private initIoConnection(){
    this.SocketioService.initSocket();
    this.ioConnection = this.SocketioService.onMessage()
    .subscribe((message:any) => {
      console.log(message)
      this.chatHistory.push(message);
    })
  }
    
  //Navigate back to groups 
  navgroups(){
    this.router.navigate(['groups'])
  }

  //Add new channel function
  addChanel(name:any){
    if(this.addingChannel){
      this.addingChannel = false;
      this.groupChannels.push(name);
      this.newChannelName = "";

    } else {
      this.addingChannel = true;
    }
  }

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
    this.group.joinGroup(this.currentuserinfo, this.groupid,).subscribe(data => {
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
        message: this.messagecontent
      }
      this.SocketioService.send(transmission)
      this.messagecontent="";
    } 
  }


}
