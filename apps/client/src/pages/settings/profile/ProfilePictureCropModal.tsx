import { Button } from '@boilerplate/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@boilerplate/ui/components/dialog';
import { Slider } from '@boilerplate/ui/components/slider';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import type { Area, Point } from 'react-easy-crop';
import Cropper from 'react-easy-crop';

interface ProfilePictureCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onUpload: (croppedAreaPixels: Area) => Promise<void>;
    isUploading: boolean;
}

export const ProfilePictureCropModal = ({
    isOpen,
    onClose,
    imageSrc,
    onUpload,
    isUploading,
}: ProfilePictureCropModalProps) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleUpload = async () => {
        if (!croppedAreaPixels) {
            return;
        }
        await onUpload(croppedAreaPixels);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isUploading) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        <Translation>settings.profilePicture.crop</Translation>
                    </DialogTitle>
                    <DialogDescription>
                        <Translation>settings.profilePicture.cropDescription</Translation>
                    </DialogDescription>
                </DialogHeader>

                <div className="relative h-[400px] w-full bg-muted">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropChange={setCrop}
                            onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            onZoomChange={setZoom}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="zoom" className="text-sm font-medium">
                        <Translation>settings.profilePicture.zoom</Translation>
                    </label>
                    <Slider
                        id="zoom"
                        min={1}
                        max={3}
                        step={0.1}
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        className="w-full"
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                        <Translation>cancel</Translation>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void handleUpload()}
                        disabled={isUploading}
                        className="gap-2"
                        loading={isUploading}
                    >
                        <Upload className="h-4 w-4" />
                        <Translation>upload</Translation>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
