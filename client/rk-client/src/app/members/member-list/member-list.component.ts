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
  user: User | undefined;
  genderList = [{value: 'male', dispaly: 'Males'}, {value: 'female', dispaly: 'Females'} ]
  /**
   *
   */
  constructor(private memberService: MembersService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: res => {
        if(res) {
          this.userParams = new UserParams(res);
          this.user = res;
        }
      }
    })
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }
  loadMembers() {
    if(!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
      next: (res) => {
        if (res.result && res.pagiantion) {
          this.members = res.result;
          this.pagination = res.pagiantion;
        }
      },
    });
  }

  pageChanged(event: any) {
    if(this.userParams) {
      this.userParams.pageNumber = event.pageIndex + 1;
      this.userParams.pageSize = event.pageSize;
      this.loadMembers();
    }

  }

  resetFilters(){
    if(this.user) {
      this.userParams = new UserParams(this.user);
      this.loadMembers;
    }
  }
}
