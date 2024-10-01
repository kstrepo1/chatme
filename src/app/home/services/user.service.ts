import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http:HttpClient) { }

  addNewUser(user:any){
    return this.http.post<any>('http://localhost:3000/api/adduser', {userDetails: user})
  }

  getUserList(currentUser:any){
    return this.http.post<any>('http://localhost:3000/api/getUserList', {currentUserID: currentUser})
  }

  getUserInfo(currentUser:any, userID:any){
    return this.http.post<any>('http://localhost:3000/api/getUser', {currentUserID: currentUser, searchUserID: userID})
  }

}
