import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../ui/input-otp';
import { toast } from 'sonner';
import { useActor } from '../../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '../../../contexts/NavigationContext';
import AnimatedSwap from '../../motion/AnimatedSwap';

interface PhoneOtpVerificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PhoneOtpVerificationSheet({ open, onOpenChange }: PhoneOtpVerificationSheetProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { setTransientBackHandler } = useNavigation();

  useEffect(() => {
    if (open) {
      setTransientBackHandler(() => () => {
        if (step === 'otp') {
          setStep('phone');
        } else {
          onOpenChange(false);
        }
      });
    } else {
      setTransientBackHandler(null);
      setStep('phone');
      setPhone('');
      setOtp('');
      setResendTimer(0);
    }

    return () => setTransientBackHandler(null);
  }, [open, step, onOpenChange, setTransientBackHandler]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setStep('otp');
    setResendTimer(30);
    toast.success('OTP sent to your phone');
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      if (!actor) throw new Error('Actor not available');
      await actor.verifyMobileNumber(otp);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Phone verified successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    toast.success('OTP resent to your phone');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Verify Phone Number</SheetTitle>
          <SheetDescription>
            {step === 'phone' ? 'Enter your mobile number to receive OTP' : 'Enter the OTP sent to your phone'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <AnimatedSwap swapKey={step}>
            {step === 'phone' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={15}
                  />
                </div>
                <Button onClick={handleSendOtp} className="w-full" size="lg">
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    For testing, use OTP: <strong>123456</strong>
                  </p>
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  className="w-full"
                  size="lg"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in {resendTimer}s
                    </p>
                  ) : (
                    <Button variant="link" onClick={handleResend}>
                      Resend OTP
                    </Button>
                  )}
                </div>
              </div>
            )}
          </AnimatedSwap>
        </div>
      </SheetContent>
    </Sheet>
  );
}
