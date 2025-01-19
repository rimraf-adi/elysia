'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Post {
  id: string
  title: string
  content: string
  author: {
    username: string
  }
  _count: {
    comments: number
    votes: number
  }
  comments?: Array<{
    id: string
    content: string
    author: {
      username: string
    }
    createdAt: string
  }>
}

interface PostDialogProps {
  postId: string
  isOpen: boolean
  onClose: () => void
}

export function PostDialog({ postId, isOpen, onClose }: PostDialogProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && postId) {
      fetchPost()
    }
  }, [isOpen, postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch post')
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:5000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: newComment
        })
      })
      if (!response.ok) throw new Error('Failed to add comment')
      setNewComment('')
      await fetchPost() // Refresh post data to show new comment
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {post ? (
          <>
            <DialogHeader>
              <DialogTitle>{post.title}</DialogTitle>
              <div className="text-sm text-gray-500">
                Posted by {post.author.username} • {post._count.votes} likes
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Post Content */}
              <div className="mt-4">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Comments Section */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Comments ({post._count.comments})</h3>
                
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="mb-2"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments?.map((comment) => (
                    <div key={comment.id} className="border-l-2 pl-4">
                      <div className="text-sm text-gray-500">
                        {comment.author.username} • {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                      <p className="mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">Loading...</div>
        )}
      </DialogContent>
    </Dialog>
  )
} 