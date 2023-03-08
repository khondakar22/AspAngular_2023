import { Component, OnInit } from '@angular/core';
import { Messages } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Messages[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber =1;
  pageSize = 5;
  constructor(private messageService: MessagesService){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  loadMessages() {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: respose => {
        this.messages = respose.result;
        this.pagination = respose.pagiantion;
      }
    })
  }

  pageChanged(event: any) {

      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadMessages();

  }

}
