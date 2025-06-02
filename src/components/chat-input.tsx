
"use client";

import React, { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, imageFile?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setInputValue(file.name); // Show file name in input or a dedicated space
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (selectedFile) {
      onSendMessage(inputValue || selectedFile.name, selectedFile);
    } else if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
    }
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSend}
      className="sticky bottom-0 left-0 right-0 z-10 flex items-center gap-2 border-t bg-background p-4 shadow-sm"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={triggerFileInput}
        disabled={isLoading}
        aria-label="Attach image"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      <Input
        type="text"
        placeholder={selectedFile ? selectedFile.name : "Type your message or upload an image..."}
        value={inputValue}
        onChange={handleInputChange}
        disabled={isLoading || !!selectedFile} // Disable text input if file is selected to avoid confusion
        className="flex-grow"
      />
      <Button 
        type="submit" 
        disabled={isLoading || (!inputValue.trim() && !selectedFile)}
        aria-label="Send message"
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </Button>
    </form>
  );
}
