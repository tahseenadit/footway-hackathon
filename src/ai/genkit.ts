
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  apiKey:"AIzaSyCD5tkNFhCKir1BRREhqmp9rmIX2qEhiyI",
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
