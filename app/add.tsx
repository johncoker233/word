

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown'
import { QAItem } from '@/lib/mdUtils'
import { Loader2 } from 'lucide-react'

export default function AddWords() {
  const [words, setWords] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddWords = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('https://wordapi.modujobs.tech/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: words,
      })

      if (!response.ok) {
        throw new Error('Failed to add words')
      }

      setSuccess('Words added successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
        <Card className="mb-8 backdrop-blur-xl bg-white/70 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Add Words</h1>
          <CardContent className="pt-6">
            <form onSubmit={handleAddWords} className="max-w-2xl mx-auto flex flex-col gap-4">
              <textarea
                placeholder="Enter words in JSON array format..."
                value={words}
                onChange={(e) => setWords(e.target.value)}
                className="flex-grow bg-white/50 backdrop-blur-sm border-transparent focus:border-green-300 transition-all duration-300 rounded-md p-3"
                rows={8}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 transition-colors duration-300">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 bg-red-50/80 backdrop-blur-xl animate-slideIn">
            <CardContent className="text-red-500">{error}</CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-8 bg-green-50/80 backdrop-blur-xl animate-slideIn">
            <CardContent className="text-green-500">{success}</CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl backdrop-blur-xl bg-white/90">
            <DialogHeader>
              <DialogTitle>Instructions</DialogTitle>
            </DialogHeader>
            <div className="mt-2 max-h-[70vh] overflow-y-auto">
              <ReactMarkdown>{`Please provide the words in the following format:

\`\`\`
[
  {
    "word": "example",
    "literal_translation": "sample translation",
    "english_translation": "example",
    "usage": "This is an example usage."
  },
  {
    "word": "test",
    "literal_translation": "sample test",
    "english_translation": "test",
    "usage": "This is a test usage."
  }
]
\`\`\``}</ReactMarkdown>
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
      `}</style>
    </div>
  )
}
