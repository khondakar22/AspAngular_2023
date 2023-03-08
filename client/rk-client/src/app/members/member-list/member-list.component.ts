import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [{value: 'male', dispaly: 'Males'}, {value: 'female', dispaly: 'Females'} ]
  /**
   *
   */
  constructor(private memberService: MembersService) {
    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //   next: res => {
    //     if(res) {
    //       this.userParams = new UserParams(res);
    //       this.user = res;
    //     }
    //   }
    // })
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }
  loadMembers() {
    if(this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (res) => {
          if (res.result && res.pagiantion) {
            this.members = res.result;
            this.pagination = res.pagiantion;
          }
        },
      });
    }
  }

  pageChanged(event: any) {
    if(this.userParams) {
      this.userParams.pageNumber = event.pageIndex + 1;
      this.userParams.pageSize = event.pageSize;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
  loadActiveMember(orderBy: string) {
    if(!this.userParams) return;
    this.userParams.orderBy = orderBy
    this.loadMembers();
  }

  resetFilters(){
      this.userParams = this.memberService.resetUserParams();
      this.loadMembers;
  }
}
