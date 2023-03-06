import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members: Member[] = [];
paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPage?: number) {
    let params = new HttpParams();
    if(page && itemsPage){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPage);
    }
    // if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(res => {
        // this.members = res;
        if(res.body) {
          this.paginatedResult.result = res.body;
        }
        const pagiantion = res.headers.get('Pagination');
        if(pagiantion) {
          this.paginatedResult.pagiantion = JSON.parse(pagiantion);
        }
        return this.paginatedResult;
      })
    );
  }
  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
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
}
