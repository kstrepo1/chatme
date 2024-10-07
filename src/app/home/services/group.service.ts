import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const coreURL = 'http://localhost:3001'

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(public http:HttpClient) { }

  getGroupList(){
    return this.http.get<any>('http://localhost:3001/api/getGroups')
  }

  newGroup(groupname:any, channels:any[], groupAdminAccess:any[], createdby:any[]){
    return this.http.post<any>('http://localhost:3001/api/createGroup', {groupname: groupname, channels: channels, groupAdminAccess: groupAdminAccess, createdby:createdby })
  }

  joinGroup(userID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/joinGroup', {_id: userID, groupID: groupID })
  }

  leaveGroup(searchUserID:any, groupID:any){
    return this.http.put<any>('http://localhost:3001/api/leaveGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  deleteGroup(searchUserID:any, groupID:any){
    return this.http.put<any>('http://localhost:3001/api/deleteGroup', {searchUserID: searchUserID, groupID: groupID })
  }

  addChannel(searchUserID:any, groupID:any, channels:string){
    return this.http.post<any>('http://localhost:3001/api/addChannel', {searchUserID: searchUserID, groupID: groupID, channels: channels })
  }

  getApprovalList(){
    return this.http.get<any>(coreURL+'/api/approvalList')
  }

  requestApprovalToJoin(request:any){
    return this.http.post<any>(coreURL+ '/api/requestApprovalToJoinGroup', request)
  }

 declineApprovaltoJoin(objectID:any){
    return this.http.delete(coreURL+'/api/declineapproval/'+objectID)
 } 

  getMessages(searchUserID:any, groupID:any){
    return this.http.post<any>('http://localhost:3001/api/getChats', {searchUserID: searchUserID, groupID: groupID })
  }

  sendImage(formData:any){
    return this.http.post<any>('http://localhost:3001/api/fileSend', formData)
  }
}
