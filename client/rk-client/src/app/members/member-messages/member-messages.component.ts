import { Component, Input, OnInit } from '@angular/core';
import { Messages } from 'src/app/_models/message';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username?: string;
  messages: Messages[] = [];
  constructor(private messageService: MessagesService) {}
  ngOnInit(): void {
    this.loadMessagesThreads();
  }

  loadMessagesThreads(){
    if(this.username) {
      this.messageService.getMessagesThread(this.username).subscribe({
        next: res => {
          this.messages = res;
        }
      })
    }
  }

}
