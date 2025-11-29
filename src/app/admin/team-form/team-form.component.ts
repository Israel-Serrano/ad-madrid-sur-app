import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team, Category } from '../../core/models/team.model';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = ['Prebenjamín', 'Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil'];
  coaches$!: Observable<User[]>;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { team?: Team }
  ) {
    this.isEditMode = !!data.team;
  }

  ngOnInit(): void {
    this.coaches$ = this.userService.getUsersByRole('coach');
    this.form = this.fb.group({
      name: [this.data?.team?.name || '', Validators.required],
      category: [this.data?.team?.category || '', Validators.required],
      coachIds: [this.data?.team?.coachIds || []]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
