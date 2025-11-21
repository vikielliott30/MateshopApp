import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MateFormComponent } from './mateform.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MateService } from '../mate.service';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { Mate } from '../mate.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MateFormComponent', () => {
  let component: MateFormComponent;
  let fixture: ComponentFixture<MateFormComponent>;
  let bookPostServiceSpy: jasmine.SpyObj<MateService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockBookPostService = jasmine.createSpyObj('MateService', [
      'getBookPostById',
      'updateBookPost',
      'addBookPost'
    ]);
    const mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MateFormComponent, FormsModule, CommonModule],
      providers: [
        { provide: MateService, useValue: mockBookPostService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null // Cambiar a un ID string para test de edición
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MateFormComponent);
    component = fixture.componentInstance;
    bookPostServiceSpy = TestBed.inject(MateService) as jasmine.SpyObj<MateService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set userId on init if not edit mode', () => {
    authServiceSpy.getUserId.and.returnValue(42);
    fixture.detectChanges();
    expect(component.bookPost.userId).toBe(42);
    expect(component.isEditMode).toBeFalse();
  });

  it('should load bookPost in edit mode', () => {
    // Simulamos que la URL tiene un id => modo edición
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('7');
    const fakePost: Mate = {
      id: 7,
      name: 'Title',
      brand: 'Author',
      category: 'Genre',
      description: 'Desc',
      condition: 'New',
      price: 10,
      imageUrl: '',
      userId: 1,
      date: null
    };
    bookPostServiceSpy.getBookPostById.and.returnValue(of(fakePost));

    fixture.detectChanges(); // Ejecuta ngOnInit

    expect(component.isEditMode).toBeTrue();
    expect(component.bookPost.name).toBe('Title');
    expect(bookPostServiceSpy.getBookPostById).toHaveBeenCalledWith(7);
  });

  it('should call updateBookPost on submit when in edit mode', () => {
    component.isEditMode = true;
    component.bookPost = {
      id: 1,
      name: 'T',
      brand: 'A',
      category: 'G',
      description: 'D',
      condition: 'Used',
      price: 9,
      imageUrl: '',
      userId: 1,
      date: null
    };
    bookPostServiceSpy.updateBookPost.and.returnValue(of(component.bookPost));

    component.onSubmit();

    expect(bookPostServiceSpy.updateBookPost).toHaveBeenCalledWith(component.bookPost);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mates']);
  });

  it('should call addBookPost on submit when not in edit mode', () => {
    component.isEditMode = false;
    component.bookPost = {
      id: 0,
      name: 'T',
      brand: 'A',
      category: 'G',
      description: 'D',
      condition: 'New',
      price: 15,
      imageUrl: '',
      userId: 1,
      date: null
    };
    bookPostServiceSpy.addBookPost.and.returnValue(of(component.bookPost));

    component.onSubmit();

    expect(bookPostServiceSpy.addBookPost).toHaveBeenCalledWith(component.bookPost);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mates']);
  });
});
