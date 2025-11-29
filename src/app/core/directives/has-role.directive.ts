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
    this.subscription = this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateView(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && this.roles.includes(user.role)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
