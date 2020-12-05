import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMessage } from '../chat-message';
import { ChatRoom } from '../chat-room';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { Signalr } from '../signalr';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  private chatRoomSignalR: Signalr<ChatRoom>;
  private chatMessageSignalR: Signalr<ChatMessage>;

  public chatRooms: ChatRoom[];
  public chatMessages: ChatMessage[];

  public selectedChatRoom: ChatRoom;

  public loggedInUser: string;

  constructor(private router: Router, private http: HttpClient) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    } else {

      this.loggedInUser = sessionStorage.getItem('username');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }

      this.http.get<ChatRoom[]>(
        "https://localhost:5001/api/chat",
        {headers}).subscribe(response => {
          console.log(response);
          this.chatRooms = response;
          this.selectedChatRoom = this.chatRooms[0];
          this.http.get<ChatMessage[]>(
            "https://localhost:5001/api/chat/room/" + this.selectedChatRoom.id,
            {headers}).subscribe(response => {
              console.log(response);
              this.chatMessages = response;
            })
        })

        this.chatRoomSignalR = new Signalr<ChatRoom>("https://localhost:5001/chatRoomHub");
        this.chatRoomSignalR.register("NewChatRoom", r => {
          this.chatRooms.unshift(r);
          return true;
        })
        this.chatRoomSignalR.start();


        this.chatMessageSignalR = new Signalr<ChatMessage>("https://localhost:5001/chatMessageHub");
        this.chatMessageSignalR.register("NewChatMessage", m => {
          this.chatMessages.unshift(m);
          return true;
        })
        this.chatMessageSignalR.start();
    }
  }

  selectChatRoom(chatRoomComponent: ChatRoomComponent): void {
    const chatRoomId = chatRoomComponent.chatRoom.id;
    console.log(chatRoomId);

    this.selectedChatRoom = this.chatRooms.find(chR => chR.id === chatRoomId);

    const token = sessionStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }

          this.http.get<ChatMessage[]>(
            "https://localhost:5001/api/chat/room/" + chatRoomId,
            {headers}).subscribe(response => {
              console.log(response);
              this.chatMessages = response;
            })
      }
  }
  
  addChatMessage(text: HTMLInputElement): void {

    const chatMessage = new ChatMessage();
    chatMessage.text = text.value;
    chatMessage.chatRoomId = this.selectedChatRoom.id;
    chatMessage.username = sessionStorage.getItem('username');

    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    this.http.post<ChatMessage>("https://localhost:5001/api/chat/add-message", chatMessage, {headers})
      .subscribe(response => {
        console.log(response);
        chatMessage.created = response.created;
      });
  }

  createChatRoom(text: HTMLInputElement): void {

    const chatRoom = new ChatRoom();
    chatRoom.name = text.value;

    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    this.http.post<ChatRoom>("https://localhost:5001/api/chat", chatRoom, {headers})
      .subscribe(response => {
        this.selectedChatRoom = response;
        console.log(response);
      });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.router.navigate(["/login"]);
  }

  ngOnInit(): void {
  }
}
