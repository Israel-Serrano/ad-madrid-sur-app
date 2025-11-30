import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { UserRole } from '../models/user.model';

/**
 * Directiva *appHasRole
 * Muestra/oculta elementos HTML basado en el rol del usuario actual
 * 
 * Uso:
 * <button *appHasRole="'admin'">Solo para admin</button>
 * <div *appHasRole="['admin', 'coach']">Para admin o coach</div>
 */
@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private roles: UserRole[] = [];
  private subscription: Subscription | null = null;
  private currentUser: any = null;

  @Input()
  set appHasRole(val: UserRole | UserRole[]) {
    this.roles = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateView(): void {
    // Avoid creating multiple embedded views: clear before rendering
    this.viewContainer.clear();
    if (this.currentUser && this.roles.includes(this.currentUser.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
