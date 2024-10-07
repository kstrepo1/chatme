import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupService } from '../home/services/group.service';
import { UserService } from '../home/services/user.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {

  approvalList:any;
  userlist:any;
  grouplist:any;
  approvalListCleaned:any;

  constructor(private groups:GroupService,
    private users:UserService
  ){}

  ngOnInit(){

    this.groups.getApprovalList().subscribe((data:any) => {
      this.approvalList = data
      console.log(this.approvalList);
      this.groups.getGroupList().subscribe((data:any) => {
        this.grouplist = data;
        console.log(data);
        this.users.getUserList().subscribe((data:any)=> {
          this.userlist = data
          console.log(data)
          this.sortData()
        });
      });
    });
  }

  sortData(){
    this.approvalListCleaned = []
    for(let entry of this.approvalList){
      for(let user of this.userlist){
        if(user._id==entry.userID){
          let listing = {
            userId: user._id, 
            approvalId: entry._id, 
            groupName: this.grouplist[entry.groupID].groupname,
            username: user.username,
            groupID: entry.groupID
            }
          console.log(listing);
          this.approvalListCleaned.push(listing);
        }
      }
    }
  }

  approveGroupEntry(userID:any, groupID:any){
    this.groups.joinGroup(userID, groupID).subscribe(data => {
      console.log(data);
      location.reload();
    });
  }

  declineApproval(approvalID:any){
    this.groups.declineApprovaltoJoin(approvalID).subscribe( (data)=>{
      console.log(data)
      location.reload();
    })
  }

}
