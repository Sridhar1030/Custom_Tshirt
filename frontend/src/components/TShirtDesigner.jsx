import React, { useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import axios from 'axios';
import Tshirt from '../assets/tshirt.png';

const TShirtDesigner = () => {
    const [uploadedImages, setUploadedImages] = useState([]); // Array of images
    const [imagePositions, setImagePositions] = useState([]); // Store image positions
    const fileInputRef = useRef(null);
    const tShirtRef = useRef(null); // Reference to the T-shirt design area

    // Handle multiple image uploads
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
                { x: 0, y: 0, width: 100, height: 100 }, // Default position and size
            ]);
        });
    };

    // Handle image position change using the Rnd component
    const handlePositionChange = (index, newPosition) => {
        const updatedPositions = [...imagePositions];
        updatedPositions[index] = newPosition;
        setImagePositions(updatedPositions);
    };

    // Save the T-shirt design as an image and send it to the backend using Axios
    const handleSaveImage = () => {
        html2canvas(tShirtRef.current).then((canvas) => {
            const imageBlob = canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error: Image not generated');
                    return;
                }
                const USER_ID = localStorage.getItem('userID'); // Get userID from localStorage

                const file = new File([blob], 'tshirt-design.png', { type: 'image/png' });

                // Create FormData and append the image
                const formData = new FormData();
                formData.append('image', file);
                formData.append('userId', USER_ID); 
                // Debug: Check that FormData contains the file
                console.log('FormData:', formData);

                // Check if the file is appended correctly
                if (!formData.has('image')) {
                    console.error('FormData does not contain the image file');
                    return;
                }

                // Use Axios to upload the image
                axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then((response) => {
                        console.log('Image saved:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error uploading image:', error);
                    });
            });
        });
    };

    return (
        <div className="flex bg-gray-100 min-h-screen p-8">
            {/* Sidebar for image previews */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center">Uploaded Images</h2>
                {uploadedImages.length > 0 ? (
                    uploadedImages.map((image, index) => (
                        <div key={index} className="relative mb-4">
                            <img
                                src={image}
                                alt={`preview-${index}`}
                                className="w-full h-24 object-contain border border-gray-200 rounded-md"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No images uploaded</p>
                )}
            </div>

            {/* Main T-shirt designer area */}
            <div className="flex-1 bg-white p-8 rounded-lg shadow-md ml-4">
                <h1 className="text-xl font-bold mb-4 text-center">Design Your T-Shirt</h1>

                <div className="flex justify-center">
                    <div className="relative w-72 h-96" ref={tShirtRef}>
                        {/* White T-shirt Image */}
                        <img
                            src={Tshirt}
                            alt="T-shirt"
                            className="w-full h-full object-contain"
                        />

                        {/* Image placement area (only chest area of the T-shirt) */}
                        <div className="absolute top-16 left-8 w-56 h-72 overflow-hidden">
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
                                    minWidth={50}
                                    minHeight={50}
                                    maxWidth={200}
                                    maxHeight={200}
                                    lockAspectRatio={true}
                                >
                                    <img
                                        src={image}
                                        alt={`design-${index}`}
                                        className="w-full h-full object-contain"
                                    />
                                </Rnd>
                            ))}
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    multiple
                    onChange={handleImageUpload}
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Upload Image
                </button>

                <button
                    onClick={handleSaveImage}
                    className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded"
                >
                    Save Image
                </button>
            </div>
        </div>
    );
};

export default TShirtDesigner;
