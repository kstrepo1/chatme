import { Injectable } from '@angular/core';
import authedusers from './authedusers.json'

@Injectable({
  providedIn: 'root'
})
export class AuthcheckService {

  authedusers:any = authedusers.authedusers;

  constructor() { 
  }

  //Check Signin

  credCheck(email:string, password:string){
    var user = {email: email, username: "", password: password, valid: false, id: "0", roles: [""], groups:[""]};

    for(let i=0; i<this.authedusers.length; i++){
      if(user.email == this.authedusers[i].email && user.password == this.authedusers[i].password){
        user = {
          email: this.authedusers[i].email, 
          username: this.authedusers[i].username,
          password: "",
          valid: true, 
          id: this.authedusers[i].id, 
          roles: this.authedusers[i].roles, 
          groups: this.authedusers[i].groups}
      } 
    }
    user.password = "";
    return user
  }

  //This returns a list of users
  userlist(){
    let userlist =[]
    for(let i=0; i<this.authedusers.length; i++){
      let user = {
        username: this.authedusers[i].username,
        email : this.authedusers[i].email,
        id: this.authedusers[i].id,
        roles: this.authedusers[i].roles,
        groups: this.authedusers[i].groups
      }
      userlist.push(user)
    }
    return userlist
  }

//This returns a specific users information
  getUser(id:string){
    let user:any;
    for(let i=0; i<this.authedusers.length; i++){
      if(id == this.authedusers[i].id){
        user = {
          email: this.authedusers[i].email, 
          username: this.authedusers[i].username,
          valid: true, 
          id: this.authedusers[i].id, 
          roles: this.authedusers[i].roles, 
          groups: this.authedusers[i].groups}
        return user
      } 
    }
  }

  getGroupUserList(groupid:any){
    let fulluserlist = this.userlist()
    let matchedusers = [];
    for(let a=0; a<fulluserlist.length; a++){
      for(let b=0; b<fulluserlist[a].groups.length;b++){
        if(fulluserlist[a].groups[b]==groupid){
          matchedusers.push(fulluserlist[a]);
        }
      }
    }
    return matchedusers
  }
  
}
