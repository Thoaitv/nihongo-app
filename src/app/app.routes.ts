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
import { ExamAdminComponent } from './admin/exam-admin/exam-admin.component';
import { StudentsComponent } from './admin/students/students.component';
import { ReadingComponent } from './student/reading/reading.component';
import { ReadingDetailComponent } from './student/reading/reading-detail/reading-detail.component';
import { ExamDetailComponent } from './student/exam-student/exam-detail/exam-detail.component';
import { ListeningDetailComponent } from './student/learn-listening/listening-detail/listening-detail.component';
import { VocaDetailComponent } from './student/learn-voca/voca-detail/voca-detail.component';
import { ListeningComponent } from './admin/listening/listening.component';
import { ReadingAdminComponent } from './admin/reading/reading.component';

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
      { path: 'students', component: StudentsComponent },
      { path: 'listening', component: ListeningComponent },
      { path: 'reading', component: ReadingAdminComponent },
    ],
  },
  {
    path: 'student',
    component: LayoutStudentComponent,
    children: [
      {
        path: 'exam',
        component: ExamStudentComponent,
        title: 'Danh sách exam',
      },
      {
        path: 'exam/:id',
        component: ExamDetailComponent,
        title: 'Chi tiết exam',
      },
      { path: 'home', component: HomeComponent },
      { path: 'tu-vung', component: LearnVocaComponent },
      { path: 'tu-vung/:id', component: VocaDetailComponent },
      { path: 'listening', component: LearnListeningComponent },
      { path: 'listening/:id', component: ListeningDetailComponent },
      {
        path: 'reading',
        component: ReadingComponent,
        title: 'Danh sách bài đọc',
      },
      {
        path: 'reading/:id',
        component: ReadingDetailComponent,
        title: 'Chi tiết bài đọc',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'student/home',
  },
];
