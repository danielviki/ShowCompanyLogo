# Company Logo Directory

## Overview
A web application for showcasing company logos and information with multilingual support (English/Chinese) built using vanilla JavaScript and Vite.

## Features
- 🌐 Multilingual support (English/Chinese)
- 🔐 JWT Authentication
- 🖼️ Responsive grid layout
- 🎨 Modern UI design
- 🔄 CORS enabled
- 📱 Mobile-friendly interface

## Prerequisites
- Node.js (v14 or higher)
- WordPress backend with JWT Authentication plugin
- PHP 7.4 or higher

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/company-logo-directory.git
cd company-logo-directory

# Install dependencies
npm install
```

## Configuration

1. Create a .env file in the project root:

```bash
VITE_API_URL=http://localhost:8080
VITE_WP_USERNAME=your_username
VITE_WP_PASSWORD=your_password
```

2. Configure WordPress:
- Install and activate JWT Authentication plugin
- Add custom CORS headers

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

```plaintext
ShowCompanyLogo/
├── frontend/
│   ├── index.html
│   └── src/
│       ├── assets/
│       │   ├── main.css
│       │   └── fonts/
│       ├── services/
│       │   └── auth.js
│       └── main.js
├── .env
├── .gitignore
├── package.json
└── vite.config.js
```

## API Endpoints

### Authentication
- `POST /wp-json/jwt-auth/v1/token` - Get JWT token
- `POST /wp-json/jwt-auth/v1/token/refresh` - Refresh JWT token

### Companies
- `GET /wp-json/wp/v2/company` - List all companies
- `GET /wp-json/wp/v2/company/{id}` - Get company details

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License.

## Acknowledgments
- Vite.js for the build tooling
- WordPress REST API
- JWT Authentication
- Noto Sans fonts for multilingual support

## Contact
Your Name - [@danielviki](https://github.com/danielviki)
Project Link: [https://github.com/danielviki/ShowCompanyLogo](https://github.com/danielviki/ShowCompanyLogo)

---

## Development Notes

### Environment Variables
Make sure to create a `.env.example` file without sensitive data for reference:

```bash
VITE_API_URL=http://localhost:8080
VITE_WP_USERNAME=your_username_here
VITE_WP_PASSWORD=your_password_here
```

### WordPress Setup
Follow these steps to configure your WordPress backend:

1. Install required plugins
2. Configure CORS headers
3. Set up JWT authentication
4. Create company custom post type

For detailed setup instructions, see WordPress Configuration Guide.
