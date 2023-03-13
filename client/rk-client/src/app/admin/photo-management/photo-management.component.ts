import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { PhotoParam } from 'src/app/_models/photoParams';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css'],
})
export class PhotoManagementComponent implements OnInit {
  photoParams = { pageNumber: 1, pageSize: 12 } as PhotoParam;
  photos?: Photo[];
  pagination?: Pagination;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUnapprovedPhotos();
  }

  loadUnapprovedPhotos() {
    this.adminService.getPhotosForApproval(this.photoParams).subscribe({
      next: (res) => {
        if (res) {
          this.photos = res.result;
          this.pagination = res.pagiantion;
        }
      },
    });
  }
  pageChanged(event: any) {
    if (this.photoParams) {
      this.photoParams.pageNumber = event.pageIndex + 1;
      this.photoParams.pageSize = event.pageSize;
      this.loadUnapprovedPhotos();
    }
  }
  approvePhoto(photoId: number, userId: number) {
    this.adminService.approvePhoto(photoId, userId).subscribe({
      next: (res) => {
        if (res) {
          this.photos?.map((x) => {
            if (x.id == res.id) {
              x.isApproved = res.isApproved;
            }
          });
        }
      },
    });
  }
  rejectPhoto(id: number) {
    this.adminService.rejectPhoto(id).subscribe({
      next: (res) => {
        if (res) {
          this.photos?.map((x) => {
            if (x.id == res.id) {
              x.isRejected = res.isRejected;
            }
          });
        }
      },
    });
  }
}
