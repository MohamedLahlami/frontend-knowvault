# 📚 KnowVault - Plateforme de Gestion des Connaissances

KnowVault est une application web de gestion des connaissances qui permet d'organiser, partager et consulter des documents de manière structurée avec des étagères et des livres.

## 🚀 Installation Rapide

### Prérequis
- **Node.js** v18+ ([Télécharger ici](https://nodejs.org/))
- **npm**
- **Git** pour le versioning

### Étapes d'installation

```bash
# 1. Cloner le projet
git clone <URL_DU_DEPOT>
cd <nom_projet>

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
Modifier le fichier .env avec vos paramètres

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir http://localhost:5173 dans votre navigateur
```

## 🏗️ Architecture du Projet

```
src/
├── components/         # Composants réutilisables
│   ├── ui/            # Composants UI de base (shadcn)
│   ├── Layout.tsx     # Layout principal
│   ├── HorizontalNavigation.tsx  # Navigation
│   └── ProtectedRoute.tsx        # Protection des routes
├── pages/             # Pages de l'application
│   ├── PublicBooks.tsx     # Livres publics
│   ├── PublicShelves.tsx   # Étagères publiques
│   ├── Dashboard.tsx       # Tableau de bord (protégé)
│   └── ...
├── hooks/             # Hooks personnalisés
│   ├── useAuthenticatedApi.ts  # API avec authentification
│   └── use-toast.ts           # Notifications toast
├── lib/               # Utilitaires et configuration
│   ├── api.ts         # Service API
│   ├── oidcConfig.ts  # Configuration authentification
│   └── utils.ts       # Fonctions utilitaires
├── assets/            # Ressources (images, logos)
└── main.tsx          # Point d'entrée de l'application
```

## 🔐 Authentification

Le projet utilise l'authentification **OIDC** avec **Keycloak** :

### Routes Publiques (sans authentification)
- `/` - Page d'accueil (étagères publiques)
- `/public-books` - Livres accessibles à tous
- `/public-shelves` - Collections publiques

### Routes Protégées (authentification requise)
- `/dashboard` - Tableau de bord utilisateur
- `/books` - Gestion des livres
- `/shelves` - Gestion des étagères
- `/settings` - Paramètres (admin uniquement)

## 🛠️ Technologies Utilisées

### Frontend Core
- **React 18** - Bibliothèque UI moderne
- **TypeScript** - JavaScript typé pour plus de sécurité
- **Vite** - Build tool ultra-rapide
- **React Router** - Routage côté client

### UI/UX
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes et accessibles
- **Lucide React** - Icônes SVG optimisées
- **Radix UI** - Composants UI primitifs

### Outils de Développement
- **ESLint** - Linter JavaScript/TypeScript
- **PostCSS** - Transformation CSS

## 🎨 Fonctionnalités

### 🔓 Accès Public
- **Consultation libre** des étagères et livres publics
- **Recherche** dans le contenu public
- **Interface responsive** pour mobile et desktop

### 🔐 Fonctionnalités Authentifiées
- **Gestion des livres** - CRUD complet
- **Organisation en étagères** - Collections thématiques
- **Tableau de bord** personnel
- **Gestion des rôles** (utilisateur/admin)

### 🎯 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Composants accessibles** avec Radix UI
- **Notifications toast** pour le feedback utilisateur
- **Navigation intuitive** avec logos Norsys

## 📚 Ressources d'Apprentissage

- [Documentation React](https://react.dev/)
- [Guide TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contribution

### Workflow Git
1. **Fork** le projet
2. **Créer une branche** : `git checkout -b feature/ma-fonctionnalite`
3. **Commit** : `git commit -m "feat: ajouter nouvelle fonctionnalité"`
4. **Push** : `git push origin feature/ma-fonctionnalite`
5. **Pull Request** 

### Standards de Code
- **ESLint** : Respecter les règles configurées
- **TypeScript** : Typer toutes les variables et fonctions
- **Naming** : Noms de variables et fonctions en anglais
- **Comments** : Commenter le code complexe