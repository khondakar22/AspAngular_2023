import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Messages } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessagesService } from '../_services/messages.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = ['messages', 'fromTo', 'sentReceived', 'action'];
  dataSource: MatTableDataSource<Messages> ;

  @ViewChild(MatPaginator) paginator?: MatPaginator ;
  messages?: Messages[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber =1;
  pageSize = 5;
  constructor(private messageService: MessagesService, private router: Router){
    this.dataSource = new MatTableDataSource<Messages>();
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }
  }
  loadMessages(container: string) {
    this.container = container;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: respose => {
        this.messages = respose.result;
        if(this.dataSource) {
          this.dataSource = new MatTableDataSource<Messages>(respose.result);
        }
        this.pagination = respose.pagiantion;
      }
    })
  }

  pageChanged(event: any) {

      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadMessages(this.container);

  }

  navigate(row:Messages, $event:any) {
    let username = ''
    if(this.container ==='Outbox') {
      username = row.recipientUsername;
    } else {
      username = row.senderUsername;
    }
    this.router.navigateByUrl('/members/'+ username);
  }

}
