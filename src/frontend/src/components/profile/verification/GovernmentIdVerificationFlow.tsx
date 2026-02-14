import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import { useActor } from '../../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ExternalBlob } from '../../../backend';
import AnimatedSwap from '../../motion/AnimatedSwap';
import { Upload, FileCheck, CheckCircle } from 'lucide-react';

interface GovernmentIdVerificationFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GovernmentIdVerificationFlow({ open, onOpenChange }: GovernmentIdVerificationFlowProps) {
  const [step, setStep] = useState<'upload' | 'review' | 'confirm'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { setTransientBackHandler } = useNavigation();

  useEffect(() => {
    if (open) {
      setTransientBackHandler(() => () => {
        if (step === 'confirm') {
          setStep('review');
        } else if (step === 'review') {
          setStep('upload');
        } else {
          onOpenChange(false);
        }
      });
    } else {
      setTransientBackHandler(null);
      setStep('upload');
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    }

    return () => setTransientBackHandler(null);
  }, [open, step, onOpenChange, setTransientBackHandler]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file || !actor) return;

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await actor.uploadFrontIdScan(blob);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('ID uploaded successfully');
      setStep('review');
    } catch (error: any) {
      toast.error('Failed to upload ID');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleConfirm = async () => {
    try {
      if (!actor) throw new Error('Actor not available');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Identity verification complete!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Failed to confirm verification');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Government ID Verification</SheetTitle>
          <SheetDescription>
            {step === 'upload' && 'Upload a clear photo of your government ID'}
            {step === 'review' && 'Review your uploaded document'}
            {step === 'confirm' && 'Confirm your identity verification'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <AnimatedSwap swapKey={step}>
            {step === 'upload' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="id-upload">Upload Government ID</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      id="id-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Accepted: Aadhaar, PAN, Passport, Driving License
                    </p>
                  </div>
                </div>

                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <img
                      src={previewUrl}
                      alt="ID Preview"
                      className="w-full rounded-lg border border-border"
                    />
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  className="w-full"
                  size="lg"
                  disabled={!file || isUploading}
                >
                  {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Document'}
                </Button>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-6">
                <div className="rounded-lg border border-border p-6 text-center space-y-4">
                  <FileCheck className="h-16 w-16 mx-auto text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Document Uploaded</h3>
                    <p className="text-sm text-muted-foreground">
                      Your government ID has been uploaded successfully
                    </p>
                  </div>
                </div>

                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Uploaded Document</Label>
                    <img
                      src={previewUrl}
                      alt="Uploaded ID"
                      className="w-full rounded-lg border border-border"
                    />
                  </div>
                )}

                <Button
                  onClick={() => setStep('confirm')}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Confirmation
                </Button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-6">
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-6 text-center space-y-4">
                  <CheckCircle className="h-16 w-16 mx-auto text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Confirm Your Identity</h3>
                    <p className="text-sm text-muted-foreground">
                      By confirming, you verify that the uploaded document is authentic and belongs to you
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Document is clear and readable</p>
                  <p>✓ All details are visible</p>
                  <p>✓ Document is valid and not expired</p>
                </div>

                <Button
                  onClick={handleConfirm}
                  className="w-full"
                  size="lg"
                >
                  Confirm & Complete Verification
                </Button>
              </div>
            )}
          </AnimatedSwap>
        </div>
      </SheetContent>
    </Sheet>
  );
}
