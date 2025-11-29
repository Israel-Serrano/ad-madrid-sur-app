import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../../core/models/player.model';
import { Team } from '../../core/models/team.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit {
  form!: FormGroup;
  teams$!: Observable<Team[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlayerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { player?: Player; teamId?: string; teams$: Observable<Team[]> }
  ) { }

  ngOnInit(): void {
    this.teams$ = this.data.teams$;
    this.form = this.fb.group({
      name: [this.data?.player?.name || '', Validators.required],
      dorsal: [this.data?.player?.dorsal || ''],
      teamId: [{ value: this.data?.teamId || this.data?.player?.teamId || '', disabled: !!this.data?.teamId }, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      let formData = this.form.getRawValue(); // Use getRawValue to get disabled fields
      // If we are creating a new player, initialize their stats
      if (!this.data.player) {
        formData = {
          ...formData,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0
        };
      }
      this.dialogRef.close(formData);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
