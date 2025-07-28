'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  thumbnail_url?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<object | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        console.log('Fetching products from API...');
        const response = await fetch('/api/printful/catalog');
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        setDebugInfo(data);
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Handle the Printful API response structure
        const productList = Array.isArray(data) ? data : (data.result || []);
        console.log('Processed product list:', productList);
        setProducts(productList);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          {debugInfo && (
            <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded mb-4 text-left">
              <strong className="font-bold">Debug Info: </strong>
              <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Printful Products</h1>
            <div className="text-sm text-gray-500">
              {products.length} products found
            </div>
          </div>
        </div>
      </header>

      {/* Debug Info */}
      {debugInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <strong className="font-bold">Debug Info: </strong>
            <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">There are no products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
                  {product.thumbnail_url ? (
                    <Image
                      src={product.thumbnail_url}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🖼️</span>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            Powered by Printful API • Built with Next.js
          </div>
        </div>
      </footer>
    </div>
  );
}
