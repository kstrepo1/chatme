import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }

  grouplist = [
    {groupname: "Group One", id: 0, channels:["Main", "Second", "Other"], groupAdminAccess: ["102"]}, 
    {groupname: "Group Two", id: 1, channels:["Main", "Alternative", "Wine"], groupAdminAccess: ["102"]}, 
    {groupname: "Group Three", id: 2, channels:["Main", "Other"], groupAdminAccess: ["102", "103"]}, 
    {groupname: "Group Four", id: 3, channels:["General", "Alt", "Other"], groupAdminAccess: ["103"]}, 
    
  ]


  getGroupList(){
    return this.grouplist
  }


  newGroup(groupname:any, channels:any[], groupAdminAccess:any[]){
    let id: number = this.grouplist.length+1
    let name = groupname;
    let channel = channels 
    let groupAdminAccesss = groupAdminAccess
    this.grouplist.push({groupname: name, id: id, channels: channel, groupAdminAccess: groupAdminAccesss})
  }
}
