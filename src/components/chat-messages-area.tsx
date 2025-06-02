
"use client";

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import ChatMessageItem from './chat-message-item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessagesAreaProps {
  messages: ChatMessage[];
}

export default function ChatMessagesArea({ messages }: ChatMessagesAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-grow" ref={scrollAreaRef}>
      <div ref={viewportRef} className="h-full p-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
      </div>
    </ScrollArea>
  );
}
