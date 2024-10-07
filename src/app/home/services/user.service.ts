import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http:HttpClient) { }

  //This route adds a new user
  addNewUser(user:any){
    return this.http.post<any>('http://localhost:3001/api/adduser', {userDetails: user})
  }

  //This route returns a user list
  getUserList(){
    return this.http.get<any>('http://localhost:3001/api/getUserList')
  }

  //This route returns a specific users details. 
  getUserInfo(userID:any){
    return this.http.get<any>(`http://localhost:3001/api/getUser/${userID}`)
  }

  //This route is the post request for login. 
  login(email:any, password:any){
    return this.http.post<any>('http://localhost:3001/api/login', {email: email, password: password})
  }

  //This route checks if a session is valid. 
  sessionValid(sessionId:any){
    return this.http.post<any>('http://localhost:3001/api/session', {sessionId: sessionId})
  }

  //This route removes session tokens from mongodb. 
  logOut(sessionId:any){
    return this.http.delete(`http://localhost:3001/api/sessionlogout/${sessionId}`)
  }

  //This route Applies new roles to a user, actioned by the superuser. 
  promoteUser(currentUserID:any, promoteUserID:any, typeOfPromotion:any){
    return this.http.post<any>('http://localhost:3001/api/promoteUser', {currentUserID:currentUserID, promoteUserID: promoteUserID, typeOfPromotion:typeOfPromotion})
  }

  //this route updates the users avatar
  updateAvatarImage(currentUserID:any, path:any){
    return this.http.put<any>('http://localhost:3001/api/updateAvatarImage', {currentUserID:currentUserID, path: path})
  }

  //this route updates the users details such as 
  updateUserDetails(currentUserID:any, data:any){
    return this.http.put<any>('http://localhost:3001/api/updateUser', {currentUserID:currentUserID, data: data })
  }

}
