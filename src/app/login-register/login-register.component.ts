import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzTabsModule, NzButtonModule],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
})
export class LoginRegisterComponent {
  selectedTab = 0;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // 🧪 Bạn có thể kiểm tra điều kiện đăng nhập tại đây
      if (email === 'a') {
        this.router.navigate(['/admin/tu-vung']);
      } else {
        this.router.navigate(['/home']);
      }

      // Hoặc sau này bạn sẽ call API và xử lý kết quả thành công rồi navigate:
      // this.authService.login(email, password).subscribe(user => {
      //   this.router.navigate(['/home']);
      // });
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Đăng ký dữ liệu:', this.registerForm.value);
      // TODO: call auth API register
    }
  }
}
