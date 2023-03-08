import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;
  constructor(private memberService: MembersService ){}
  ngOnInit(): void {
    this.loadLikes(this.predicate);
  }

  loadLikes(likePredicate:string ){
    this.predicate = likePredicate;
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.pagination = response.pagiantion;
        this.members = response.result;
      }
    })
  }

  pageChanged(event: any) {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadLikes(this.predicate);
  }

}
