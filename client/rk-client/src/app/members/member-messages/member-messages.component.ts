import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Messages } from 'src/app/_models/message';
import { MessagesService } from 'src/app/_services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  @Input() messages: Messages[] = [];
  messageContent = '';
  constructor(private messagesService: MessagesService) {}
  ngOnInit(): void {}

  sendMessage() {
    if (!this.username) return;
    this.messagesService
      .sendMessage(this.username, this.messageContent)
      .subscribe({
        next: (res) => {
          this.messages.push(res);
          this.messageForm?.reset();
        },
      });
  }
}
