import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Cake } from '../types';
import EnquiryForm from '../components/EnquiryForm';
import { Cake as CakeIcon, ChevronRight, X, ChevronLeft } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import '../styles/keen-slider.css';

const CakeCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCakes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cakes')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cakes:', error);
        setLoading(false);
        return;
      }

      setCakes(data || []);
      setLoading(false);
    };

    fetchCakes();
  }, [category]);

  const handleEnquiryClick = (cake: Cake) => {
    setSelectedCake(cake);
    setShowEnquiryForm(true);
  };

  const handleImageClick = (cake: Cake) => {
    setSelectedCake(cake);
    setShowImageModal(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 capitalize">
          {category?.replace(/-/g, ' ')} Cakes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our exquisite collection of {category?.replace(/-/g, ' ')} cakes perfect for any occasion
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-64 w-full"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : cakes.length === 0 ? (
        <div className="text-center py-12">
          <CakeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No cakes found</h3>
          <p className="mt-1 text-gray-500">We don't have any {category?.replace(/-/g, ' ')} cakes available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cakes.map((cake) => (
            <div 
              key={cake.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div 
                className="relative overflow-hidden h-64 cursor-pointer"
                onClick={() => handleImageClick(cake)}
              >
                <img
                  src={cake.images[0]}
                  alt={cake.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{cake.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{cake.description}</p>
                <button
                  onClick={() => handleEnquiryClick(cake)}
                  className="w-full flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                >
                  Enquire Now
                  <ChevronRight className="ml-1 h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEnquiryForm && selectedCake && (
        <EnquiryForm cake={selectedCake} onClose={() => {
          setShowEnquiryForm(false);
          setSelectedCake(null);
        }} />
      )}

      {showImageModal && selectedCake && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedCake(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div ref={sliderRef} className="keen-slider">
              {selectedCake.images.map((image, idx) => (
                <div key={idx} className="keen-slider__slide">
                  <img
                    src={image}
                    alt={`${selectedCake.name} - View ${idx + 1}`}
                    className="w-full h-[70vh] object-contain"
                  />
                </div>
              ))}
            </div>
            
            {instanceRef.current && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 pb-4">
                {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === idx ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {instanceRef.current && (
              <>
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  disabled={
                    currentSlide ===
                    instanceRef.current.track.details.slides.length - 1
                  }
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CakeCategory;
