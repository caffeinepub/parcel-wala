import { useState } from 'react';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import PhoneOtpVerificationSheet from './verification/PhoneOtpVerificationSheet';
import EmailOtpVerificationSheet from './verification/EmailOtpVerificationSheet';
import GovernmentIdVerificationFlow from './verification/GovernmentIdVerificationFlow';

export default function VerificationDashboard() {
  const { data: profile } = useGetCallerUserProfile();
  const [phoneSheetOpen, setPhoneSheetOpen] = useState(false);
  const [emailSheetOpen, setEmailSheetOpen] = useState(false);
  const [govIdFlowOpen, setGovIdFlowOpen] = useState(false);

  const verificationItems = [
    {
      key: 'identityVerified' as const,
      label: 'Identity Verified',
      description: 'Government ID verification',
      isVerified: profile?.identityVerified || false,
      onVerify: () => setGovIdFlowOpen(true),
    },
    {
      key: 'phoneVerified' as const,
      label: 'Phone Verified',
      description: 'Mobile number verification',
      isVerified: profile?.phoneVerified || false,
      onVerify: () => setPhoneSheetOpen(true),
    },
    {
      key: 'emailVerified' as const,
      label: 'Email Verified',
      description: 'Email address verification',
      isVerified: profile?.emailVerified || false,
      onVerify: () => setEmailSheetOpen(true),
    },
    {
      key: 'governmentIdUploaded' as const,
      label: 'Government ID',
      description: 'ID document uploaded',
      isVerified: profile?.governmentIdUploaded || false,
      onVerify: () => setGovIdFlowOpen(true),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {verificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                {item.isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Button
                variant={item.isVerified ? 'outline' : 'default'}
                size="sm"
                onClick={item.onVerify}
                disabled={item.isVerified}
              >
                {item.isVerified ? 'Verified' : 'Verify Now'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <PhoneOtpVerificationSheet
        open={phoneSheetOpen}
        onOpenChange={setPhoneSheetOpen}
      />

      <EmailOtpVerificationSheet
        open={emailSheetOpen}
        onOpenChange={setEmailSheetOpen}
      />

      <GovernmentIdVerificationFlow
        open={govIdFlowOpen}
        onOpenChange={setGovIdFlowOpen}
      />
    </>
  );
}
