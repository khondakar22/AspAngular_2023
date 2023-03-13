import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Photo } from '../_models/photo';
import { PhotoParam } from '../_models/photoParams';
import { User } from '../_models/user';
import { gePaginationHeader, getPaginatedResult } from './helper/paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsersWithRoles() {
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }
  updateUserRoles(username: string, roles: string) {
    return this.http.post<string[]>(
      this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles,
      {}
    );
  }
  getPhotosForApproval(photoParam: PhotoParam){
    let params = gePaginationHeader(photoParam.pageNumber, photoParam.pageSize);
    return getPaginatedResult<Photo[]>(
      this.baseUrl + 'admin/photos-to-moderate',
      params,
      this.http
    );
  }
  approvePhoto(photoId: number, userId: number){
    let body = {photoId: photoId, userId: userId};
    return this.http.post<Photo>(this.baseUrl + 'admin/photos-to-approve', body);
  }
  rejectPhoto(photoId: number){
    return this.http.put<Photo>(this.baseUrl +'admin/photos-to-reject?id='+ photoId, {});
  }
}
