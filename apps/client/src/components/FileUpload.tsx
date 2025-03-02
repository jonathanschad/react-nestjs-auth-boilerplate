import React, { useState } from 'react';
import * as uuid from 'uuid';

import api from '@client/repository';
const FileUpload = () => {
    const [file, setFile] = useState<File>();
    const [uploadStatus, setUploadStatus] = useState('');

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setFile(event.target.files[0]);
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus('No file selected');
            return;
        }
        const fileUuid = uuid.v4();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.patch(`/file/profile-picture/${fileUuid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // You can add authorization header here if necessary
                    // Authorization: `Bearer ${accessToken}`,
                },
            });

            setUploadStatus('File uploaded successfully!');
            console.log('File uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Failed to upload file.');
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default FileUpload;
