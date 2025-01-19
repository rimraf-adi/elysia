'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import JournalList from "@/components/ui/JournalList"

interface Journal {
  date: string;
  content: string;
  sentiment: number;
}

export default function MoodTracking() {
  const [mood, setMood] = useState(5)
  const [note, setNote] = useState('')
  const [journals, setJournals] = useState<Journal[]>([])

  useEffect(() => {
    fetchJournals()
  }, [])

  const fetchJournals = async () => {
    try {
      const response = await fetch('http://localhost:5000/journal', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch journals');
      }
      const data = await response.json()
      setJournals(data)
    } catch (error) {
      console.error('Failed to fetch journals:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          content: note,
          date: new Date().toISOString(),
          tags: ['mood'],
          sentiment: mood,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }
      setNote('')
      setMood(5)
      await fetchJournals()
    } catch (error) {
      console.error('Failed to save mood:', error)
    }
  }

  const moodData = journals?.length
    ? journals
        .slice(-7) // Get last 7 entries
        .map(entry => ({
          date: new Date(entry.date).toISOString().split('T')[0],
          mood: entry.sentiment
        }))
    : []

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Mood Tracking</h1>
        <p className="text-gray-600 mb-4">
          Keep track of your daily mood and reflect on your emotions.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={1}
              max={10}
              step={1}
              value={[mood]}
              onValueChange={(value) => setMood(value[0])}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>😢 Very Sad</span>
              <span>😊 Very Happy</span>
            </div>
            <Textarea
              placeholder="Add a note about your day..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button onClick={handleSubmit}>Save Mood</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalList journals={journals} />
        </CardContent>
      </Card>
    </div>
  )
}

