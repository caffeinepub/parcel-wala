import { useState } from 'react';
import { useSignUp } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SignUpModal({ open, onClose }: SignUpModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [governmentIdAddress, setGovernmentIdAddress] = useState('');
  const signUp = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim() || !governmentIdAddress.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await signUp.mutateAsync({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        governmentIdAddress: governmentIdAddress.trim(),
      });
      toast.success('Account created successfully!');
      sessionStorage.removeItem('parcel-wala-signup-intent');
      onClose();
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        toast.error('Account already exists. Please log in instead.');
      } else {
        toast.error('Failed to create account');
      }
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Sign Up for Parcel Wala</DialogTitle>
          <DialogDescription>
            Please provide your details to create your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="text-xl font-semibold bg-transparent border-2 focus:border-primary"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (as per Government ID) *</Label>
            <Textarea
              id="address"
              value={governmentIdAddress}
              onChange={(e) => setGovernmentIdAddress(e.target.value)}
              placeholder="Enter your complete address as shown on your government ID"
              rows={3}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={signUp.isPending}>
            {signUp.isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
