import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members: Member[] = [];
memberCache = new Map();
user: User | undefined;
userParams: UserParams | undefined;
// paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: res => {
        if(res) {
          this.userParams = new UserParams(res);
          this.user = res;
        }
      }
    })
   }

   getUserParams() {
    return this.userParams;
   }
   setUserParams(params: UserParams) {
    this.userParams = params;
   }
   resetUserParams(){
    if(this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
   }

  getMembers(userParams: UserParams) {
    // console.log(Object.values(userParams).join('-'))
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    console.log("🚀 ~ file: members.service.ts:23 ~ MembersService ~ getMembers ~ response:", response)
    if(response) return of(response);
    let params = this.gePaginationHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>( this.baseUrl + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    // const member = this.members.find(x => x.userName === username);
    // if(member) return of(member);

    const member = [...this.memberCache.values()].reduce((arr, elem)=> arr.concat(elem.result), []).find((member: Member) => member.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number ){
    let params = this.gePaginationHeader(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return this.getPaginatedResult<Member[]>( this.baseUrl + 'likes', params);
    // return this.http.get<Member[]>(this.baseUrl + 'likes?predicate=' + predicate );
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult:  PaginatedResult<T> = new PaginatedResult<T>
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(res => {
        // this.members = res;
        if (res.body) {
          paginatedResult.result = res.body;
        }
        const pagiantion = res.headers.get('Pagination');
        if (pagiantion) {
          paginatedResult.pagiantion = JSON.parse(pagiantion);
        }
        return paginatedResult;
      })
    );
  }

  private gePaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    return params;
  }

}
