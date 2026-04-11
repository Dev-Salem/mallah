'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

interface FeedFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    seniority: string;
    setSeniority: (val: string) => void;
    sortBy: 'Best Match' | 'Newest';
    setSortBy: (val: 'Best Match' | 'Newest') => void;
}

export function FeedFilters({
    search,
    setSearch,
    seniority,
    setSeniority,
    sortBy,
    setSortBy
}: FeedFiltersProps) {
    const t = useTranslations('Dashboard.Opportunities.jobFeed');

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    className="pl-10 h-11 bg-card/40 border-primary/10 transition-all focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Select value={seniority} onValueChange={setSeniority}>
                    <SelectTrigger className="w-[140px] h-11 bg-card/40 border-primary/10">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All levels">All levels</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(val: 'Best Match' | 'Newest') => setSortBy(val)}>
                    <SelectTrigger className="w-[140px] h-11 bg-card/40 border-primary/10">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Best Match">Best Match</SelectItem>
                        <SelectItem value="Newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
