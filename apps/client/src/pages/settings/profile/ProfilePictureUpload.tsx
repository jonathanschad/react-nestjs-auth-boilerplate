import { Translation } from '@darts/ui/i18n/Translation';
import { useRef, useState } from 'react';
import type { Area } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as uuid from 'uuid';
import { useUploadProfilePicture } from '@/api/user/useUploadProfilePicture';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ProfilePictureCropModal } from '@/pages/settings/profile/ProfilePictureCropModal';
import { ProfilePictureDropzone } from '@/pages/settings/profile/ProfilePictureDropzone';

interface ProfilePictureUploadProps {
    userUuid: string;
}

export const ProfilePictureUpload = ({ userUuid }: ProfilePictureUploadProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const idempotencyKey = useRef<string>(uuid.v4());
    const { t } = useTranslation('common');

    const resetState = () => {
        setIsDialogOpen(false);
        setImageSrc(null);
        idempotencyKey.current = uuid.v4();
    };

    const uploadMutation = useUploadProfilePicture({
        userUuid,
        onSuccess: resetState,
    });

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(t('settings.profilePicture.invalidFileType'));
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(t('settings.profilePicture.fileTooLarge'));
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result as string);
            setIsDialogOpen(true);
        });
        reader.readAsDataURL(file);
    };

    const handleUpload = async (croppedAreaPixels: Area) => {
        if (!imageSrc) {
            toast.error(t('settings.profilePicture.uploadError'));
            return;
        }

        await uploadMutation.mutateAsync({
            imageSrc: imageSrc,
            area: croppedAreaPixels,
            idempotencyKey: idempotencyKey.current,
        });

        resetState();
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Profile Picture */}
                <div className="flex items-center gap-4">
                    <ProfilePicture size={80} />
                    <div className="flex flex-col gap-1">
                        <Translation as="p" className="text-sm font-medium">
                            settings.profilePicture.currentPicture
                        </Translation>
                        <Translation as="p" className="text-xs text-muted-foreground">
                            settings.profilePicture.hint
                        </Translation>
                    </div>
                </div>

                {/* Dropzone */}
                <ProfilePictureDropzone onFileSelect={handleFileSelect} />
            </div>

            {/* Crop Modal */}
            <ProfilePictureCropModal
                isOpen={isDialogOpen}
                onClose={resetState}
                imageSrc={imageSrc}
                onUpload={handleUpload}
                isUploading={uploadMutation.isLoading}
            />
        </>
    );
};
