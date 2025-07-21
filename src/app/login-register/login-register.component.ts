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
import { ApiService } from '../services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private message: NzMessageService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group(
      {
        name: [''],
        email: ['', ],
        username: [''],
        password: [''],
        confirmPassword: [''],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  onLoginSubmit(): void {
    localStorage.clear();
    const { username, password } = this.loginForm.value;
    this.apiService.login({ username, password }).subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log('res', res);

          this.toastr.success('Đăng nhập thành công');
          if (username === 'admin') {
            this.router.navigate(['/admin/topics']);
          } else {
            this.router.navigate(['/student/home']);
          }
          localStorage.setItem('role', res?.data.role);
          localStorage.setItem('id', res?.data.id);
          localStorage.setItem('username', res?.data.username);
        } else {
          this.toastr.error('Đăng nhập thất bại');
        }
      },
      error: (err) => {
        console.error('Đăng nhập thất bại:', err);
      },
    });
  }

  onRegisterSubmit() {
    const { name, email, username, password } = this.registerForm.value;

    this.apiService.register({ name, email, username, password }).subscribe({
      next: (res) => {
        this.toastr.success('Đăng ký thành công!');
        this.selectedTab = 0;
        this.registerForm.reset();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Đăng ký thất bại!';
        this.toastr.error(msg);
      },
    });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
