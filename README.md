# 🌏 Show Company Logo

A modern, bilingual company directory React application that seamlessly displays company information in English and Chinese. Built with React 18, Vite, and WordPress REST API.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF.svg)](https://vitejs.dev/)
[![i18next](https://img.shields.io/badge/i18next-22-26A69A.svg)](https://www.i18next.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC.svg)](https://www.typescriptlang.org/)

## ✨ Key Features

- 🌐 Seamless English/Chinese language switching
- 🖼️ Smart image lazy loading for optimal performance
- 💫 Smooth animations and transitions
- 🎯 SEO-friendly URL structure
- 📱 Fully responsive design
- ⚡ Lightning-fast loading with Vite
- 🔄 Real-time language switching
- 🎨 Clean, modern UI

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14
- WordPress backend with REST API
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ShowCompanyLogo.git

# Navigate to project
cd ShowCompanyLogo

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Technologies

- **Frontend:**
  - React 18
  - TypeScript
  - i18next
  - Intersection Observer API
  - CSS Grid & Flexbox

- **Build Tools:**
  - Vite
  - ESLint
  - Prettier

- **Backend Integration:**
  - WordPress REST API
  - Custom Post Types

## 📖 Documentation

### Project Structure
```
ShowCompanyLogo/
├── public/
│   └── locales/                # Translation files
│       ├── en/
│       └── zh/
│
├── src/
│   ├── components/            # React components
│   │   ├── CompanyCard/      # Company card component
│   │   ├── CompanyList/      # Company list container
│   │   └── LanguageSwitcher/ # Language switching component
│   │
│   ├── services/             # Business logic and API services
│   │   ├── auth.ts          # Authentication and API calls
│   │   └── imageLoader.ts   # Image lazy loading utility
│   │
│   ├── assets/              # Static assets
│   │   ├── fonts/         
│   │   └── main.css         # Global styles   
│   ├── App.jsx            # Root component
│   └── main.jsx           # Application entry point
│
├── vite.config.ts         # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

### Key Components

#### 🎯 CompanyCard
Core component for displaying company information:
- Props: `company: Company`
- Features:
  - Lazy loaded company logo
  - Bilingual content display
  - Contact information
  - Responsive layout

#### 📋 CompanyList
Container component managing company data:
- Features:
  - Data fetching and caching
  - Language-based filtering
  - Error handling
  - Loading states

#### 🌐 LanguageSwitcher
Handles language switching functionality:
- Features:
  - URL-based language routing
  - Language persistence
  - Smooth transitions
  - SEO-friendly links

#### ⚡ ImageLoader
Utility service for optimized image loading:
- Features:
  - Intersection Observer implementation
  - Progressive loading
  - Error handling
  - Memory management

### Service Layer

#### 🔐 AuthService
Manages API communication:
```typescript
interface AuthService {
  fetchCompanies(): Promise<Company[]>;
  fetchMediaWithAuth(mediaId: string): Promise<string>;
}
```

#### 🖼️ ImageLoaderService
Handles image optimization:
```typescript
interface ImageLoaderService {
  init(): void;
  observe(element: HTMLImageElement): void;
  cleanup(): void;
}
```

## 🌐 Language Support

Currently supports:
- English (en)
- Chinese (zh)

Add new languages by creating translation files in `public/locales/{lang}/common.json`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © [2024] [Daniel Zheng]

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [i18next](https://www.i18next.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## 📞 Contact & Support

- Create an issue
- Email: contact@outlook.com

---

<p align="center">
  Made with ❤️ by Daniel Viki
</p>
