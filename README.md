# 📚 KnowVault Frontend - School Project

> A modern React TypeScript frontend application for document management and knowledge sharing

## 🎓 About This Project

KnowVault is a school project that demonstrates modern web development practices using React, TypeScript, and containerization. It's a knowledge management platform where users can organize documents into shelves and books, similar to a digital library.

## ✨ Key Features

- 📖 **Public Book Browsing** - View books and shelves without authentication
- 🔐 **User Authentication** - OIDC integration with Keycloak
- 📝 **Document Management** - Create, edit, and organize content
- 🏷️ **Tagging System** - Categorize and search content
- 📱 **Responsive Design** - Works on desktop and mobile
- 🐳 **Docker Ready** - Containerized for easy deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd front-knowvault

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## 🛠️ Tech Stack

### Core Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Client-side routing

### UI & Styling

- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library

### Development Tools

- **ESLint** - Code linting
- **Docker** - Containerization
- **GitLab CI/CD** - Automated deployment

### Authentication

- **OIDC** - OpenID Connect
- **Keycloak** - Identity provider

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout
│   └── Navigation.tsx  # Navigation bar
├── pages/              # Application pages
│   ├── Dashboard.tsx   # User dashboard
│   ├── Books.tsx       # Book management
│   └── PublicBooks.tsx # Public book view
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API
├── types/              # TypeScript definitions
└── assets/             # Images and static files
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint (allows 50 warnings)
npm run lint:fix         # Auto-fix linting issues
npm run type-check       # Check TypeScript types

# Docker
docker build --target production -t knowvault-frontend .
docker run -p 3000:80 knowvault-frontend
```

## � Docker Deployment

The project includes a production-ready Docker setup:

```bash
# Build production image
docker build --target production -t knowvault-frontend .

# Run container
docker run -d -p 3000:80 --name knowvault knowvault-frontend

# Access application at http://localhost:3000
```

## 🚀 CI/CD Pipeline

The project uses GitLab CI/CD with three stages:

1. **Lint** - Code quality checks (non-blocking)
2. **Build** - Create Docker image
3. **Deploy** - Manual deployment to production

Pipeline features:

- ✅ Automatic builds on push to main
- ✅ Code quality feedback without blocking
- ✅ Manual deployment approval
- ✅ Container registry integration

## 🎯 Learning Objectives

This project demonstrates:

- **Modern React Development** with hooks and TypeScript
- **Component-Based Architecture** with reusable components
- **State Management** using React Query and custom hooks
- **Authentication Flow** with OIDC and protected routes
- **Responsive Design** with Tailwind CSS
- **Containerization** with Docker multi-stage builds
- **CI/CD Practices** with automated testing and deployment
- **Code Quality** with ESLint and TypeScript

## 🔐 Authentication Flow

The app supports both public and authenticated access:

### Public Routes

- `/` - Home page with public shelves
- `/public-books` - Browse public books
- `/public-shelves` - View public collections

### Protected Routes (Login Required)

- `/dashboard` - Personal dashboard
- `/books` - Manage your books
- `/shelves` - Organize your shelves
- `/favorites` - Bookmarked content

## 🎨 UI Components

Built with modern, accessible components:

- **Navigation** - Responsive header with user menu
- **Cards** - Book and shelf preview cards
- **Modals** - Create/edit dialogs
- **Forms** - Validated input forms
- **Toast** - User feedback notifications

## � Responsive Design

The application is fully responsive:

- **Desktop** - Full-featured interface
- **Tablet** - Optimized layouts
- **Mobile** - Touch-friendly navigation

## 🤝 Contributing

This is a school project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📖 Documentation

Additional documentation:

- [`DOCKER_USAGE.md`](./DOCKER_USAGE.md) - Docker setup and usage
- [`GITLAB_CI_SETUP.md`](./GITLAB_CI_SETUP.md) - CI/CD configuration
- [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md) - Complete project overview

## 🎓 Educational Notes

### What Makes This School-Friendly

- **Simple Architecture** - Easy to understand structure
- **Non-Blocking Linting** - Code quality feedback without penalties
- **Manual Deployment** - Safe deployment practices
- **Comprehensive Documentation** - Learning-focused explanations
- **Modern Practices** - Industry-standard tools and patterns

### Skills Demonstrated

- Frontend development with React and TypeScript
- Modern CSS with Tailwind and component libraries
- Authentication and security practices
- Docker containerization
- CI/CD pipeline setup
- Code quality and linting
- Git workflow and collaboration

## 📄 License

This is a school project for educational purposes.

## 🙏 Acknowledgments

- **Norsys** - Project sponsor and logo provider
- **shadcn/ui** - Amazing component library
- **Keycloak** - Authentication solution
- **React Community** - Excellent documentation and tools

---

_Built with ❤️ for learning modern web development_
