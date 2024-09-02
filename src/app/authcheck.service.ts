import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthcheckService {

  constructor() { }

  authedusers = [{
      username: "super",
      email : "super@super.com",
      password: "123",
      id: "101",
      roles: ["SuperAdmin", "GroupAdmin", "ChatUser"],
      groups: []
    },  {
      username: "Bob",
      email : "bob@bob.com",
      password: "123",
      id: "102",
      roles: ["GroupAdmin", "ChatUser"],
      groups: []
    },  {
      username: "James",
      email : "james@james.com",
      password: "123",
      id: "103",
      roles: ["GroupAdmin", "ChatUser"],
      groups: []
    }, {
      username: "Sarah",
      email : "sarah@sarah.com",
      password: "123",
      id: "104",
      roles: ["ChatUser"],
      groups: []
    }, 
    {
      username: "Jim",
      email : "jim@jim.com",
      password: "123",
      id: "104",
      roles: ["ChatUser"],
      groups: []
    }
  ]

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
}
