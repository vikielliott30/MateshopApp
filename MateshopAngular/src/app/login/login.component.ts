import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
  
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Método para hacer login
  login(): void {
    this.authService.login(this.username, this.password).subscribe(response => {
      // Guardar el userId simulando "token" en el localStorage
      this.authService.saveUserId(response.userId);
      this.router.navigate(['/mates']);
    }, error => {
      alert('Login failed');
    });
  }
}
