import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Journal {
  id: string
  content: string
  date: string
  sentiment: number
  tags: string[]
}

interface JournalListProps {
  journals: Journal[]
}

export default function JournalList({ journals }: JournalListProps) {
  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <Card key={journal.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{new Date(journal.date).toLocaleDateString()}</span>
              <span>Mood: {journal.sentiment}/10</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{journal.content}</p>
            <div className="mt-2 flex gap-2">
              {journal.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 