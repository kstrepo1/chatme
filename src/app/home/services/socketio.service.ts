import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const SERVER_URL = "http://localhost:3001";

import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  private socket:any

  constructor() { }

  initSocket(){
    this.socket = io(SERVER_URL);
    return ()=>{this.socket.disconnect();
    }
  }

  //Send Message
  send(message:any){
    this.socket.emit('message', message);
  }


  join(message:any){
    this.socket.emit('join', message);
  }


  //Get Message
  onMessage(){
    return new Observable(observer=>{
      this.socket.on('message', (data:any) =>{
        console.log(data)
        observer.next(data)
      })
    })
  }

  onJoin(){
    return new Observable(observer=>{
      this.socket.on('join', (data:any) =>{
        observer.next(data);
      })
    })
  }




}
