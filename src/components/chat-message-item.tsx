
"use client";

import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, User, Ruler, Wand, Store, AlertTriangle, CheckCircle2, XCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === 'user';
  const Icon = isUser ? User : Bot;

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.textContent}</p>;
      case 'image_input':
        return (
          <div className="max-w-xs">
            {message.textContent && <p className="mb-2">{message.textContent}</p>}
            {message.imageDataUri && (
              <NextImage
                src={message.imageDataUri}
                alt="Uploaded image"
                width={200}
                height={200}
                className="rounded-lg border"
                data-ai-hint="foot shoe" 
              />
            )}
          </div>
        );
      case 'analysis_result':
        return (
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center space-x-2 p-3">
              <Ruler className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Image Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-sm">
              <p>Length: {message.analysisData?.length.toFixed(2)} cm</p>
              <p>Width: {message.analysisData?.width.toFixed(2)} cm</p>
              <p>Height: {message.analysisData?.height.toFixed(2)} cm</p>
            </CardContent>
          </Card>
        );
      case 'recommendation_result':
        return (
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center space-x-2 p-3">
              <Wand className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Size Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-sm">
              <p>Recommended Size: {message.recommendationData?.recommendedShoeSize}</p>
              <p>Initial Availability Note: {message.recommendationData?.availability}</p>
            </CardContent>
          </Card>
        );
      case 'availability_result':
        return (
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center space-x-2 p-3">
              {message.availabilityData?.isAvailable ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
              <CardTitle className="text-base font-semibold">Availability Check</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-sm">
              <p>Details: {message.availabilityData?.availabilityDetails}</p>
            </CardContent>
          </Card>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p>Error: {message.errorDetails || "An unknown error occurred."}</p>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>{message.textContent || "Processing..."}</p>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap">{message.textContent}</p>;
    }
  };

  return (
    <div className={cn("flex items-start gap-3 py-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3 shadow-md",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
        )}
      >
        {renderContent()}
        <p className={cn("mt-1 text-xs", isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
         <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

