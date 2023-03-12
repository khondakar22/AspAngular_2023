import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from 'src/app/_models/user';
export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css'],
})
export class RolesModalComponent implements OnInit {
  username = '';
  rolesForm: FormGroup;
  availableRoles = ['Admin', 'Moderator', 'Member'];
  selectedRoles: any[] = [];
  toppings = new FormControl();

  toppingList = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];
  constructor(
    public dialogRef: MatDialogRef<RolesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public fb: FormBuilder
  ) {
    this.rolesForm = new FormGroup({});
    this.username = this.data.username;
  }

  ngOnInit(): void {
    this.rolesForm = this.fb.group({
      selectedRoles: [this.data.roles],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  updateCheckd(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1
      ? this.selectedRoles.splice(index, 1)
      : this.selectedRoles.push(checkedValue);
  }
  onSaveModal() {
    if (this.rolesForm.value.selectedRoles.length > 0) {
      this.data.roles = this.rolesForm.value.selectedRoles;
    }
    this.dialogRef.close(this.data);
  }
}
