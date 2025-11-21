import { TestBed } from '@angular/core/testing';
import { MateService } from './mate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Mate } from './mate.model';
import { environment } from '../environments/environment';

describe('MateService', () => {
  let service: MateService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = environment.apiUrl + '/mates';

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MateService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(MateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const dummyBookPost: Mate = {
    id: 1,
    name: 'Test Title',
    brand: 'Author',
    category: 'Genre',
    description: 'Description',
    condition: 'New',
    price: 100,
    imageUrl: '',
    userId: 1,
    date: null
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all book posts', () => {
    service.getAllBookPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].name).toBe('Test Title');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([dummyBookPost]);
  });

  it('should fetch a book post by id', () => {
    service.getBookPostById(1).subscribe(post => {
      expect(post.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBookPost);
  });

  it('should add a book post when user is authenticated', () => {
    authServiceSpy.getUserId.and.returnValue(1);

    service.addBookPost({ ...dummyBookPost, userId: 0 }).subscribe(post => {
      expect(post.userId).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.userId).toBe(1);
    req.flush(dummyBookPost);
  });

  it('should throw error when adding if user is not authenticated', (done) => {
    authServiceSpy.getUserId.and.returnValue(null);

    service.addBookPost(dummyBookPost).subscribe({
      next: () => {
        fail('Expected an error, but got a result.');
        done();
      },
      error: (err) => {
        expect(err.message).toBe('Usuario no autenticado');
        done();
      }
    });
  });

  it('should update book post if user is the owner', () => {
    authServiceSpy.getUserId.and.returnValue(1);

    service.updateBookPost(dummyBookPost).subscribe(post => {
      expect(post.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyBookPost);
  });

  it('should throw error if user tries to update a post they dont own', () => {
    authServiceSpy.getUserId.and.returnValue(99);
    spyOn(window, 'alert'); // mock para evitar que tire el alert real

    service.updateBookPost(dummyBookPost).subscribe({
      error: (err) => {
        expect(err.message).toBe('Unauthorized update attempt');
      }
    });
  });

  it('should delete book post if user is the owner', () => {
    authServiceSpy.getUserId.and.returnValue(1);

    service.deleteBookPostById(dummyBookPost).subscribe(resp => {
      expect(resp).toBeTruthy(); // undefined, pero no lanza error
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should throw error if user tries to delete a post they dont own', () => {
    authServiceSpy.getUserId.and.returnValue(2);
    spyOn(window, 'alert');

    service.deleteBookPostById(dummyBookPost).subscribe({
      error: (err) => {
        expect(err.message).toBe('Unauthorized delete attempt');
      }
    });
  });
});
