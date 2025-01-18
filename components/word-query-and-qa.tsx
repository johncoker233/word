'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown'
import { QAItem } from '@/lib/mdUtils'
import { Loader2 } from 'lucide-react'

interface WordQueryResult {
  word: string;
  literal_translation: string;
  chinese: string;
  usage: string;
}

interface WordQueryAndQAProps {
  qaItems: QAItem[]
}

export default function WordQueryAndQA({ qaItems }: WordQueryAndQAProps) {
  const [word, setWord] = useState('')
  const [queryResult, setQueryResult] = useState<WordQueryResult | null>(null)
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWordQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://your-worker.workers.dev/?word=${encodeURIComponent(word)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch word definition')
      }
      const data: WordQueryResult = await response.json()
      setQueryResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setQueryResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQAClick = (qa: QAItem) => {
    setSelectedQA(qa)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleWordQuery} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Query
        </Button>
      </form>

      {error && (
        <Card className="mb-4 bg-red-50">
          <CardContent className="text-red-500">{error}</CardContent>
        </Card>
      )}

      {queryResult && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Query Result: {queryResult.word}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>直译：</strong> {queryResult.literal_translation}</p>
            <p><strong>中文：</strong> {queryResult.chinese}</p>
            <p><strong>用法：</strong> {queryResult.usage}</p>
          </CardContent>
        </Card>
      )}

      {qaItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {qaItems.map(qa => (
            <Card 
              key={qa.id} 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleQAClick(qa)}
            >
              <CardHeader>
                <CardTitle>{qa.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No Q&A items available.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedQA?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 max-h-[70vh] overflow-y-auto">
            <ReactMarkdown>{selectedQA?.content || ''}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

