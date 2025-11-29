import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../core/directives/has-role.directive';

/**
 * SharedModule - Directivas y componentes compartidos
 * Importar este módulo en feature modules que necesiten HasRoleDirective
 */
@NgModule({
  declarations: [
    HasRoleDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HasRoleDirective
  ]
})
export class SharedModule { }
