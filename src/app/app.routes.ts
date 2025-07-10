import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { TuVungComponent } from './admin/tu-vung/tu-vung.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { LayoutStudentComponent } from './student/layout-student/layout-student.component';
import { ExamComponent } from './student/exam/exam.component';
import { LearnVocaComponent } from './student/learn-voca/learn-voca.component';
import { HomeComponent } from './student/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'student/home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: LoginRegisterComponent,
  },
  {
    path: 'admin',
    component: LayoutComponent, 
    children: [
      { path: 'vocabulary', component: TuVungComponent },
      { path: 'topics', component: TopicsComponent },
      // bạn có thể thêm các route admin khác ở đây
    ],
  },
  {
    path: 'student',
    component: LayoutStudentComponent,
    children: [
      { path: 'exam', component: ExamComponent },
      { path: 'home', component: HomeComponent },
      { path: 'learn-voca', component: LearnVocaComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'student/home',
  },
];
