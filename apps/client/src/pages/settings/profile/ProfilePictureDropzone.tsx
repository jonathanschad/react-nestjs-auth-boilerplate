import { Dropzone } from '@boilerplate/ui/components/dropzone';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Camera, ImagePlus } from 'lucide-react';

interface ProfilePictureDropzoneProps {
    onFileSelect: (file: File) => void;
}

export const ProfilePictureDropzone = ({ onFileSelect }: ProfilePictureDropzoneProps) => {
    const handleFilesSelected = (files: File[]) => {
        const file = files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <Dropzone
            onFilesSelected={handleFilesSelected}
            dropzoneOptions={{
                accept: {
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                },
                maxFiles: 1,
                multiple: false,
                noKeyboard: true,
            }}
            icon={Camera}
            activeIcon={ImagePlus}
            title={
                <div className="space-y-1">
                    <Translation as="p" className="text-base font-medium">
                        settings.profilePicture.dragDrop
                    </Translation>
                    <Translation as="p" className="text-sm text-muted-foreground">
                        settings.profilePicture.orClick
                    </Translation>
                </div>
            }
            activeTitle={
                <Translation as="p" className="text-base font-medium text-primary">
                    settings.profilePicture.dropHere
                </Translation>
            }
            hint={
                <Translation as="p" className="text-xs text-muted-foreground">
                    settings.profilePicture.supportedFormats
                </Translation>
            }
        />
    );
};
