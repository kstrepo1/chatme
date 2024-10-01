import { Injectable } from '@angular/core';
import groups from './groups.json'

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor() { }

  grouplist = groups.grouplist;

  getGroupList(){
    //console.log(this.grouplist);
    return this.grouplist
  }


  newGroup(groupname:any, channels:any[], groupAdminAccess:any[], createdby:any[]){
    let id: number = this.grouplist.length+1
    let name = groupname;
    let channel = channels 
    let groupAdminAccesss = groupAdminAccess
    let created = createdby
    this.grouplist.push({groupname: name, id: id, channels: channel, groupAdminAccess: groupAdminAccesss, createdby: created})
  }
}
