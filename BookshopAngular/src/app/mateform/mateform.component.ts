import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MateService } from '../mate.service';
import { Mate } from '../mate.model';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mateform.component.html',
  styleUrls: ['./mateform.component.css']
})
export class MateFormComponent implements OnInit {
  bookPost: Mate = {
    id: 0,
    name: '',
    brand: '',
    category: '',
    description: '',
    condition: '',
    price: 0,
    imageUrl: '',
    userId: 0,
    date: null,
  };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookPostService: MateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookPostService.getBookPostById(+id).subscribe(post => {
        this.bookPost = post;
      });
    } else {
      const userId = this.authService.getUserId();
      if (userId) this.bookPost.userId = userId;
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.bookPostService.updateBookPost(this.bookPost).subscribe(() => {
        this.router.navigate(['/mates']);
      });
    } else {
      this.bookPostService.addBookPost(this.bookPost).subscribe(() => {
        this.router.navigate(['/mates']);
      });
    }
  }
}
