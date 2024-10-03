import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(public http:HttpClient) { }

  getGroupList(sessionId:any){
    return this.http.post<any>('http://localhost:3000/api/getGroups', {sessionId: sessionId})
  }

  newGroup(groupname:any, channels:any[], groupAdminAccess:any[], createdby:any[]){
    return this.http.post<any>('http://localhost:3000/api/createGroup', {groupname: groupname, channels: channels, groupAdminAccess: groupAdminAccess, createdby:createdby })
  }

  joinGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3000/api/joinGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  leaveGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3000/api/leaveGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  addChannel(searchUserID:any, groupID:any, channels:string){
    return this.http.post<any>('http://localhost:3000/api/addChannel', {searchUserID: searchUserID, groupID: groupID, channels: channels })
  }

  deleteGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3000/api/deleteGroup', {searchUserID: searchUserID, groupID: groupID })
  }
}
