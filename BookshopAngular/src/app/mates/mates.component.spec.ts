import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatesComponent } from './mates.component';
import { MateService } from '../mate.service';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Mate } from '../mate.model';

describe('MatesComponent', () => {
  let component: MatesComponent;
  let fixture: ComponentFixture<MatesComponent>;
  let bookPostServiceSpy: jasmine.SpyObj<MateService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPosts: Mate[] = [
    {
      id: 1,
      name: '1984',
      brand: 'George Orwell',
      category: 'Dystopic',
      description: 'Classic',
      condition: 'used',
      price: 10,
      imageUrl: '',
      userId: 1,
      date: ''
    }
  ];

  beforeEach(async () => {
    bookPostServiceSpy = jasmine.createSpyObj('MateService', ['getAllBookPosts', 'addBookPost', 'deleteBookPostById', 'updateBookPost']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatesComponent],
      providers: [
        { provide: MateService, useValue: bookPostServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all book posts on init', () => {
    bookPostServiceSpy.getAllBookPosts.and.returnValue(of(mockPosts));
    component.ngOnInit();
    expect(bookPostServiceSpy.getAllBookPosts).toHaveBeenCalled();
    expect(component.mates.length).toBe(1);
  });

  it('should add a book post', () => {
    const newPost: Mate = {
      ...mockPosts[0],
      id: 2,
      name: 'Animal Farm',
      brand: 'George Orwell',
      category: 'Novel',
      description: 'Classic',
      condition: 'used',
      price: 8,
      imageUrl: '',
      userId: 1,
      date: ''
    };
    component.newMate = newPost;
    bookPostServiceSpy.addBookPost.and.returnValue(of(newPost));

    component.addBookPost();

    expect(bookPostServiceSpy.addBookPost).toHaveBeenCalledWith(newPost);
    expect(component.mates).toContain(newPost);
  });

  it('should delete a book post', () => {
    component.mates = [...mockPosts];
    const postToDelete = mockPosts[0];
    bookPostServiceSpy.deleteBookPostById.and.returnValue(of({}));

    component.deleteBookPost(postToDelete);

    expect(bookPostServiceSpy.deleteBookPostById).toHaveBeenCalledWith(postToDelete);
    expect(component.mates.length).toBe(0);
  });

});
