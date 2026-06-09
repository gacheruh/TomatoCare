'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Sprout, Bug, Flower, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/LanguageContext';

interface Article {
    title: string;
    category: string;
    readTime: string;
    summary: string;
    url: string;
    source: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
    'Diseases': {
        bg: 'bg-red-50/30',
        text: 'text-red-700',
        border: 'border-red-100/70',
        accent: 'bg-red-100 text-red-800'
    },
    'Pest Control': {
        bg: 'bg-green-50/30',
        text: 'text-green-700',
        border: 'border-green-100/70',
        accent: 'bg-green-100 text-green-800'
    },
    'Soil Health': {
        bg: 'bg-amber-50/30',
        text: 'text-amber-700',
        border: 'border-amber-100/70',
        accent: 'bg-amber-100 text-amber-800'
    },
    'Best Practices': {
        bg: 'bg-blue-50/30',
        text: 'text-blue-700',
        border: 'border-blue-100/70',
        accent: 'bg-blue-100 text-blue-800'
    }
};

export default function LearnPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const { t } = useLanguage();

    const categories = [
        { name: t('learn.diseases'), key: 'Diseases', icon: Bug, color: 'text-red-600', bg: 'bg-red-100', activeRing: 'ring-2 ring-red-200 bg-red-50/30' },
        { name: t('learn.pestControl'), key: 'Pest Control', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100', activeRing: 'ring-2 ring-green-200 bg-green-50/30' },
        { name: t('learn.soilHealth'), key: 'Soil Health', icon: Flower, color: 'text-yellow-600', bg: 'bg-yellow-100', activeRing: 'ring-2 ring-amber-200 bg-amber-50/30' },
        { name: t('learn.bestPractices'), key: 'Best Practices', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100', activeRing: 'ring-2 ring-blue-200 bg-blue-50/30' },
    ];

    const articles: Article[] = [
        // Diseases
        {
            title: "Tomato Early Blight: Identification and Management",
            category: "Diseases",
            readTime: "5 min read",
            summary: "Learn to identify early blight (Alternaria solani) on tomatoes and discover effective management strategies including fungicide applications and cultural practices.",
            url: "https://extension.umn.edu/diseases/early-blight-tomato",
            source: "UMN Extension"
        },
        {
            title: "Late Blight of Tomatoes and Potatoes",
            category: "Diseases",
            readTime: "7 min read",
            summary: "Comprehensive guide on Phytophthora infestans — the pathogen behind late blight. Covers symptoms, disease cycle, and integrated management.",
            url: "https://extension.umn.edu/diseases/late-blight",
            source: "UMN Extension"
        },
        {
            title: "Tomato Leaf Curl Virus Disease",
            category: "Diseases",
            readTime: "6 min read",
            summary: "Understanding tomato yellow leaf curl virus (TYLCV), its whitefly vector, resistant varieties, and control measures.",
            url: "https://www.apsnet.org/edcenter/disandpath/viral/pdlessons/Pages/TomatoYellowLeafCurl.aspx",
            source: "APS"
        },
        {
            title: "Bacterial Wilt in Tomatoes",
            category: "Diseases",
            readTime: "5 min read",
            summary: "How to identify and manage bacterial wilt caused by Ralstonia solanacearum, including soil management and resistant rootstocks.",
            url: "https://plantpath.ifas.ufl.edu/rsol/RalsijsijtoniaPublications_PDF/BacterialWilt_FactSheet.pdf",
            source: "University of Florida"
        },
        // Pest Control
        {
            title: "Managing Whiteflies in Tomato Production",
            category: "Pest Control",
            readTime: "6 min read",
            summary: "Integrated pest management approaches for controlling whiteflies including biological control agents, yellow sticky traps, and safe insecticides.",
            url: "https://ipm.ucanr.edu/agriculture/tomato/whiteflies/",
            source: "UC IPM"
        },
        {
            title: "Organic Methods for Tomato Pest Control",
            category: "Pest Control",
            readTime: "8 min read",
            summary: "Natural and organic approaches to managing common tomato pests including neem oil, companion planting, and beneficial insects.",
            url: "https://www.gardeningknowhow.com/edible/vegetables/tomato/organic-tomato-pest-control.htm",
            source: "Gardening Know How"
        },
        {
            title: "Tomato Hornworm Identification and Control",
            category: "Pest Control",
            readTime: "4 min read",
            summary: "How to spot tomato hornworms, their lifecycle, and effective control methods including hand-picking and Bt applications.",
            url: "https://extension.umn.edu/yard-and-garden-insects/tomato-hornworms",
            source: "UMN Extension"
        },
        {
            title: "Spider Mites on Tomato Plants",
            category: "Pest Control",
            readTime: "5 min read",
            summary: "Identifying spider mite damage on tomatoes and integrated management using predatory mites, water sprays, and miticides.",
            url: "https://ipm.ucanr.edu/agriculture/tomato/spider-mites/",
            source: "UC IPM"
        },
        // Soil Health
        {
            title: "Soil pH and Nutrient Management for Tomatoes",
            category: "Soil Health",
            readTime: "6 min read",
            summary: "Understanding optimal soil pH (6.0-6.8) for tomato production and how to test and amend your soil for maximum nutrient availability.",
            url: "https://extension.umn.edu/vegetables/growing-tomatoes",
            source: "UMN Extension"
        },
        {
            title: "Composting for Healthier Tomato Gardens",
            category: "Soil Health",
            readTime: "7 min read",
            summary: "How to create and use compost to improve soil structure, water retention, and microbial activity for better tomato yields.",
            url: "https://www.gardeningknowhow.com/composting/basics/composting-101.htm",
            source: "Gardening Know How"
        },
        {
            title: "Cover Crops and Crop Rotation for Tomatoes",
            category: "Soil Health",
            readTime: "5 min read",
            summary: "Benefits of rotating tomatoes with other crops and using cover crops to suppress diseases, improve soil structure, and add nitrogen.",
            url: "https://www.sare.org/publications/managing-cover-crops-profitably/",
            source: "SARE"
        },
        // Best Practices
        {
            title: "Drip Irrigation for Tomato Production",
            category: "Best Practices",
            readTime: "4 min read",
            summary: "Benefits of drip irrigation for tomatoes including water savings of 30-50%, reduced foliar diseases, and improved fruit quality.",
            url: "https://extension.umn.edu/vegetables/watering-vegetables",
            source: "UMN Extension"
        },
        {
            title: "Tomato Staking and Pruning Techniques",
            category: "Best Practices",
            readTime: "6 min read",
            summary: "Proper methods for staking, caging, and pruning tomato plants to improve air circulation, reduce disease, and maximize fruit production.",
            url: "https://www.gardeningknowhow.com/edible/vegetables/tomato/tomato-pruning.htm",
            source: "Gardening Know How"
        },
        {
            title: "Post-Harvest Handling of Tomatoes",
            category: "Best Practices",
            readTime: "5 min read",
            summary: "Best practices for harvesting, sorting, and storing tomatoes to minimize losses and extend shelf life for smallholder farmers.",
            url: "https://www.fao.org/3/y4893e/y4893e00.htm",
            source: "FAO"
        },
        {
            title: "Climate-Smart Agriculture for Tomato Farmers",
            category: "Best Practices",
            readTime: "8 min read",
            summary: "Adapting tomato production to climate change through mulching, shade nets, drought-tolerant varieties, and water harvesting techniques.",
            url: "https://www.fao.org/climate-smart-agriculture/en/",
            source: "FAO"
        }
    ];

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = !searchTerm ||
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !activeCategory || article.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('learn.title')}</h1>
                <p className="text-gray-500">{t('learn.subtitle')}</p>

                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t('learn.searchPlaceholder')}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    return (
                        <Card
                            key={i}
                            className={`hover:shadow-md transition-all cursor-pointer text-center border-0 shadow-sm ${isActive ? cat.activeRing : 'bg-white'}`}
                            onClick={() => setActiveCategory(isActive ? null : cat.key)}
                        >
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

            {/* Active filter indicator */}
            {activeCategory && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{t('history.activeFilters')}</span>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {categories.find(c => c.key === activeCategory)?.name}
                        <button onClick={() => setActiveCategory(null)} className="hover:text-red-500 cursor-pointer ml-1">✕</button>
                    </span>
                </div>
            )}

            {/* Featured Articles */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('learn.featuredArticles')}</h2>
                {filteredArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredArticles.map((article, i) => {
                            const colors = categoryColors[article.category] || {
                                bg: 'bg-gray-50/50',
                                text: 'text-gray-700',
                                border: 'border-gray-100',
                                accent: 'bg-gray-100 text-gray-800'
                            };
                            return (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <Card className={`hover:shadow-md transition-all border ${colors.border} ${colors.bg} h-full`}>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.accent}`}>
                                                    {article.category}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400">{article.readTime}</span>
                                                    <ExternalLink className="h-3 w-3 text-gray-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold text-gray-900 group-hover:${colors.text} transition-colors`}>
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-500 mt-2 line-clamp-2">
                                                    {article.summary}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                                                <span className="text-xs text-gray-400">Source: {article.source}</span>
                                                <div className={`flex items-center ${colors.text} font-semibold text-sm`}>
                                                    {t('learn.readArticle')} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">{t('learn.noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
