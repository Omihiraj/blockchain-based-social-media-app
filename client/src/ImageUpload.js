import React, { useState } from 'react';
import { db, storage } from './services/firebase';
import { getDownloadURL, ref as storageRef, uploadBytes, } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const uniqueId = uuidv4();
    const onFileSelect = (event) => {
        const file = event.target.files[0];
        if (file == null) return null;
        const isValid = validateFileType(file);

        if (isValid) {
            setSelectedFile(file);
            setPreviewURL(URL.createObjectURL(file));
            const imgRef = storageRef(storage, `files/${uniqueId}`);
            uploadBytes(imgRef, file)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((url) => {
                            console.log(url);
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                })
                .catch((error) => {
                    console.log(error.message);
                });

        } else {
            // Handle invalid file type (e.g., display error message)
            console.error('Invalid file type. Please select an image.');
        }
    };



    const validateFileType = (file) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const extension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(extension);
    };

    return (
        <div style={{ height: 50, width: 100, }}>
            <input type="file" accept="image/*" onChange={onFileSelect} />
            {previewURL && (
                <img src={previewURL} alt="Selected Image" style={{ objectFit: 'contain', height: 50, width: 100, }} />
            )}

        </div>
    );
};

export default ImageUpload;
