import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-foot-image.ts';
import '@/ai/flows/check-shoe-availability.ts';
import '@/ai/flows/recommend-shoe-size.ts';