export class BookPost {
  // Keep old property names for compatibility, and mirror the new `Mate` fields.
  id: number;
  title: string; // legacy -> maps to name
  author: string; // legacy -> maps to brand
  genre: string; // legacy -> maps to category
  description: string;
  condition: string;
  price: number;
  imageUrl: string;
  userId: number;
  date?: string | null;

  // New-style fields (kept for compatibility with `Mate` usage)
  name: string;
  brand: string;
  category: string;

  constructor(
    id: number,
    title: string,
    author: string,
    genre: string,
    description: string,
    condition: string,
    price: number,
    imageUrl: string,
    userId: number,
    date?: string | null,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.description = description;
    this.condition = condition;
    this.price = price;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.date = date ?? null;

    // mirror values to new fields
    this.name = title;
    this.brand = author;
    this.category = genre;
  }
}
