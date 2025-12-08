import { Typography } from '@darts/ui/components/typography';
import { cn } from '@darts/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

const dropzoneVariants = cva(
    'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    {
        variants: {
            size: {
                sm: 'p-4',
                default: 'p-8',
                lg: 'p-12',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

export interface DropzoneProps extends VariantProps<typeof dropzoneVariants> {
    onFilesSelected: (files: File[]) => void;
    dropzoneOptions?: Omit<DropzoneOptions, 'onDrop'>;
    className?: string;
    icon?: LucideIcon;
    activeIcon?: LucideIcon;
    title?: React.ReactNode;
    activeTitle?: React.ReactNode;
    description?: React.ReactNode;
    hint?: React.ReactNode;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
    (
        {
            onFilesSelected,
            dropzoneOptions,
            className,
            icon: Icon,
            activeIcon: ActiveIcon,
            title,
            activeTitle,
            description,
            hint,
            size,
            ...props
        },
        ref,
    ) => {
        const onDrop = React.useCallback(
            (acceptedFiles: File[]) => {
                if (acceptedFiles.length > 0) {
                    onFilesSelected(acceptedFiles);
                }
            },
            [onFilesSelected],
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            ...dropzoneOptions,
            onDrop,
        });

        const ActiveIconToUse = ActiveIcon ?? Icon;

        return (
            <div
                {...getRootProps()}
                className={cn(
                    dropzoneVariants({ size }),
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                    className,
                )}
                ref={ref}
                {...props}
            >
                <input {...getInputProps()} />
                <div className="pointer-events-none grid h-full w-full">
                    {/* Normal state */}
                    <div
                        className={cn('flex items-center justify-center', isDragActive ? 'opacity-0' : 'opacity-100')}
                        style={{ gridArea: '1/1' }}
                    >
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <div className="rounded-full bg-muted p-3 transition-colors">
                                    <Icon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}

                            <div className="space-y-2">
                                {title && (
                                    <Typography as="normalText" className="font-medium">
                                        {title}
                                    </Typography>
                                )}
                                {description && <Typography as="smallMutedText">{description}</Typography>}
                                {hint && <Typography as="xSmallMutedText">{hint}</Typography>}
                            </div>
                        </div>
                    </div>

                    {/* While item dragged over dropzone state */}
                    <div
                        className={cn('flex items-center justify-center', isDragActive ? 'opacity-100' : 'opacity-0')}
                        style={{ gridArea: '1/1' }}
                    >
                        <div className="flex items-center gap-4">
                            {ActiveIconToUse && (
                                <div className="rounded-full bg-primary/10 p-3 transition-colors">
                                    <ActiveIconToUse className="h-8 w-8 text-primary" />
                                </div>
                            )}

                            <div className="space-y-2">
                                {activeTitle && (
                                    <Typography as="normalText" className="font-medium text-primary">
                                        {activeTitle}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

Dropzone.displayName = 'Dropzone';
