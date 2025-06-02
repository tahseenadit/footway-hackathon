
import type { AnalyzeFootImageOutput } from "@/ai/flows/analyze-foot-image.types";
import type { RecommendShoeSizeOutput } from "@/ai/flows/recommend-shoe-size.types";
import type { CheckShoeAvailabilityOutput } from "@/ai/flows/check-shoe-availability.types";

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'image_input' | 'analysis_result' | 'recommendation_result' | 'availability_result' | 'error' | 'loading';
  textContent?: string;
  imageDataUri?: string; // For user-uploaded images being sent or displayed
  analysisData?: AnalyzeFootImageOutput;
  recommendationData?: RecommendShoeSizeOutput;
  availabilityData?: CheckShoeAvailabilityOutput;
  errorDetails?: string;
  timestamp: Date;
}
