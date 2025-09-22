# Welcome to Your Knowledge Base

This is the beginning of your AI's custom knowledge. You can add, edit, and delete markdown (.md) files in this `src/ai/knowledge` directory.

## How it Works

1.  **Add Files**: Create new `.md` files in this directory. Each file should cover a specific topic. For example, `schengen-visa-tips.md`.
2.  **Write Content**: Use standard markdown to write your content. You can use headers, lists, bold text, etc.
3.  **Ask the AI**: The AI Chat Assistant is now configured to read all the files in this directory before answering a question. It will use the information it finds here as its primary source of truth.

## Example

If you add a file named `canada-student-visa.md` with the content:

```
To apply for a Canadian student visa, you must have an acceptance letter from a Designated Learning Institution (DLI). The application fee is $150 CAD.
```

And then you ask the AI chat: "What is the fee for a Canadian student visa?", it will now answer "$150 CAD" based on the information you provided right here.
