import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Cake } from '../types';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null); // For modal
  const [showImageModal, setShowImageModal] = useState(false);

  // Initialize Keen Slider for the modal
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  useEffect(() => {
    const fetchFeaturedCakes = async () => {
      const { data, error } = await supabase
        .from('cakes')
        .select('*')
        .eq('featured', true)
        .limit(6);

      if (error) {
        console.error('Error fetching featured cakes:', error);
        return;
      }

      setFeaturedCakes(data || []);
      setLoading(false);
    };

    fetchFeaturedCakes();
  }, []);

  const handleImageClick = (cake: Cake) => {
    setSelectedCake(cake);
    setShowImageModal(true);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=2000&q=80"
          alt="Delicious cake showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Sweet Delights Bakery</h1>
            <p className="text-xl mb-8">Crafting moments of joy, one cake at a time</p>
            <Link
              to="/category/custom"
              className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition"
            >
              Order Custom Cake
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Featured Creations</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCakes.map((cake) => (
              <div key={cake.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div
                  className="relative overflow-hidden h-64 cursor-pointer"
                  onClick={() => handleImageClick(cake)}
                >
                  <img
                    src={cake.images[0]}
                    alt={cake.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{cake.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{cake.description}</p>
                  <Link
                    to={`/category/${cake.category}`}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-pink-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Our Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {['Cheesecakes', 'Chocolate', 'Red Velvet', 'Fruit', 'Custom'].map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase().replace(' ', '-')}`}
              className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-pink-600">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Image Modal */}
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
                {[...Array(instanceRef.current.track.details.slides.length)].map(
                  (_, idx) => (
                    <button
                      key={idx}
                      onClick={() => instanceRef.current?.moveToIdx(idx)}
                      className={`w-2 h-2 rounded-full ${
                        instanceRef.current.track.details.rel === idx
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  )
                )}
              </div>
            )}

            {instanceRef.current && (
              <>
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  disabled={instanceRef.current.track.details.rel === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                  disabled={
                    instanceRef.current.track.details.rel ===
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

export default Home;
