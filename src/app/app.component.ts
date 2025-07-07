import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// ✅ THÊM CÁC DÒNG import NÀY:
import { MatButtonModule } from '@angular/material/button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  // ✅ imports phải là array chứa các module đã import tĩnh
  imports: [RouterOutlet, MatButtonModule, NzButtonModule, NzTabsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // ❗ styleUrl -> phải là style**Urls**
})
export class AppComponent {
  title = 'nihongo';
}
