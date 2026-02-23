'use client';

import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
            active === cat.key
              ? 'bg-brand-gold text-brand-black'
              : 'border border-brand-gold/20 text-brand-gray-light hover:border-brand-gold hover:text-brand-gold'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
