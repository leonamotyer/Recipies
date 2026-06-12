'use client';

import { useState } from 'react';
import type { Ingredient } from '@/lib/data.types';

interface IngredientChecklistProps {
  ingredients: Ingredient[];
}

export default function IngredientChecklist({ ingredients }: IngredientChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const progress = ingredients.length > 0 ? (checked.size / ingredients.length) * 100 : 0;
  const allDone = ingredients.length > 0 && checked.size === ingredients.length;

  return (
    <div>
      {/* Mise en place progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
          <span className="text-latte">Mise en place</span>
          <span className={allDone ? 'text-berry' : 'text-latte'}>
            {allDone ? 'Ready to bake! 🧁' : `${checked.size} / ${ingredients.length}`}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="space-y-1">
        {ingredients.map((ingredient, index) => {
          const key = ingredient.id || `${ingredient.ingredientName}-${index}`;
          const isChecked = checked.has(key);
          return (
            <li key={key} className={`ingredient-row ${isChecked ? 'is-checked' : ''}`}>
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={isChecked}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <span className="check-box" aria-hidden>✓</span>
                <span className="ingredient-name flex-1 text-base sm:text-lg text-cocoa">
                  {ingredient.ingredientName}
                </span>
                <span className="text-sm sm:text-base text-latte whitespace-nowrap">
                  {ingredient.measurement}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
