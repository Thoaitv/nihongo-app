import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { TuVungComponent } from './admin/tu-vung/tu-vung.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { LayoutComponent } from './admin/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: LoginRegisterComponent,
  },
  {
    path: 'admin',
    component: LayoutComponent, // layout giữ nguyên
    children: [
      { path: 'vocabulary', component: TuVungComponent },
      { path: 'topics', component: TopicsComponent },
      // bạn có thể thêm các route admin khác ở đây
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
