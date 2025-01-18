import WordQueryAndQA from '@/components/word-query-and-qa'
import { getQAItems } from '@/lib/mdUtils'

export default function Home() {
  const qaItems = getQAItems()

  return (
    <main className="container mx-auto p-4">
      {qaItems.length > 0 ? (
        <WordQueryAndQA qaItems={qaItems} />
      ) : (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">No Q&A Items Found</p>
          <p>Please create a 'qa' directory in the project root and add some Markdown files to it.</p>
        </div>
      )}
    </main>
  )
}

