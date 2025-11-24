'use client';

import { useState, useEffect, useRef } from 'react';
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AssistantPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([
        { role: 'assistant', content: 'Hello! I am your AgriDiagnose assistant. Ask me anything about your crops, diseases, or farming tips.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages, isLoaded]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.filter((_, index) => index > 0).map(m => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }]
                    }))
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat failed:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Assistant</h1>
                <p className="text-gray-500">Your personal farming expert, available 24/7.</p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-gray-200 shadow-sm">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`p-2 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-green-600'
                                }`}>
                                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user'
                                ? 'bg-green-600 text-white rounded-tr-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                }`}>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-white border border-gray-200 text-green-600">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about maize pests, fertilizer..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading || !input.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
