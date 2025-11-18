import React, { useState } from 'react';
import { PlaceType, NoiseLevel } from '../types';
import { generatePlaceDescription } from '../services/geminiService';
import { X, Wand2, Loader2 } from 'lucide-react';

interface AddPlaceModalProps {
  onClose: () => void;
  onAdd: (placeData: any) => void;
}

const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: PlaceType.LIBRARY,
    description: '',
    noiseLevel: NoiseLevel.QUIET,
    hasOutlets: false,
    hasWifi: true,
    hasFood: false,
    isOpenLate: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const tags = [
      formData.type,
      formData.noiseLevel,
      formData.hasOutlets ? 'Power Outlets' : '',
      formData.hasFood ? 'Food Available' : '',
      formData.isOpenLate ? 'Open Late' : ''
    ].filter(Boolean);

    const desc = await generatePlaceDescription(formData.name, tags);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now().toString(),
      image: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
      rating: 0,
      reviewCount: 0,
      isCrowded: false,
      reviews: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Add New Study Spot</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Place Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="e.g. The Quiet Corner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
               <select 
                 value={formData.type}
                 onChange={(e) => handleChange('type', e.target.value)}
                 className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
               >
                 {Object.values(PlaceType).map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Noise Level</label>
               <select 
                 value={formData.noiseLevel}
                 onChange={(e) => handleChange('noiseLevel', e.target.value)}
                 className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
               >
                 {Object.values(NoiseLevel).map(n => <option key={n} value={n}>{n}</option>)}
               </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-slate-700">Description</label>
               <button 
                 type="button"
                 onClick={handleGenerateDescription}
                 disabled={!formData.name || isGenerating}
                 className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 disabled:opacity-50"
               >
                 {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                 Auto-Write with AI
               </button>
            </div>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-lg border-slate-200 border px-3 py-2 text-sm h-24 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Describe the vibe..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50">
               <input type="checkbox" checked={formData.hasWifi} onChange={(e) => handleChange('hasWifi', e.target.checked)} className="rounded text-primary focus:ring-primary" />
               <span className="text-sm text-slate-600">Has Wi-Fi</span>
             </label>
             <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50">
               <input type="checkbox" checked={formData.hasOutlets} onChange={(e) => handleChange('hasOutlets', e.target.checked)} className="rounded text-primary focus:ring-primary" />
               <span className="text-sm text-slate-600">Power Outlets</span>
             </label>
             <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50">
               <input type="checkbox" checked={formData.hasFood} onChange={(e) => handleChange('hasFood', e.target.checked)} className="rounded text-primary focus:ring-primary" />
               <span className="text-sm text-slate-600">Food Nearby</span>
             </label>
             <label className="flex items-center gap-2 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50">
               <input type="checkbox" checked={formData.isOpenLate} onChange={(e) => handleChange('isOpenLate', e.target.checked)} className="rounded text-primary focus:ring-primary" />
               <span className="text-sm text-slate-600">Open Late</span>
             </label>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Add Place
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlaceModal;