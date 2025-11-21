import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/auth/login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // Limpia antes de cada test
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Limpia después también
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login request with correct data', () => {
    const dummyResponse = { userId: 1 };
    service.login('test@example.com', '1234').subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'test@example.com', password: '1234' });

    req.flush(dummyResponse);
  });

  it('should save userId to localStorage', () => {
    service.saveUserId(99);
    expect(localStorage.getItem('userId')).toBe('99');
  });

  it('should get userId from localStorage', () => {
    localStorage.setItem('userId', '88');
    expect(service.getUserId()).toBe(88);
  });

  it('should return null if userId is not in localStorage', () => {
    expect(service.getUserId()).toBeNull();
  });

  it('should return true if authenticated', () => {
    localStorage.setItem('userId', '55');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should remove userId on logout', () => {
    localStorage.setItem('userId', '42');
    service.logout();
    expect(localStorage.getItem('userId')).toBeNull();
  });
});