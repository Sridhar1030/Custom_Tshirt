import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Tshirt from '../assets/tshirt.png';

const TShirtDesigner = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imagePositions, setImagePositions] = useState([]);
    const fileInputRef = useRef(null);
    const tShirtRef = useRef(null);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImages).then((images) => {
            setUploadedImages((prevImages) => [...prevImages, ...images]);
            setImagePositions((prevPositions) => [
                ...prevPositions,
                { x: 50, y: 50, width: 120, height: 120 }, // Better default position
            ]);
        });
    };

    const handlePositionChange = (index, newPosition) => {
        const updatedPositions = [...imagePositions];
        updatedPositions[index] = newPosition;
        setImagePositions(updatedPositions);
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePositions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveImage = () => {
        html2canvas(tShirtRef.current).then((canvas) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error: Image not generated');
                    return;
                }

                const USER_ID = localStorage.getItem('userID');
                const formData = new FormData();
                formData.append('image', new File([blob], 'tshirt-design.png', { type: 'image/png' }));
                formData.append('userId', USER_ID);

                axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then(response => {
                        alert('Design saved successfully!');
                    })
                    .catch(error => {
                        alert('Error saving design. Please try again.');
                        console.error('Error:', error);
                    });
            });
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Custom T-Shirt Designer
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-72 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Uploaded Designs
                        </h2>
                        <div className="space-y-4">
                            {uploadedImages.length > 0 ? (
                                uploadedImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative group bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:shadow-md"
                                    >
                                        <img
                                            src={image}
                                            alt={`Design ${index + 1}`}
                                            className="w-full h-32 object-contain rounded-md "
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No designs uploaded yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Design Area */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-center mb-8">
                            <div className="relative w-96 h-[32rem] bg-red-200" ref={tShirtRef}>
                                <img
                                    src={Tshirt}
                                    alt="T-shirt Template"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-24 left-20 w-56 h-64 overflow-hidden">
                                    {uploadedImages.map((image, index) => (
                                        <Rnd
                                            key={index}
                                            position={{ x: imagePositions[index].x, y: imagePositions[index].y }}
                                            size={{
                                                width: imagePositions[index].width,
                                                height: imagePositions[index].height,
                                            }}
                                            onDragStop={(e, d) => {
                                                handlePositionChange(index, { ...imagePositions[index], x: d.x, y: d.y });
                                            }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                handlePositionChange(index, {
                                                    x: position.x,
                                                    y: position.y,
                                                    width: ref.offsetWidth,
                                                    height: ref.offsetHeight,
                                                });
                                            }}
                                            bounds="parent"
                                            minWidth={40}
                                            minHeight={40}
                                            maxWidth={180}
                                            maxHeight={180}
                                            lockAspectRatio={true}
                                        >
                                            <img
                                                src={image}
                                                alt={`Design ${index + 1}`}
                                                className="w-full h-full object-contain cursor-move"
                                            />
                                        </Rnd>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                                        transition-colors duration-200 focus:ring-2 focus:ring-blue-300"
                            >
                                Upload Design
                            </button>
                            <button
                                onClick={handleSaveImage}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                        transition-colors duration-200 focus:ring-2 focus:ring-green-300"
                            >
                                Save Design
                            </button>
                        </div>

                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TShirtDesigner;