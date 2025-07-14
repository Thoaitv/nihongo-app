import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
import { filter } from 'rxjs/operators';

interface MenuItemData {
  key: string;
  title: string;
  icon: string;
  route?: string;
  children?: MenuItemData[];
  badge?: number;
  disabled?: boolean;
}

interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
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
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  selectedKeys: string[] = [];
  openKeys: string[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  currentTime = new Date();
  currentUser = {
    name: 'Admin User',
    email: 'admin@japanlearning.com',
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: 'Administrator',
  };

  menuItems: MenuItemData[] = [
    // {
    //   key: 'dashboard',
    //   title: 'Tổng quan',
    //   icon: 'fas fa-tachometer-alt',
    //   route: '/admin/dashboard',
    // },
    {
      key: 'content-management',
      title: 'Quản lý nội dung',
      icon: 'fas fa-book',
      children: [
        {
          key: 'topics',
          title: 'Chủ đề',
          icon: 'fas fa-tags',
          route: '/admin/topics',
          badge: 4,
        },
        {
          key: 'lessons',
          title: 'Bài học',
          icon: 'fas fa-file-alt',
          route: '/admin/lessons',
          badge: 12,
        },
        {
          key: 'vocabulary',
          title: 'Từ vựng',
          icon: 'fas fa-language',
          route: '/admin/vocabulary',
          badge: 256,
        },
        {
          key: 'grammar',
          title: 'Ngữ pháp',
          icon: 'fas fa-spell-check',
          route: '/admin/grammar',
          badge: 45,
        },
        {
          key: 'kanji',
          title: 'Kanji',
          icon: 'fas fa-chinese',
          route: '/admin/kanji',
          badge: 89,
        },
      ],
    },
    {
      key: 'user-management',
      title: 'Quản lý người dùng',
      icon: 'fas fa-users',
      children: [
        {
          key: 'students',
          title: 'Học viên',
          icon: 'fas fa-user-graduate',
          route: '/admin/students',
          badge: 1250,
        },
      ],
    },
    {
      key: 'test-management',
      title: 'Quản lý bài kiểm tra',
      icon: 'fas fa-clipboard-check',
      children: [
        {
          key: 'tests',
          title: 'Bài kiểm tra',
          icon: 'fas fa-file-text',
          route: '/admin/exam',
          badge: 25,
        },
        {
          key: 'results',
          title: 'Kết quả',
          icon: 'fas fa-chart-line',
          route: '/admin/results',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateSelectedKeys(event.url);
        this.updateBreadcrumb(event.url);
      });

    this.updateSelectedKeys(this.router.url);
    this.updateBreadcrumb(this.router.url);
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onMenuClick(item: MenuItemData): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onOpenChange(openKeys: string[]): void {
    this.openKeys = openKeys;
  }

  private updateSelectedKeys(url: string): void {
    const pathSegments = url.split('/').filter((segment) => segment);
    if (pathSegments.length >= 2) {
      const key = pathSegments[pathSegments.length - 1];
      this.selectedKeys = [key];
      this.findAndOpenParentMenu(key);
    }
  }

  private findAndOpenParentMenu(childKey: string): void {
    for (const item of this.menuItems) {
      if (item.children) {
        const childItem = item.children.find((child) => child.key === childKey);
        if (childItem) {
          if (!this.openKeys.includes(item.key)) {
            this.openKeys = [...this.openKeys, item.key];
          }
          break;
        }
      }
    }
  }

  private updateBreadcrumb(url: string): void {
    const pathSegments = url.split('/').filter((segment) => segment);
    this.breadcrumbItems = [];
    if (pathSegments.length >= 1) {
      this.breadcrumbItems.push({ label: 'Admin', url: '/admin' });
      const currentKey = pathSegments[pathSegments.length - 1];
      const menuItem = this.findMenuItemByKey(currentKey);
      if (menuItem) {
        const parentItem = this.findParentMenuByChildKey(currentKey);
        if (parentItem) {
          this.breadcrumbItems.push({ label: parentItem.title });
        }
        this.breadcrumbItems.push({ label: menuItem.title });
      }
    }
  }

  private findMenuItemByKey(key: string): MenuItemData | null {
    for (const item of this.menuItems) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const childItem = item.children.find((child) => child.key === key);
        if (childItem) {
          return childItem;
        }
      }
    }
    return null;
  }

  private findParentMenuByChildKey(childKey: string): MenuItemData | null {
    for (const item of this.menuItems) {
      if (item.children) {
        const childItem = item.children.find((child) => child.key === childKey);
        if (childItem) {
          return item;
        }
      }
    }
    return null;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }
}
