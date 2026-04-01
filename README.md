# FeedUp Bot - Food Delivery App

A modern food delivery application built with React, TypeScript, and Vite. Styled with plain CSS to match the FeedUp Bot design.

## Features

### Screen 1 & 2: Menu View
- User profile header with location selector
- Search bar for finding products
- Category tabs (Kombo, Lavash, Burger, Хот-дог, Sendvich)
- Product grid with images and prices
- Add to cart functionality with quantity controls
- Sticky cart footer showing total price
- "Savat" (Cart) checkout button

### Screen 3: Product Detail Modal
- Full-screen product image
- Favorite/like button
- Close button
- Product name and description
- Quantity selector
- "Savatga qo'shish" (Add to Cart) button with total price

## Design Features

- **Mobile-first responsive design**
- **Plain CSS** (no Tailwind or CSS frameworks)
- **Smooth animations** and transitions
- **Modal overlay** for product details
- **Sticky cart footer** that appears when items are added
- **Clean, modern UI** matching the FeedUp Bot style

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd zen-gastro-coffee-shop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── MenuView.tsx & MenuView.css       # Main menu/catalog view
│   ├── ProductDetail.tsx & ProductDetail.css  # Product detail modal
├── assets/                               # Product images
├── App.tsx                               # Main app component
├── App.css                               # Global styles
└── main.tsx                              # App entry point
```

## Mock Data

The application currently uses mock data for:
- Product catalog (Kombo items)
- Product details
- Prices and descriptions

Replace the mock data with real API calls when integrating with backend.

## Technologies Used

- React 19
- TypeScript
- Vite
- Plain CSS3 (no frameworks)
- ESLint for code quality

## Color Scheme

- Primary Red: `#e63946`
- Background: `#f5f5f5`
- Card Background: `#fff`
- Product Image BG: `#5fb3b3`
- Text: `#000`, `#333`, `#666`