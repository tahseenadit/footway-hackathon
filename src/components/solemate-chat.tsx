
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/lib/types';
import ChatInput from './chat-input';
import ChatMessagesArea from './chat-messages-area';

import { analyzeFootImage } from '@/ai/flows/analyze-foot-image';
import { recommendShoeSize } from '@/ai/flows/recommend-shoe-size';
import { checkShoeAvailability } from '@/ai/flows/check-shoe-availability';

import type { AnalyzeFootImageInput, AnalyzeFootImageOutput } from '@/ai/flows/analyze-foot-image.types';
import type { RecommendShoeSizeInput, RecommendShoeSizeOutput } from '@/ai/flows/recommend-shoe-size.types';
import type { CheckShoeAvailabilityInput, CheckShoeAvailabilityOutput } from '@/ai/flows/check-shoe-availability.types';

import { useToast } from "@/hooks/use-toast";
import { Footprints } from 'lucide-react';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function SoleMateChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, id: crypto.randomUUID(), timestamp: new Date() },
    ]);
  }, []);

  useEffect(() => {
    addMessage({
      sender: 'ai',
      type: 'text',
      textContent: "Welcome to SoleMate AI! Upload an image of your foot or shoe, and I'll help you find the right size.",
    });
  }, [addMessage]);

  const handleSendMessage = async (text: string, imageFile?: File) => {
    setIsLoading(true);

    let currentImageDataUri: string | undefined = undefined;

    if (imageFile) {
      addMessage({
        sender: 'user',
        type: 'image_input',
        textContent: text || `Checking this image: ${imageFile.name}`,
        imageDataUri: URL.createObjectURL(imageFile), // For optimistic display
      });
      try {
        currentImageDataUri = await fileToDataUri(imageFile);
      } catch (error) {
        console.error("Error converting file to Data URI:", error);
        addMessage({
          sender: 'ai', type: 'error', errorDetails: 'Failed to process image file.'
        });
        toast({ title: "Image Error", description: "Could not read the image file.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
    } else {
      addMessage({ sender: 'user', type: 'text', textContent: text });
      // For now, text-only messages are just added. AI logic primarily driven by images.
      // A more general chat flow would be needed for advanced text interactions.
      // We can add a simple AI response if no image is provided for this specific app.
      addMessage({
        sender: 'ai',
        type: 'text',
        textContent: "Please upload an image of your foot or shoe so I can assist you with sizing."
      });
      setIsLoading(false);
      return;
    }

    // --- Image Analysis Step ---
    if (currentImageDataUri) {
      addMessage({ sender: 'ai', textContent: 'Analyzing your image...' });
      let analysisResult: AnalyzeFootImageOutput | null = null;
      try {
        const analysisInput: AnalyzeFootImageInput = { photoDataUri: currentImageDataUri };
        analysisResult = await analyzeFootImage(analysisInput);
        addMessage({ sender: 'ai', type: 'analysis_result', analysisData: analysisResult });
      } catch (error) {
        console.error("Error in image analysis:", error);
        addMessage({ sender: 'ai', type: 'error', errorDetails: 'Failed to analyze image.' });
        toast({ title: "AI Error", description: "Image analysis failed.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // --- Size Recommendation Step ---
      if (analysisResult && currentImageDataUri) {
        addMessage({ sender: 'ai', textContent: 'Recommending shoe size...' });
        let recommendationResult: RecommendShoeSizeOutput | null = null;
        try {
          const recommendationInput: RecommendShoeSizeInput = {
            footPhotoDataUri: currentImageDataUri,
            footLength: analysisResult.length,
            footWidth: analysisResult.width,
            footHeight: analysisResult.height,
            // knownShoeSize: "Optional, could be asked from user" 
          };
          recommendationResult = await recommendShoeSize(recommendationInput);
          addMessage({ sender: 'ai', type: 'recommendation_result', recommendationData: recommendationResult });
        } catch (error) {
          console.error("Error in size recommendation:", error);
          addMessage({ sender: 'ai', type: 'error', errorDetails: 'Failed to recommend shoe size.' });
          toast({ title: "AI Error", description: "Size recommendation failed.", variant: "destructive" });
          setIsLoading(false);
          return;
        }

        // --- Availability Check Step ---
        if (recommendationResult) {
          addMessage({ sender: 'ai', textContent: `Checking availability for size ${recommendationResult.recommendedShoeSize}...` });
          try {
            const availabilityInput: CheckShoeAvailabilityInput = { shoeSize: recommendationResult.recommendedShoeSize };
            const availabilityData = await checkShoeAvailability(availabilityInput);
            addMessage({ sender: 'ai', type: 'availability_result', availabilityData });
          } catch (error) {
            console.error("Error in availability check:", error);
            addMessage({ sender: 'ai', type: 'error', errorDetails: 'Failed to check availability.' });
            toast({ title: "AI Error", description: "Availability check failed.", variant: "destructive" });
          }
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full max-w-2xl bg-card shadow-xl rounded-lg overflow-hidden my-4">
      <header className="flex items-center p-4 border-b bg-card">
        <Footprints className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-xl font-semibold font-headline">SoleMate AI</h1>
      </header>
      <ChatMessagesArea messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
