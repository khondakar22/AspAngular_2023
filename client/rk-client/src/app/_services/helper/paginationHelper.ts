import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginatedResult } from 'src/app/_models/pagination';

export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http.get<T>(url, { observe: 'response', params }).pipe(
    map((res) => {
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

export function gePaginationHeader(pageNumber: number, pageSize: number) {
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);
  return params;
}
