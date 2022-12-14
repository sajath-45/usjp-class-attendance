import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.module').then((m) => m.HomePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'classes',
        loadChildren: () =>
          import('../pages/classes/classes.module').then(
            (m) => m.ClassesPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('../pages/edit-profile/edit-profile.module').then(
            (m) => m.EditProfilePageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../pages/settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
