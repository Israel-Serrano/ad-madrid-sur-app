import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users$!: Observable<User[]>;
  displayedColumns: string[] = ['displayName', 'email', 'role', 'actions'];

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe((result: User) => {
      if (user) { // Edit mode
        this.userService.updateUser(user.uid, result).catch(err => console.error(err));
      } else { // Create mode
        // In a real app, you'd use a Cloud Function to create the Auth user
        // and get a UID back to use here. For now, we'll assume a UID can be generated
        // or is handled by the yet-to-be-implemented auth creation flow.
        // This part of the code won't fully work without the auth part.
        // We are creating a user in firestore only.
        console.warn('Creating user in Firestore only. Auth user creation needs a Cloud Function.');
        this.userService.createUser(result).catch(err => console.error(err));
      }
    });
  }

  deleteUser(uid: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This will only remove them from the application, not from the authentication provider.'
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result === true)).subscribe(() => {
      this.userService.deleteUser(uid).catch(err => console.error(err));
    });
  }
}

