import { Book, BookOpen,Star , Search,ListTree,Home, Settings, Plus, LogIn, LogOut, User, Library } from "lucide-react"
import { NavLink, useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "react-oidc-context"
import norsysLogo from "@/assets/logo-norsys.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Extend the User type to include OIDC user properties
interface OidcUser {
  preferred_username?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Public navigation items (available to everyone)
const publicItems = [
  { title: "Étagères", url: "/public-shelves", icon: Library },
  { title: "Livres", url: "/public-books", icon: Book },
]

// Protected navigation items (require authentication)
const protectedItems = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home },
  { title: "Étagères", url: "/shelves", icon: BookOpen },
  { title: "Livres", url: "/books", icon: Book },
  { title: "Chapitres", url: "/chapters", icon: ListTree  },
  { title: "Favoris", url: "/favoris", icon: Star},
  { title: "Recherche", url: "/search", icon: Search},
 
]

const adminItems = [
  { title: "Paramètres", url: "/settings", icon: Settings },
]

export function HorizontalNavigation() {
  const location = useLocation()
  const currentPath = location.pathname
  const auth = useAuth()

  const isActive = (path: string) => currentPath === path

  const navigationItems = auth.isAuthenticated ? protectedItems : publicItems

  const handleLogin = () => {
    auth.signinRedirect()
  }

  const handleLogout = () => {
    auth.signoutRedirect()
  }

  // Cast user to OidcUser for type safety
  const user = auth.user as OidcUser;

  return (
    <div className="w-full bg-card border-b">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: "#f0fdf4" }}>
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src={norsysLogo} 
            alt="Norsys Logo" 
            className="h-8 w-auto"
          />
          <div className="w-px h-6 bg-border" />
          <BookOpen className="h-6 w-6 text-green-600" />
          <h1 className="font-bold text-lg text-green-600">KnowVault</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {!auth.isAuthenticated ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleLogin}
            >
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user?.preferred_username || user?.name || 'Utilisateur'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user?.preferred_username || user?.name || 'Utilisateur'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-black hover:text-white focus:text-white hover:bg-red-600 focus:bg-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center px-4 py-2 gap-1">
        {/* Main navigation items */}
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.url)
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 hover:text-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}

        {/* Show admin items only for authenticated users */}
        {auth.isAuthenticated && (
          <>
            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Admin items */}
            {adminItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.url)
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
