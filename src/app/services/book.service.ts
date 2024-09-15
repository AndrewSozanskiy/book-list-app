import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

export interface Book {
  id: number;
  title: string;
  author: string;
  year: Date;
  description?: string;
}

export interface BooksState {
  books: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class BookService extends ComponentStore<BooksState> {
  constructor() {
    super(
      {
        books: [
          { id: 1, title: '1984', author: 'George Orwell', year: new Date('1949'), description: 'A dystopian novel' },
          {
            id: 2,
            title: 'Brave New World',
            author: 'Aldous Huxley',
            year: new Date('1932'),
            description: 'A dystopian science fiction'
          }
        ]
      });
  }

  public books$: Observable<Book[]> = this.select((state: BooksState) => state.books);

  public readonly addBook = this.updater(
    (
      state: BooksState,
      book: Book,
    ): BooksState => ({
      ...state,
      books: [...state.books, {...book, id: state.books.length + 1 }]
    }),
  );

  public readonly updateBook = this.updater(
    (
      state: BooksState,
      updates: Book,
    ): BooksState => {
      const index = state.books.findIndex(book => book.id === updates.id);
      state.books[index] = updates;

      return state;
    },
  );

  public readonly deleteBook = this.updater(
    (
      state: BooksState,
      id: number
    ): BooksState => {
      const index = state.books.findIndex(book => book.id === id);
      const books: Book[] = [
        ...state.books.slice(0, index),
        ...state.books.slice(index + 1),
      ];

      return {
        ...state,
        books
      }
    },
  );
}
