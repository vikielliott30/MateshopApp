import { Component, OnInit } from '@angular/core';
import { MateService } from '../mate.service';
import { Mate } from '../mate.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-mates',
  standalone: true,
  imports:[CommonModule, FormsModule],
  templateUrl: './mates.component.html',
  styleUrls: ['./mates.component.css'],
})
export class MatesComponent implements OnInit {
  mates: Mate[] = [];
  newMate: Mate = {
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

  constructor(
    private bookPostService: MateService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.bookPostService.getAllBookPosts().subscribe(data => {
      this.mates = data;
    });
  }

  addBookPost(): void {
    this.bookPostService.addBookPost(this.newMate).subscribe(mate => {
      this.mates.push(mate);
    });
  }

  deleteBookPost(bookPostToDelete: Mate) {
    this.bookPostService.deleteBookPostById(bookPostToDelete).subscribe(() => {
      this.mates = this.mates.filter(m => m.id !== bookPostToDelete.id)
    });
  }

  editBookPost(bookPostToEdit: Mate) {
    this.bookPostService.updateBookPost(bookPostToEdit).subscribe((updatedPost) => {
      this.router.navigate(['/edit-mate', bookPostToEdit.id]);
      const index = this.mates.findIndex(post => post.id === updatedPost.id);
      if (index !== -1) {
        this.mates[index] = updatedPost;
      }
    });
  }
  
}
