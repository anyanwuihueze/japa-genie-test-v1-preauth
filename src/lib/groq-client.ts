import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (groqClient) return groqClient;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Groq is not configured for this deployment');
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

export const groq = new Proxy({} as Groq, {
  get(_target, property) {
    const client = getGroqClient();
    const value = Reflect.get(client, property, client);

    return typeof value === 'function'
      ? value.bind(client)
      : value;
  },
});
