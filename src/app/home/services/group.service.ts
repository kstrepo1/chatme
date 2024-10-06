import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(public http:HttpClient) { }

  getGroupList(sessionId:any){
    return this.http.post<any>('http://localhost:3001/api/getGroups', {sessionId: sessionId})
  }

  newGroup(groupname:any, channels:any[], groupAdminAccess:any[], createdby:any[]){
    return this.http.post<any>('http://localhost:3001/api/createGroup', {groupname: groupname, channels: channels, groupAdminAccess: groupAdminAccess, createdby:createdby })
  }

  joinGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/joinGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  leaveGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/leaveGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  addChannel(searchUserID:any, groupID:any, channels:string){
    return this.http.post<any>('http://localhost:3001/api/addChannel', {searchUserID: searchUserID, groupID: groupID, channels: channels })
  }

  deleteGroup(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/deleteGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  getMessages(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/getChats', {searchUserID: searchUserID, groupID: groupID })
  }

  sendImage(formData:any){
    return this.http.post<any>('http://localhost:3001/api/fileSend', formData)
  }
}
