import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';
import { Confirmation } from '../_models/confirmation';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(public dialog: MatDialog) {}

  confirm(
    conf: Confirmation = {
      title: 'Confirmation',
      messages: 'Are you sure you want to do this',
      btnCancel: 'No',
      btnOk: 'Yes',
    }
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: conf,
    });
    return dialogRef.afterClosed().pipe(
      map((result: boolean) => {
        return result;
      })
    );
  }
}
