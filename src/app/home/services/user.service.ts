import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  login(email:any, password:any){
    return this.http.post<any>('http://localhost:3000/api/login', {email: email, password: password})
  }

  sessionValid(sessionId:any){
    return this.http.post<any>('http://localhost:3000/api/session', {sessionId: sessionId})
  }

  logOut(sessionId:any){
    return this.http.delete(`http://localhost:3000/api/sessionlogout/${sessionId}`)
  }

  getGroupUserlist(groupid:any, currentUser:any): Observable<any[]>{
    return this.http.post<any>('http://localhost:3000/api/getUserList', {currentUserID: currentUser}).pipe( 
      map(fulluserlist => {
        let matchedusers = []
        for (let user of fulluserlist){
          if(user.groups.includes(groupid)){
            matchedusers.push(user);
          }
        }
        return matchedusers
      })
    )
  }

}
