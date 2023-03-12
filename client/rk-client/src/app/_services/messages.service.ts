import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Group } from '../_models/group';
import { Messages } from '../_models/message';
import { User } from '../_models/user';
import {
  gePaginationHeader,
  getPaginatedResult,
} from './helper/paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Messages[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection?.start().catch((error) => console.log(error));
    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });
    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          },
        });
      }
    });
    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          this.messageThreadSource.next([...messages, message]);
        },
      });
    });
  }
  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = gePaginationHeader(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Messages[]>(
      this.baseUrl + 'messages',
      params,
      this.http
    );
  }

  getMessagesThread(usernaem: string) {
    return this.http.get<Messages[]>(
      this.baseUrl + 'messages/thread/' + usernaem
    );
  }

  async sendMessage(username: string, content: string) {
    // return this.http.post<Messages>(this.baseUrl + 'messages', {
    //   recipientUsername: username,
    //   content: content,
    // });
    return this.hubConnection
      ?.invoke('SendMessage', {
        recipientUsername: username,
        content: content,
      })
      .catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
