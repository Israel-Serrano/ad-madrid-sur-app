import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().pipe(filter(result => !!result)).subscribe(async (result: any) => {
      if (user) { // Edit mode
        this.userService.updateUser(user.uid, result).catch(err => {
          console.error(err);
          this.snackBar.open('❌ Error al actualizar usuario', 'Cerrar', { panelClass: ['error-snackbar'] });
        });
      } else { // Create mode
        try {
          const tempPassword = result.tempPassword;
          // Create user without the tempPassword field in Firestore
          const userData: User = {
            uid: '',
            displayName: result.displayName,
            email: result.email,
            role: result.role
          };
          
          await this.userService.createUserWithAuth(userData, tempPassword);
          this.snackBar.open('✅ Usuario creado correctamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar'] 
          });
        } catch (error: any) {
          console.error('Error creating user:', error);
          const errorMsg = error?.code === 'auth/email-already-in-use' 
            ? 'El correo ya está registrado'
            : error?.message || 'Error al crear usuario';
          this.snackBar.open(`❌ ${errorMsg}`, 'Cerrar', { panelClass: ['error-snackbar'] });
        }
      }
    });
  }

  deleteUser(uid: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Usuario',
        message: '¿Estás seguro de que quieres eliminar este usuario? Esto solo lo eliminará de la aplicación, no del proveedor de autenticación.'
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result === true)).subscribe(() => {
      this.userService.deleteUser(uid).catch(err => console.error(err));
    });
  }
}

