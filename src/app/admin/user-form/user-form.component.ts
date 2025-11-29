import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  roles: UserRole[] = ['admin', 'coach'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.isEditMode = !!this.data.user;
    this.form = this.fb.group({
      uid: [null],
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.form.patchValue(this.data.user);
      // UID and email should not be editable
      this.form.get('uid')?.disable();
      this.form.get('email')?.disable();
    } else {
       // For new users, we might need a password field.
       // Handled by Cloud Function, so we omit it here.
    }
  }

  onSave(): void {
    if (this.form.valid) {
      // Return the raw value, including disabled fields like uid and email
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
