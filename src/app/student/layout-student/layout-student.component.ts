import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-layout-student',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzToolTipModule,
    NzBadgeModule,
    NzDividerModule,
    NzSpaceModule,
    NzTagModule,
  ],
  templateUrl: './layout-student.component.html',
  styleUrl: './layout-student.component.scss',
})
export class LayoutStudentComponent {
  role = localStorage.getItem('role');
  userName = localStorage.getItem('username');
  constructor(private router: Router) {
    console.log('role', this.role);
  }
  showAuth() {
    this.router.navigate(['/auth']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToHistoryExam() {
    this.router.navigate(['/goToHistoryExam']);
  }

  logout() {
    // Xử lý đăng xuất
    localStorage.clear();
    // Xoá token, điều hướng về auth
    this.router.navigate(['/auth']);
  }
}
