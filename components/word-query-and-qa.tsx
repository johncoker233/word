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
      const response = await fetch(`https://wordapi.modujobs.tech/?word=${encodeURIComponent(word)}`)
      if (response.status === 404) {
        setError('Not included yet, please contact eteam2429@gmail.com')
        setQueryResult(null)
        return
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
        <Card className="mb-8 backdrop-blur-xl bg-white/70 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Hot Word Query</CardTitle>
        </CardHeader>          
        <CardContent className="pt-6">
            <form onSubmit={handleWordQuery} className="max-w-2xl mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Enter a word..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="flex-grow bg-white/50 backdrop-blur-sm border-transparent focus:border-blue-300 transition-all duration-300"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 bg-red-50/80 backdrop-blur-xl animate-slideIn">
            <CardContent className="text-red-500">{error}</CardContent>
          </Card>
        )}

        {queryResult && (
          <Card className="mb-8 backdrop-blur-xl bg-white/70 shadow-lg animate-slideIn">
            <CardHeader>
              <CardTitle>Search Result: {queryResult.word}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="p-3 bg-white/40 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <strong>Literal Translation:</strong> {queryResult.literal_translation}
                </p>
                <p className="p-3 bg-white/40 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <strong>Chinese:</strong> {queryResult.chinese}
                </p>
                <p className="p-3 bg-white/40 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/60">
                  <strong>Usage Example:</strong> {queryResult.usage}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 backdrop-blur-xl bg-white/70 shadow-lg">
          <CardHeader>
            <CardTitle>Q&A Section</CardTitle>
          </CardHeader>
          <CardContent>
            {qaItems.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {qaItems.map(qa => (
                  <Card
                    key={qa.id}
                    className="cursor-pointer bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 transform hover:scale-102"
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
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl backdrop-blur-xl bg-white/90">
            <DialogHeader>
              <DialogTitle>{selectedQA?.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-2 max-h-[70vh] overflow-y-auto">
              <ReactMarkdown>{selectedQA?.content || ''}</ReactMarkdown>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  )
}