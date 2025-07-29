import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import * as uuid from 'uuid';
import { CircleUser, Upload, X } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';

import { Avatar } from '@boilerplate/ui/components/avatar';
import { Button } from '@boilerplate/ui/components/button';
import { Card, CardContent } from '@boilerplate/ui/components/card';

import { AuthenticatedImage } from '@/components/authenticated-image';
import { useUser } from '@/store/async-store';
import api from '@/repository';

interface ProfilePictureUploadProps {
    onUploadComplete?: () => void;
}

export const ProfilePictureUpload = ({ onUploadComplete }: ProfilePictureUploadProps) => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();
    const [image, setImage] = useState<File>();
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef<AvatarEditor>(null);
    const changeUuid = useRef<string>(uuid.v4());

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!image || !editorRef.current) {
                throw new Error('No image or editor reference');
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
            const response = await api.patch(`/user/profile-picture/${changeUuid.current}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate user query to refresh profile picture
            queryClient.invalidateQueries(['user']);
            setImage(undefined);
            setIsEditing(false);
            changeUuid.current = uuid.v4(); // Generate new UUID for next upload
            onUploadComplete?.();
        },
        onError: (error) => {
            console.error('Error uploading profile picture:', error);
        },
    });

    const handleCancel = () => {
        setImage(undefined);
        setIsEditing(false);
    };

    const handleUpload = () => {
        uploadMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Current Profile Picture */}
            <Avatar className="h-32 w-32">
                <AuthenticatedImage
                    key={user?.profilePictureId}
                    fileUuid={user?.profilePictureId}
                    className="aspect-square h-full w-full"
                    fallback={<CircleUser className="h-20 w-20" />}
                />
            </Avatar>

            {/* Upload Section */}
            {!isEditing && (
                <Dropzone
                    onDrop={(dropped) => {
                        setImage(dropped[0] as File);
                        setIsEditing(true);
                    }}
                    accept={{ 'image/*': [] }}
                    multiple={false}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                            {...getRootProps()}
                            className={`
                                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                                ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
                            `}
                        >
                            <input {...getInputProps()} />
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                {isDragActive ? 'Drop your image here' : 'Click or drag to upload new profile picture'}
                            </p>
                        </div>
                    )}
                </Dropzone>
            )}

            {/* Image Editor */}
            {isEditing && image && (
                <Card className="w-full max-w-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <AvatarEditor
                                    ref={editorRef}
                                    image={image}
                                    width={200}
                                    height={200}
                                    border={20}
                                    borderRadius={100}
                                    scale={1}
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={uploadMutation.isLoading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploadMutation.isLoading}
                                >
                                    {uploadMutation.isLoading ? 'Uploading...' : 'Upload'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};