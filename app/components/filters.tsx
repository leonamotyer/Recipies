'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [fancy, setFancy] = useState(searchParams.get('fancy') === 'true');
  const [quick, setQuick] = useState(searchParams.get('quick') === 'true');
  const [cheap, setCheap] = useState(searchParams.get('cheap') === 'true');

  const categories = ['Dinner', 'Lunch', 'Breakfast', 'Main Course', 'Dessert', 'Appetizer', 'Side', 'Snack'];
  const timeRanges = [
    { label: 'Under 15 min', value: '15' },
    { label: '15-30 min', value: '30' },
    { label: '30-60 min', value: '60' },
    { label: 'Over 60 min', value: '60+' },
  ];

  const updateFilters = useCallback((includeSearch: boolean = true) => {
    const params = new URLSearchParams();
    
    if (includeSearch && searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTime) params.set('time', selectedTime);
    if (fancy) params.set('fancy', 'true');
    if (quick) params.set('quick', 'true');
    if (cheap) params.set('cheap', 'true');

    const queryString = params.toString();
    router.push(`/recipes${queryString ? `?${queryString}` : ''}`);
  }, [searchQuery, selectedCategory, selectedTime, fancy, quick, cheap, router]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTime('');
    setFancy(false);
    setQuick(false);
    setCheap(false);
    router.push('/recipes');
  };

  // Track previous values to detect actual changes
  const prevFiltersRef = useRef({ searchQuery, selectedCategory, selectedTime, fancy, quick, cheap });

  // Dynamic search with debounce
  useEffect(() => {
    // Only update if search query actually changed (not just initial mount)
    if (prevFiltersRef.current.searchQuery === searchQuery) return;
    prevFiltersRef.current.searchQuery = searchQuery;

    const timer = setTimeout(() => {
      updateFilters(true);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery, updateFilters]);

  // Update filters immediately for category, time, and tags (but not search)
  useEffect(() => {
    // Check if any filter actually changed
    const hasChanged = 
      prevFiltersRef.current.selectedCategory !== selectedCategory ||
      prevFiltersRef.current.selectedTime !== selectedTime ||
      prevFiltersRef.current.fancy !== fancy ||
      prevFiltersRef.current.quick !== quick ||
      prevFiltersRef.current.cheap !== cheap;

    if (!hasChanged) return;

    // Update refs
    prevFiltersRef.current = { 
      searchQuery, 
      selectedCategory, 
      selectedTime, 
      fancy, 
      quick, 
      cheap 
    };
    
    updateFilters(true);
  }, [selectedCategory, selectedTime, fancy, quick, cheap, searchQuery, updateFilters]);

  useEffect(() => {
    // Update filters when search params change (e.g., from browser back button)
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedTime(searchParams.get('time') || '');
    setFancy(searchParams.get('fancy') === 'true');
    setQuick(searchParams.get('quick') === 'true');
    setCheap(searchParams.get('cheap') === 'true');
  }, [searchParams]);

  return (
    <div className="bg-primary-dark/80 backdrop-blur-sm z-40 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input w-full px-4 sm:px-6 py-2 sm:py-3 rounded-full text-text-color placeholder:text-text-color/50 font-medium bg-primary-dark text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateFilters(false);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-color/50 hover:text-text-color transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
          {/* Time Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <label className="text-text-color font-medium whitespace-nowrap text-sm hidden sm:inline">Time:</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="filter-input px-3 sm:px-4 py-2 rounded-full text-text-color font-medium cursor-pointer w-full sm:min-w-[140px] bg-primary-dark text-sm sm:text-base"
            >
              <option value="">Any Time</option>
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <label className="text-text-color font-medium whitespace-nowrap text-sm hidden sm:inline">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-input px-3 sm:px-4 py-2 rounded-full text-text-color font-medium cursor-pointer w-full sm:min-w-[140px] bg-primary-dark text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <label className="text-text-color font-medium whitespace-nowrap text-sm hidden sm:inline">Tags:</label>
            <button
              onClick={() => setFancy(!fancy)}
              className={`filter-button px-3 sm:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                fancy ? 'active' : ''
              }`}
            >
              Fancy
            </button>
            <button
              onClick={() => setQuick(!quick)}
              className={`filter-button px-3 sm:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                quick ? 'active' : ''
              }`}
            >
              Quick
            </button>
            <button
              onClick={() => setCheap(!cheap)}
              className={`filter-button px-3 sm:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                cheap ? 'active' : ''
              }`}
            >
              Cheap
            </button>
          </div>

          {/* Clear Button */}
          {(searchQuery || selectedCategory || selectedTime || fancy || quick || cheap) && (
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <button
                onClick={clearFilters}
                className="filter-button px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
