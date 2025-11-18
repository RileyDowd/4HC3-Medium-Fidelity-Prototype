import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_PLACES } from './constants';
import { StudyPlace, PlaceType, NoiseLevel, Review } from './types';
import PlaceCard from './components/PlaceCard';
import PlaceDetailModal from './components/PlaceDetailModal';
import AddPlaceModal from './components/AddPlaceModal';
import ChatAssistant from './components/ChatAssistant';
import { Search, Filter, Plus, Home, Heart, Map, User, SlidersHorizontal } from 'lucide-react';

// Simple HashRouter implementation for tabs
enum Tab {
  DISCOVER = 'discover',
  SAVED = 'saved',
  PROFILE = 'profile'
}

const App: React.FC = () => {
  const [places, setPlaces] = useState<StudyPlace[]>(INITIAL_PLACES);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DISCOVER);
  const [selectedPlace, setSelectedPlace] = useState<StudyPlace | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    outlets: false,
    openLate: false,
    noise: [] as NoiseLevel[]
  });
  const [showFilters, setShowFilters] = useState(false);

  // Hydrate from LocalStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem('favorites');
    const savedVisited = localStorage.getItem('visited');
    const savedPlaces = localStorage.getItem('custom_places');
    
    if (savedFavs) setFavorites(new Set(JSON.parse(savedFavs)));
    if (savedVisited) setVisited(new Set(JSON.parse(savedVisited)));
    if (savedPlaces) {
        const customPlaces = JSON.parse(savedPlaces);
        setPlaces(prev => [...prev, ...customPlaces]);
    }
  }, []);

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('visited', JSON.stringify(Array.from(visited)));
  }, [visited]);

  const toggleFavorite = (id: string) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  const toggleVisited = (id: string) => {
    const newVisited = new Set(visited);
    if (newVisited.has(id)) newVisited.delete(id);
    else newVisited.add(id);
    setVisited(newVisited);
  };

  const handleAddPlace = (placeData: StudyPlace) => {
    setPlaces(prev => [placeData, ...prev]);
    // Persist custom added places separately so we don't duplicate initial ones on reload logic improperly
    // For simplicity in this demo, we just add to state. In real app, you'd separate sources.
    setIsAddModalOpen(false);
  };

  const handleAddReview = (placeId: string, rating: number, text: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id !== placeId) return p;
      const newReview: Review = {
        id: Date.now().toString(),
        placeId,
        userName: 'Current User', // Mock
        rating,
        text,
        timestamp: Date.now()
      };
      const newReviews = [...p.reviews, newReview];
      const newAvgRating = (p.rating * p.reviewCount + rating) / (p.reviewCount + 1);
      return {
        ...p,
        reviews: newReviews,
        reviewCount: p.reviewCount + 1,
        rating: parseFloat(newAvgRating.toFixed(1))
      };
    }));
  };

  const filteredPlaces = useMemo(() => {
    let result = places;
    
    // Tab Filtering
    if (currentTab === Tab.SAVED) {
      result = result.filter(p => favorites.has(p.id) || visited.has(p.id));
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Advanced Filters
    if (activeFilters.outlets) result = result.filter(p => p.hasOutlets);
    if (activeFilters.openLate) result = result.filter(p => p.isOpenLate);
    if (activeFilters.noise.length > 0) result = result.filter(p => activeFilters.noise.includes(p.noiseLevel));

    return result;
  }, [places, currentTab, searchQuery, favorites, visited, activeFilters]);

  const toggleNoiseFilter = (level: NoiseLevel) => {
    setActiveFilters(prev => {
       const current = prev.noise;
       const updated = current.includes(level) ? current.filter(l => l !== level) : [...current, level];
       return { ...prev, noise: updated };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
               C
             </div>
             <h1 className="text-lg font-bold tracking-tight text-slate-800">CampusSpot</h1>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-full shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search Bar Area */}
        {currentTab !== Tab.PROFILE && (
          <div className="px-4 pb-3 max-w-3xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Find your spot..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 focus:bg-white border-transparent focus:border-primary/30 focus:ring-2 focus:ring-primary/10 rounded-xl pl-9 pr-4 py-2.5 text-sm transition-all outline-none"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-colors ${showFilters || activeFilters.outlets || activeFilters.openLate || activeFilters.noise.length > 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                 <div className="flex flex-wrap gap-2 mb-2">
                    <button 
                      onClick={() => setActiveFilters(p => ({...p, outlets: !p.outlets}))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeFilters.outlets ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      Power Outlets
                    </button>
                    <button 
                      onClick={() => setActiveFilters(p => ({...p, openLate: !p.openLate}))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeFilters.openLate ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                      Open Late
                    </button>
                 </div>
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Noise:</span>
                    {Object.values(NoiseLevel).map(level => (
                      <button
                        key={level}
                        onClick={() => toggleNoiseFilter(level)}
                        className={`px-3 py-1 rounded-md text-xs whitespace-nowrap border transition-all ${activeFilters.noise.includes(level) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
                      >
                        {level}
                      </button>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4">
        {currentTab === Tab.PROFILE ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-800">Student User</h2>
               <p className="text-slate-500">Computer Science Major</p>
             </div>
             <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                   <div className="text-2xl font-bold text-primary">{visited.size}</div>
                   <div className="text-xs text-slate-500 uppercase font-medium">Places Visited</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                   <div className="text-2xl font-bold text-red-500">{favorites.size}</div>
                   <div className="text-xs text-slate-500 uppercase font-medium">Favorites</div>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentTab === Tab.SAVED && (
               <div className="flex gap-4 mb-4 border-b border-slate-200 pb-2">
                  <h2 className="font-bold text-lg">Your Library</h2>
               </div>
            )}

            {filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPlaces.map(place => (
                  <PlaceCard 
                    key={place.id} 
                    place={place} 
                    isFavorite={favorites.has(place.id)}
                    isVisited={visited.has(place.id)}
                    onToggleFavorite={toggleFavorite}
                    onToggleVisited={toggleVisited}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Map className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No places found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe safe-area-pb z-30">
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
           <button 
             onClick={() => setCurrentTab(Tab.DISCOVER)}
             className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentTab === Tab.DISCOVER ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <Home className="w-6 h-6" />
             <span className="text-[10px] font-medium">Discover</span>
           </button>
           <button 
             onClick={() => setCurrentTab(Tab.SAVED)}
             className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentTab === Tab.SAVED ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <Heart className="w-6 h-6" />
             <span className="text-[10px] font-medium">Saved</span>
           </button>
           <button 
             onClick={() => setCurrentTab(Tab.PROFILE)}
             className={`flex flex-col items-center gap-1 w-16 transition-colors ${currentTab === Tab.PROFILE ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <User className="w-6 h-6" />
             <span className="text-[10px] font-medium">Profile</span>
           </button>
        </div>
      </nav>

      {/* Modals & Chat */}
      {selectedPlace && (
        <PlaceDetailModal 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
          onAddReview={handleAddReview}
        />
      )}
      
      {isAddModalOpen && (
        <AddPlaceModal 
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPlace}
        />
      )}

      <ChatAssistant places={places} />
    </div>
  );
};

export default App;