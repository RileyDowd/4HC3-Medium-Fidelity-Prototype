import React from 'react';
import { StudyPlace, NoiseLevel } from '../types';
import { Star, MapPin, BatteryCharging, Wifi, Coffee, Volume2, Clock, Users, Heart, CheckCircle } from 'lucide-react';

interface PlaceCardProps {
  place: StudyPlace;
  isFavorite: boolean;
  isVisited: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onClick: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, isFavorite, isVisited, onToggleFavorite, onToggleVisited, onClick }) => {
  
  const getNoiseIcon = (level: NoiseLevel) => {
    switch(level) {
      case NoiseLevel.SILENT: return <Volume2 className="w-4 h-4 text-green-500" />;
      case NoiseLevel.QUIET: return <Volume2 className="w-4 h-4 text-blue-500" />;
      case NoiseLevel.MODERATE: return <Volume2 className="w-4 h-4 text-yellow-500" />;
      case NoiseLevel.LIVELY: return <Volume2 className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative h-40 w-full cursor-pointer" onClick={onClick}>
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 flex gap-2">
           <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(place.id); }}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
           <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-md">
             {place.type}
           </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-800 line-clamp-1">{place.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-medium">{place.rating}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-grow">{place.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                {getNoiseIcon(place.noiseLevel)}
                <span>{place.noiseLevel}</span>
            </div>
            {place.isOpenLate && (
                <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Clock className="w-3 h-3" />
                    <span>Late</span>
                </div>
            )}
            {place.isCrowded ? (
                 <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                 <Users className="w-3 h-3" />
                 <span>Busy</span>
             </div>
            ) : (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                <Users className="w-3 h-3" />
                <span>Quiet</span>
            </div>
            )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
            <div className="flex gap-2 text-slate-400">
                {place.hasOutlets && <BatteryCharging className="w-4 h-4" />}
                {place.hasWifi && <Wifi className="w-4 h-4" />}
                {place.hasFood && <Coffee className="w-4 h-4" />}
            </div>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleVisited(place.id); }}
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${isVisited ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <CheckCircle className="w-3.5 h-3.5" />
                {isVisited ? 'Visited' : 'Mark Visited'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;