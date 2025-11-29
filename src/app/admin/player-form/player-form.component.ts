import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player } from '../../core/models/player.model';
import { Team } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team.service';
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
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: { player?: Player }
  ) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.form = this.fb.group({
      name: [this.data?.player?.name || '', Validators.required],
      teamId: [this.data?.player?.teamId || '', Validators.required]
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
