'use client';

import { BookOpen, Sprout, Bug, Flower, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LearnPage() {
    const categories = [
        { name: 'Diseases', icon: Bug, color: 'text-red-600', bg: 'bg-red-100' },
        { name: 'Pest Control', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Soil Health', icon: Flower, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { name: 'Best Practices', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    ];

    const articles = [
        {
            title: "Understanding Tomato Blight",
            category: "Diseases",
            readTime: "5 min read",
            summary: "Learn how to identify and treat early and late blight in tomato plants effectively."
        },
        {
            title: "Organic Pest Control Methods",
            category: "Pest Control",
            readTime: "8 min read",
            summary: "Natural ways to keep pests away from your crops without using harmful chemicals."
        },
        {
            title: "Soil pH and Nutrient Absorption",
            category: "Soil Health",
            readTime: "6 min read",
            summary: "Why soil pH matters and how to adjust it for optimal crop growth."
        },
        {
            title: "Drip Irrigation Benefits",
            category: "Best Practices",
            readTime: "4 min read",
            summary: "Save water and improve yields with modern irrigation techniques."
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Knowledge Hub</h1>
                <p className="text-gray-500">Expert advice, farming tips, and disease guides to help you grow better.</p>

                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search for articles, diseases, or tips..." className="pl-10" />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer text-center hover:border-green-200">
                            <CardContent className="p-6 flex flex-col items-center gap-3">
                                <div className={`p-3 rounded-full ${cat.bg}`}>
                                    <Icon className={`h-6 w-6 ${cat.color}`} />
                                </div>
                                <span className="font-medium text-gray-900">{cat.name}</span>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Featured Articles */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {articles.map((article, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-gray-400">{article.readTime}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 mt-2 line-clamp-2">
                                        {article.summary}
                                    </p>
                                </div>
                                <div className="flex items-center text-green-600 font-medium text-sm pt-2">
                                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
