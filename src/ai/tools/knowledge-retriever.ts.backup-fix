'use server';
/**
 * @fileOverview A Genkit tool for retrieving content from a local knowledge base.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const knowledgeBasePath = path.join(process.cwd(), 'src', 'ai', 'knowledge');

export const getKnowledge = ai.defineTool(
  {
    name: 'getKnowledge',
    description: 'Retrieves content from the knowledge base to answer user questions. Use this tool first before using general knowledge.',
    inputSchema: z.object({
      query: z.string().describe('A summary of the user\'s question to search for in the knowledge base.'),
    }),
    outputSchema: z.string().describe('The content of the knowledge base files.'),
  },
  async () => {
    try {
      const files = await fs.readdir(knowledgeBasePath);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      if (markdownFiles.length === 0) {
        return 'No knowledge base files found.';
      }

      let knowledge = '';
      for (const file of markdownFiles) {
        const filePath = path.join(knowledgeBasePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        knowledge += `--- KNOWLEDGE FROM ${file} ---\n${content}\n\n`;
      }

      return knowledge;
    } catch (error) {
      console.error('Error reading knowledge base:', error);
      if ((error as any).code === 'ENOENT') {
        return "The knowledge base directory does not exist. You may need to create it.";
      }
      return 'An error occurred while trying to access the knowledge base.';
    }
  }
);
