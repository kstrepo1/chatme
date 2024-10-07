import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http:HttpClient) { }

  addNewUser(user:any){
    return this.http.post<any>('http://localhost:3001/api/adduser', {userDetails: user})
  }

  getUserList(){
    return this.http.get<any>('http://localhost:3001/api/getUserList')
  }

  getUserInfo(userID:any){
    return this.http.get<any>(`http://localhost:3001/api/getUser/${userID}`)
  }

  login(email:any, password:any){
    return this.http.post<any>('http://localhost:3001/api/login', {email: email, password: password})
  }

  sessionValid(sessionId:any){
    return this.http.post<any>('http://localhost:3001/api/session', {sessionId: sessionId})
  }

  logOut(sessionId:any){
    return this.http.delete(`http://localhost:3001/api/sessionlogout/${sessionId}`)
  }

  promoteUser(currentUserID:any, promoteUserID:any, typeOfPromotion:any){
    return this.http.post<any>('http://localhost:3001/api/promoteUser', {currentUserID:currentUserID, promoteUserID: promoteUserID, typeOfPromotion:typeOfPromotion})
  }

  updateAvatarImage(currentUserID:any, path:any){
    return this.http.put<any>('http://localhost:3001/api/updateAvatarImage', {currentUserID:currentUserID, path: path})
  }

  updateUserDetails(currentUserID:any, data:any){
    return this.http.post<any>('http://localhost:3001/api/updateUser', {currentUserID:currentUserID, data: data })
  }

}
