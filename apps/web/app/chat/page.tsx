'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AnonymousChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: "user" }])
      setInput("")
      // Here you would typically send the message to your backend or AI service
      // and then add the response to the messages array
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Anonymous Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded ${
                  message.sender === "user" ? "bg-blue-200 ml-auto" : "bg-white"
                } max-w-[80%]`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Your chat is completely anonymous and confidential. Feel free to express yourself openly.
      </p>
    </div>
  )
}

