'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, MapPin, Sprout, MoreHorizontal, Loader2, Tractor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface Farm {
    id: string;
    name: string;
    location: string;
    crop_type: string;
    size: string;
    created_at: string;
}

const farmThemes = [
    { border: 'border-emerald-100/70', borderTop: 'border-t-emerald-500', bg: 'bg-emerald-50/20', icon: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
    { border: 'border-amber-100/70', borderTop: 'border-t-amber-500', bg: 'bg-amber-50/20', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-800' },
    { border: 'border-blue-100/70', borderTop: 'border-t-blue-500', bg: 'bg-blue-50/20', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-800' },
    { border: 'border-teal-100/70', borderTop: 'border-t-teal-500', bg: 'bg-teal-50/20', icon: 'text-teal-500', badge: 'bg-teal-100 text-teal-800' },
    { border: 'border-lime-100/70', borderTop: 'border-t-lime-500', bg: 'bg-lime-50/20', icon: 'text-lime-500', badge: 'bg-lime-100 text-lime-800' }
];

export default function FarmsPage() {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [newFarm, setNewFarm] = useState({
        name: '',
        location: '',
        crop_type: '',
        size: ''
    });

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        try {
            const { data, error } = await supabase
                .from('farms')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFarms(data || []);
        } catch (error) {
            console.error('Error fetching farms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('farms')
                .insert([{
                    user_id: user.id,
                    name: newFarm.name,
                    location: newFarm.location,
                    crop_type: newFarm.crop_type,
                    size: newFarm.size
                }]);

            if (error) throw error;

            // Reset form and refresh list
            setNewFarm({ name: '', location: '', crop_type: '', size: '' });
            setIsAdding(false);
            fetchFarms();
        } catch (error) {
            console.error('Error saving farm:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Farms</h1>
                    <p className="text-gray-500">Manage your farm plots and track their health.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Farm
                </Button>
            </div>

            {isAdding && (
                <Card className="border-0 bg-green-50/30 shadow-sm">
                    <CardHeader>
                        <CardTitle>Add New Farm Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveFarm} className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="farmName">Farm Name</Label>
                                <Input
                                    id="farmName"
                                    placeholder="e.g. River Side Plot"
                                    value={newFarm.name}
                                    onChange={e => setNewFarm({ ...newFarm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Nakuru"
                                    value={newFarm.location}
                                    onChange={e => setNewFarm({ ...newFarm, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="crops">Primary Crops</Label>
                                <Input
                                    id="crops"
                                    placeholder="e.g. Maize, Potatoes"
                                    value={newFarm.crop_type}
                                    onChange={e => setNewFarm({ ...newFarm, crop_type: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="size">Size (Acres)</Label>
                                <Input
                                    id="size"
                                    placeholder="e.g. 5"
                                    value={newFarm.size}
                                    onChange={e => setNewFarm({ ...newFarm, size: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Farm'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {farms.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {farms.map((farm, index) => {
                        const theme = farmThemes[index % farmThemes.length];
                        return (
                            <Card key={farm.id} className={`hover:shadow-md transition-all border ${theme.border} border-t-4 ${theme.borderTop} ${theme.bg}`}>
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-bold text-gray-900">{farm.name}</CardTitle>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="mr-1 h-3.5 w-3.5 text-gray-400" />
                                            {farm.location}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center">
                                                <Sprout className={`mr-2 h-4 w-4 ${theme.icon}`} />
                                                Crops
                                            </span>
                                            <span className={`font-semibold px-2 py-0.5 rounded-md text-xs ${theme.badge}`}>{farm.crop_type}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 flex items-center">
                                                <Tractor className={`mr-2 h-4 w-4 ${theme.icon}`} />
                                                Size
                                            </span>
                                            <span className="font-semibold text-gray-800">{farm.size} Acres</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-500">Added</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(farm.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <Tractor className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No farms added yet</h3>
                    <p className="text-gray-500 max-w-sm mt-2 mb-6">
                        Add your farm details to start tracking crop health and managing your plots.
                    </p>
                    <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Your First Farm
                    </Button>
                </div>
            )}
        </div>
    );
}
