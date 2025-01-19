'use client'

interface Journal {
  date: string;
  content: string;
  sentiment: number;
}

export function JournalList({ journals }: { journals: Journal[] }) {
  return (
    <div className="space-y-4">
      {journals.map((journal, index) => (
        <div key={index} className="p-4 border rounded">
          <div className="text-sm text-gray-500">
            {new Date(journal.date).toLocaleDateString()}
          </div>
          <div className="mt-2">{journal.content}</div>
          <div className="mt-2 text-sm">Mood: {journal.sentiment}/10</div>
        </div>
      ))}
    </div>
  )
} 