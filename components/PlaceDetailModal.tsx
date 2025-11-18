import React, { useState } from 'react';
import { StudyPlace, Review } from '../types';
import { X, Star, MapPin, BatteryCharging, Wifi, Coffee, Volume2, Clock, Users, Send } from 'lucide-react';

interface PlaceDetailModalProps {
  place: StudyPlace | null;
  onClose: () => void;
  onAddReview: (placeId: string, rating: number, text: string) => void;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  if (!place) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim()) {
      onAddReview(place.id, rating, reviewText);
      setReviewText('');
      setRating(5);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="relative h-48 sm:h-64 flex-shrink-0">
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
            <h2 className="text-2xl font-bold text-white mb-1">{place.name}</h2>
            <div className="flex items-center gap-2 text-white/90 text-sm">
               <MapPin className="w-4 h-4" />
               <span>Campus Main • {place.type}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-100 min-w-[4rem]">
              <Star className="w-5 h-5 text-amber-500 mb-1" fill="currentColor" />
              <span className="text-sm font-bold text-slate-700">{place.rating}</span>
              <span className="text-[10px] text-slate-400">{place.reviewCount} reviews</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-100 min-w-[4rem]">
              <Volume2 className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-sm font-bold text-slate-700">{place.noiseLevel}</span>
              <span className="text-[10px] text-slate-400">Noise</span>
            </div>
            {place.isCrowded !== undefined && (
               <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-100 min-w-[4rem]">
               <Users className="w-5 h-5 text-slate-500 mb-1" />
               <span className="text-sm font-bold text-slate-700">{place.isCrowded ? 'High' : 'Low'}</span>
               <span className="text-[10px] text-slate-400">Traffic</span>
             </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">About</h3>
            <p className="text-slate-600 leading-relaxed">{place.description}</p>
          </div>

          <div className="mb-6">
             <h3 className="text-lg font-semibold text-slate-800 mb-3">Amenities</h3>
             <div className="grid grid-cols-2 gap-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${place.hasWifi ? 'border-green-200 bg-green-50 text-green-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    <Wifi className="w-5 h-5" />
                    <span className="text-sm font-medium">{place.hasWifi ? 'Fast Wi-Fi Available' : 'No Wi-Fi'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${place.hasOutlets ? 'border-green-200 bg-green-50 text-green-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    <BatteryCharging className="w-5 h-5" />
                    <span className="text-sm font-medium">{place.hasOutlets ? 'Power Outlets' : 'Limited Outlets'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${place.hasFood ? 'border-green-200 bg-green-50 text-green-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    <Coffee className="w-5 h-5" />
                    <span className="text-sm font-medium">{place.hasFood ? 'Food & Drinks' : 'No Food'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${place.isOpenLate ? 'border-green-200 bg-green-50 text-green-800' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">{place.isOpenLate ? 'Open Late' : 'Closes Early'}</span>
                </div>
             </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Community Reviews</h3>
             
             <form onSubmit={handleSubmitReview} className="mb-6 bg-slate-50 p-4 rounded-xl">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts..." 
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="submit" disabled={!reviewText.trim()} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                    Post
                  </button>
                </div>
             </form>

             <div className="space-y-4">
                {place.reviews.length > 0 ? (
                  place.reviews.slice().reverse().map(review => (
                    <div key={review.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-slate-900">{review.userName}</span>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{review.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 text-sm italic py-4">No reviews yet. Be the first!</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailModal;