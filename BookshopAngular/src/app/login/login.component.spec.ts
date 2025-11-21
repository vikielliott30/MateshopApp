import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'saveUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', () => {
    component.username = 'testuser';
    component.password = 'password';
    const fakeResponse = { userId: 123 };
    mockAuthService.login.and.returnValue(of(fakeResponse));

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'password');
    expect(mockAuthService.saveUserId).toHaveBeenCalledWith(123);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mates']);
  });

  it('should alert on login failure', () => {
    spyOn(window, 'alert');  // Intercepta el alert para evitar que lo muestre
    component.username = 'wrong';
    component.password = 'wrong';
    mockAuthService.login.and.returnValue(throwError(() => new Error('Invalid login')));
    //Invalid username or password

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Login failed');
  });

  it('should update username and password from the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('input');

    (inputs[0] as HTMLInputElement).value = 'caro';
    inputs[0].dispatchEvent(new Event('input'));

    (inputs[1] as HTMLInputElement).value = 'clave';
    inputs[1].dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe('caro');
    expect(component.password).toBe('clave');
  });
});
