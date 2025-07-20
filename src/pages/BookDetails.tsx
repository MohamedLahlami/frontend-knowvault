import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function BookDetails() {
  const { id } = useParams()
  const books = [
    { id: 1, title: "Guide de démarrage React", description: "Introduction complète au développement avec React", author: "Équipe Documentation", shelf: "Documentation technique", pageCount: 24, lastUpdated: "Il y a 2 heures", color: "bg-blue-100 text-blue-800" },
    { id: 2, title: "Bonnes pratiques JavaScript", description: "Conventions et bonnes pratiques pour JavaScript moderne", author: "Équipe Dev", shelf: "Documentation technique", pageCount: 18, lastUpdated: "Hier", color: "bg-green-100 text-green-800" },
    { id: 3, title: "Manuel utilisateur CRM", description: "Guide complet d'utilisation du système CRM", author: "Support Client", shelf: "Guides utilisateur", pageCount: 32, lastUpdated: "Il y a 3 jours", color: "bg-purple-100 text-purple-800" },
    { id: 4, title: "Procédure d'onboarding", description: "Processus d'intégration des nouveaux employés", author: "RH", shelf: "Procédures internes", pageCount: 12, lastUpdated: "Il y a 1 semaine", color: "bg-orange-100 text-orange-800" },
    { id: 5, title: "Architecture microservices", description: "Guide d'architecture pour les microservices", author: "Tech Lead", shelf: "Architecture", pageCount: 28, lastUpdated: "Il y a 5 jours", color: "bg-red-100 text-red-800" },
    { id: 6, title: "Formation TypeScript", description: "Cours complet sur TypeScript pour débutants", author: "Formateur", shelf: "Formation", pageCount: 45, lastUpdated: "Il y a 2 jours", color: "bg-pink-100 text-pink-800" }
  ]

  const book = books.find(b => b.id === parseInt(id))

  if (!book) {
    return <div className="p-6 text-center text-muted-foreground">📚 Livre non trouvé.</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{book.title}</h1>
        <Badge variant="secondary" className={book.color}>{book.shelf}</Badge>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-muted-foreground">Détails du livre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base text-foreground">{book.description}</p>
          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Auteur:</span> {book.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {book.lastUpdated}
            </div>
            <div>
              <span className="font-medium text-foreground">Nombre de pages:</span> {book.pageCount}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/books">← Retour à la liste</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to={`/books/${book.id}/edit`}>Modifier ce livre</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to={`/books/${book.id}/chapitres`}>Voir les chapitres</Link>
        </Button>
        <Button variant="default" asChild>
          <Link to={`/books/${book.id}/etagere`}>Voir l'étagère</Link>
        </Button>
      </div>
    </div>
  )
}
