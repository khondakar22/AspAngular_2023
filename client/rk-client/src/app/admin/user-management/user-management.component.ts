import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  constructor(private adminService: AdminService, public dialog: MatDialog,
    private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: res => {
        this.users = res;
      }
    })
  }
  openEditModal(user: User) {
    const dialogRef = this.dialog.open(RolesModalComponent, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result : User) => {
      if(result) {
      //  let index = this.users.findIndex(x => x.username === result.username);
      //  this.users[index].roles = result.roles;
       this.adminService.updateUserRoles(result.username, result.roles.toString()).subscribe({
        next: roles => {user.roles = roles; this.toastr.success("Roles has been updated")}
       })
      }
    });
  }

}
