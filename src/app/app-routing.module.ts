import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'create-class',
    loadChildren: () =>
      import('./pages/create-class/create-class.module').then(
        (m) => m.CreateClassPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'qr-scanner',
    loadChildren: () =>
      import('./pages/qr-scanner/qr-scanner.module').then(
        (m) => m.QrScannerPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'classes',
    loadChildren: () =>
      import('./pages/classes/classes.module').then((m) => m.ClassesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'class-detail',
    loadChildren: () =>
      import('./pages/class-detail/class-detail.module').then(
        (m) => m.ClassDetailPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./pages/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
