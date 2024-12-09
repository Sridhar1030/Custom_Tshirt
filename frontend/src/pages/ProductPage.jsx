import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, AlertCircle, RefreshCcw, Mail, User, Hash, Loader2 } from 'lucide-react';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/admin/products`);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Network Error');
                setLoading(false);
            }
        };

        // Simulate loading messages
        const messages = [
            'Getting info...',
            'Preparing data...',
            'Fetching products...',
            'Rendering UI...',
            'Loading content...',
            'Almost there...',
            'Initializing...',
            'Finalizing setup...'
        ];

        let messageIndex = 0;
        const intervalId = setInterval(() => {
            setLoadingMessages((prevMessages) => [
                ...prevMessages,
                messages[messageIndex]
            ]);
            messageIndex += 1;
            if (messageIndex >= messages.length) {
                clearInterval(intervalId);
            }
        }, 1500); // Display a new message every 1.5 seconds

        // Fetch products after 5 seconds delay to simulate loading
        const fetchTimeout = setTimeout(() => {
            fetchProducts();
        }, 5000);

        // After 5 minutes, show error and "Try Again" button
        const errorTimeout = setTimeout(() => {
            setError('Network Error');
            setLoading(false);
        }, 300000); // 5 minutes = 300,000 milliseconds

        return () => {
            clearInterval(intervalId);
            clearTimeout(fetchTimeout);
            clearTimeout(errorTimeout);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
                    <p className="text-sm text-gray-400 mt-2">Please wait while we fetch the data</p>
                    {/* Display random messages every 1.5 seconds */}
                    {loadingMessages.length > 0 && (
                        <div className="mt-4">
                            {loadingMessages.map((message, index) => (
                                <p key={index} className="text-gray-500">{message}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ShoppingBag className="w-8 h-8 text-blue-500" />
                        <h1 className="text-4xl font-bold text-gray-900">Products</h1>
                    </div>
                    <p className="text-gray-600">Manage and view all available products</p>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md mx-auto">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">No products found</p>
                        <p className="text-gray-400 text-sm">Try adding some products to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="aspect-square w-full overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <h2 className="text-xl font-semibold truncate text-gray-800">
                                            {product.userId.fullName}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <p className="truncate">
                                            {product.userId.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs pt-3 border-t">
                                        <Hash className="w-3 h-3 text-gray-400" />
                                        <p className="font-mono">
                                            {product._id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
