import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface QAItem {
  id: string
  title: string
  content: string
}

export function getQAItems(): QAItem[] {
  const qaDirectory = path.join(process.cwd(), 'qa')
  
  if (!fs.existsSync(qaDirectory)) {
    console.warn(`The 'qa' directory does not exist at ${qaDirectory}. Please create it and add some Markdown files.`)
    return []
  }

  const filenames = fs.readdirSync(qaDirectory)
  
  const qaItems = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(qaDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        id: filename.replace(/\.md$/, ''),
        title: data.title || 'Untitled',
        content: content
      }
    })

  return qaItems
}

