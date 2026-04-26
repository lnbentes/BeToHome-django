import { useState, useEffect } from 'react';
import { Map, MapPin, Star } from 'lucide-react';
import { placesService } from '../services/placesService';

export function Places() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const res = await placesService.list();
      const extractArray = (res: any) => Array.isArray(res) ? res : (res?.results || res?.data || []);
      setPlaces(extractArray(res));
    } catch (err) {
      console.error('Failed to load places', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number = 0) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-earth-300 dark:text-earth-600'} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Desejos de Viagem</h2>
        <button className="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
          <Map size={20} /> Add Lugar
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-earth-500">Carregando...</div>
      ) : places.length === 0 ? (
        <div className="p-12 text-center text-earth-500">Nenhum passeio encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map(place => (
            <div key={place.id} className="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48">
                <img 
                  src={place.image_url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={place.name} 
                  onError={(e: any) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-forest-700">
                  {place.visited ? 'Visitado' : 'A visitar'}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-xl font-bold text-earth-800 dark:text-earth-100">{place.name}</h4>
                <div className="flex items-center gap-1 text-earth-500 text-sm mt-1 mb-3">
                  <MapPin size={16} /> {place.location}
                </div>
                <p className="text-sm text-earth-600 dark:text-earth-400 line-clamp-2">{place.notes || ''}</p>
                <div className="mt-4 pt-4 border-t border-earth-100 dark:border-earth-800 flex justify-between items-center">
                  <div className="flex gap-0.5">{renderStars(place.rating)}</div>
                  <button className="text-forest-600 hover:text-forest-700 font-bold text-sm">Editar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
