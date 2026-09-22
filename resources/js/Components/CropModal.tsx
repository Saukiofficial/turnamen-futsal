import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, Check, X, RotateCcw } from 'lucide-react';

interface CropModalProps {
    imageSrc: string;
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
}

export default function CropModal({ imageSrc, isOpen, onClose, onCropComplete }: CropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onCropCompleteHandler = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;

        try {
            setProcessing(true);
            const image = await createImage(imageSrc);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                setProcessing(false);
                return;
            }

            // Set final 3:4 resolution e.g. 600 x 800
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            canvas.toBlob((blob) => {
                setProcessing(false);
                if (blob) {
                    const previewUrl = URL.createObjectURL(blob);
                    onCropComplete(blob, previewUrl);
                    onClose();
                }
            }, 'image/jpeg', 0.95);
        } catch (e) {
            console.error('Error generating cropped image:', e);
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-navy-950">Sesuaikan Foto 3×4</h3>
                        <p className="text-xs text-slate-500">Geser dan atur perbesaran agar wajah terlihat jelas dalam bingkai rasio 3:4.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper area */}
                <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={onCropChange}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteHandler}
                        showGrid={true}
                    />
                </div>

                {/* Controls */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-4">
                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                        <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                        <button
                            type="button"
                            onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200"
                            title="Reset Posisi"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                        >
                            Batalkan
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleConfirm}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            <span>{processing ? 'Memproses...' : 'Gunakan Foto'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
