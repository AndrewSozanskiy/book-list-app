import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Book, BookService } from '../../services/book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  imports: [
    MatButtonModule,
    MatListModule,
    NgForOf,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DatePipe
  ],
  styleUrls: ['./book-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(500)),
    ])
  ]
})
export class BookListComponent {
  public filteredBooks$!: Observable<Book[]>;

  public searchControl = new FormControl('');

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
  ) {
    this.getFilteredBooks()
  }

  public trackBy(index: number, item: Book): number {
    return item.id;
  }

  public deleteBook(id: number): void {
    this.bookService.deleteBook(id);
  }

  public openBookDialog(book?: Book): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: book || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      if (result.id) {
        this.bookService.updateBook(result);
        this.getFilteredBooks();
      } else {
        this.bookService.addBook(result);
      }
    });
  }

  private getFilteredBooks(): void {
    this.filteredBooks$ = combineLatest([
      this.bookService.books$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(query => query!.toLowerCase())
      )
    ]).pipe(
      map(([books, query]) =>
        books.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        )
      )
    );
  }
}
