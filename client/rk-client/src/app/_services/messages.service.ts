import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Messages } from '../_models/message';
import { gePaginationHeader, getPaginatedResult } from './helper/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = gePaginationHeader(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Messages[]>(this.baseUrl + 'messages', params, this.http);
  }

  getMessagesThread(usernaem: string) {
    return this.http.get<Messages[]>(this.baseUrl + 'messages/thread/' + usernaem);
  }
}
