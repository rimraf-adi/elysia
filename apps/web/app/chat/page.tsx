'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'partner' | 'system';
}

export default function AnonymousChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'waiting' | 'chatting'>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    connectToChat()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connectToChat = () => {
    setStatus('connecting')
    const ws = new WebSocket('ws://localhost:5000') // Update with your WebSocket server URL

    ws.onopen = () => {
      console.log('Connected to chat server')
      // Join the queue with preferences
      ws.send(JSON.stringify({
        type: 'joinQueue',
        data: {
          preferences: {
            language: 'en', // You can make this dynamic
            interests: ['general'] // You can make this dynamic
          }
        }
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'queueStatus':
          setStatus('waiting')
          addSystemMessage('Looking for a chat partner...')
          break
        
        case 'chatStarted':
          setStatus('chatting')
          addSystemMessage('Connected with a chat partner! You can start chatting.')
          break
        
        case 'chatMessage':
          addMessage(data.data.message, 'partner')
          break
        
        case 'chatEnded':
          setStatus('disconnected')
          addSystemMessage(`Chat ended: ${data.data.reason}`)
          break
        
        case 'error':
          addSystemMessage(`Error: ${data.data}`)
          break
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      addSystemMessage('Disconnected from chat server')
    }

    wsRef.current = ws
  }

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system'
    }])
  }

  const addMessage = (text: string, sender: 'user' | 'partner') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender
    }])
  }

  const handleSend = () => {
    if (input.trim() && wsRef.current && status === 'chatting') {
      wsRef.current.send(JSON.stringify({
        type: 'chatMessage',
        data: { message: input.trim() }
      }))
      addMessage(input.trim(), 'user')
      setInput("")
    }
  }

  const handleSkip = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'skip', data: {} }))
      setStatus('waiting')
      addSystemMessage('Looking for a new chat partner...')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Anonymous Chat</CardTitle>
          <div className="flex items-center gap-2">
            {status === 'waiting' && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="text-sm capitalize">{status}</span>
            {status === 'chatting' && (
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Skip Partner
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-muted rounded">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : message.sender === 'partner'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted-foreground/10 text-muted-foreground text-sm text-center mx-auto'
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={status !== 'chatting'}
            />
            <Button 
              onClick={handleSend}
              disabled={status !== 'chatting'}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Your chat is completely anonymous and confidential. Feel free to express yourself openly.
      </p>
    </div>
  )
}

