'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const moodData = [
  { date: '2023-05-01', mood: 7 },
  { date: '2023-05-02', mood: 6 },
  { date: '2023-05-03', mood: 8 },
  { date: '2023-05-04', mood: 5 },
  { date: '2023-05-05', mood: 9 },
  { date: '2023-05-06', mood: 7 },
  { date: '2023-05-07', mood: 8 },
]

export default function MoodTracking() {
  const [mood, setMood] = useState(5)
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the mood data to your backend
    console.log('Mood:', mood, 'Note:', note)
    setNote('')
  }

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
          <CardTitle>Mood Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Based on your mood trends, here are some insights:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Your mood tends to improve on weekends.</li>
            <li>Consider taking breaks during study sessions to maintain a positive mood.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

