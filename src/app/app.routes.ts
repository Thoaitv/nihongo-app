import { Routes } from '@angular/router';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { TuVungComponent } from './admin/tu-vung/tu-vung.component';
import { TopicsComponent } from './admin/topics/topics.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { LayoutStudentComponent } from './student/layout-student/layout-student.component';
import { ExamStudentComponent } from './student/exam-student/exam-student.component';
import { LearnVocaComponent } from './student/learn-voca/learn-voca.component';
import { HomeComponent } from './student/home/home.component';
import { LearnListeningComponent } from './student/learn-listening/learn-listening.component';
import { LearnReadingComponent } from './student/learn-reading/learn-reading.component';
import { ExamAdminComponent } from './admin/exam-admin/exam-admin.component';

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
      { path: 'exam', component: ExamAdminComponent },
      // bạn có thể thêm các route admin khác ở đây
    ],
  },
  {
    path: 'student',
    component: LayoutStudentComponent,
    children: [
      { path: 'exam', component: ExamStudentComponent },
      { path: 'home', component: HomeComponent },
      { path: 'tu-vung', component: LearnVocaComponent },
      { path: 'listening', component: LearnListeningComponent },
      { path: 'reading', component: LearnReadingComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'student/home',
  },
];
