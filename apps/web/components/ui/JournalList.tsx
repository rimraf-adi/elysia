'use client'

interface Journal {
  date: string;
  content: string;
  sentiment: number;
}

export default function JournalList({ journals }: { journals: Journal[] }) {
  if (!journals?.length) {
    return <div className="text-gray-500">No journal entries yet.</div>
  }

  return (
    <div className="space-y-4">
      {journals.map((journal, index) => (
        <div key={index} className="p-4 border rounded">
          <div className="text-sm text-gray-500">
            {new Date(journal.date).toLocaleDateString()} at{' '}
            {new Date(journal.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="mt-2">{journal.content}</div>
          <div className="mt-2 text-sm">Mood: {journal.sentiment}/10</div>
        </div>
      ))}
    </div>
  )
} 