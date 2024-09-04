import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthcheckService {

  constructor() { }

  authedusers = [{
      username: "Super",
      email : "super@super.com",
      password: "123",
      id: "101",
      roles: ["SuperAdmin", "GroupAdmin", "ChatUser"],
      groups: ["0", "1", "2"]
    },  {
      username: "Bob",
      email : "bob@bob.com",
      password: "123",
      id: "102",
      roles: ["GroupAdmin", "ChatUser"],
      groups: ["1", "2"]
    },  {
      username: "James",
      email : "james@james.com",
      password: "123",
      id: "103",
      roles: ["GroupAdmin", "ChatUser"],
      groups: ["1"]
    }, {
      username: "Sarah",
      email : "sarah@sarah.com",
      password: "123",
      id: "104",
      roles: ["ChatUser"],
      groups: ["1", "2"]
    }, 
    {
      username: "Jim",
      email : "jim@jim.com",
      password: "123",
      id: "105",
      roles: ["ChatUser"],
      groups: ["1", "2", "3"]
    }
  ]

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
