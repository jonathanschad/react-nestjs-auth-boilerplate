import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import * as uuid from 'uuid';

import api from '@/repository';

export const ProfilePictureEditor = () => {
    const [image, setImage] = useState<File>();
    const editorRef = React.useRef<AvatarEditor>(null);
    const changeUuid = React.useRef<string>(uuid.v4());

    // Handle file upload
    const handleFileUpload = async () => {
        if (!image || !editorRef.current) {
            return;
        }
        const formData = new FormData();

        const imageBlob = await new Promise<Blob>((res, rej) => {
            if (editorRef.current === null) {
                return rej(new Error('Editor reference is null'));
            }
            editorRef.current.getImageScaledToCanvas().toBlob(
                (imageBlob) => {
                    if (!imageBlob) return rej(new Error('Image blob is null'));
                    res(imageBlob);
                },
                'image/webp',
                0.8,
            );
        });

        formData.append('file', imageBlob);

        try {
            const response = await api.patch(`/user/profile-picture/${changeUuid.current}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // You can add authorization header here if necessary
                    // Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('File uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <Dropzone onDrop={(dropped) => setImage(dropped[0] as unknown as File)} noClick noKeyboard minSize={100}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} style={{ height: 256, width: 256, backgroundColor: '#ff0000' }}>
                        {image && <AvatarEditor ref={editorRef} width={250} height={250} image={image} />}
                        <input {...getInputProps()} />
                    </div>
                )}
            </Dropzone>

            <button className="mt-8" onClick={() => void handleFileUpload()}>
                Upload File
            </button>
        </div>
    );
};
