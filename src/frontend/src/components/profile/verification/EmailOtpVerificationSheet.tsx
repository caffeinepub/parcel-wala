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

interface EmailOtpVerificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmailOtpVerificationSheet({ open, onOpenChange }: EmailOtpVerificationSheetProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
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
          setStep('email');
        } else {
          onOpenChange(false);
        }
      });
    } else {
      setTransientBackHandler(null);
      setStep('email');
      setEmail('');
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
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setStep('otp');
    setResendTimer(30);
    toast.success('OTP sent to your email');
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      if (!actor) throw new Error('Actor not available');
      await actor.verifyEmail(otp);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Email verified successfully!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    toast.success('OTP resent to your email');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Verify Email Address</SheetTitle>
          <SheetDescription>
            {step === 'email' ? 'Enter your email address to receive OTP' : 'Enter the OTP sent to your email'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <AnimatedSwap swapKey={step}>
            {step === 'email' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
