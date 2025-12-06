import type React from 'react';
import { useState } from 'react';
import * as uuid from 'uuid';

import { tsRestClient } from '@/api/client';

const FileUpload = () => {
    const [file, setFile] = useState<File>();
    const [uploadStatus, setUploadStatus] = useState('');

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) setFile(event.target.files[0]);
    };

    // Handle file upload
    const handleFileUpload = async (): Promise<void> => {
        if (!file) {
            setUploadStatus('No file selected');
            return;
        }
        const fileUuid = uuid.v4();
        const formData = new FormData();
        formData.append('file', file);

        const response = await tsRestClient.user.uploadProfilePicture({
            params: { idempotencyKey: fileUuid },
            body: formData,
        });

        if (response.status === 200) {
            setUploadStatus('File uploaded successfully!');
            console.log('File uploaded successfully');
        } else {
            setUploadStatus('Failed to upload file.');
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} />
            <button type="button" onClick={() => void handleFileUpload()}>
                Upload File
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default FileUpload;
