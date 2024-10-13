"use client"

import SettingsForm from "@/components/forms/SettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Manage 2FA TOTP Authenticator App</CardTitle>
          <CardDescription>
          Use an authenticator app (such as Google Authenticator or LastPass Authenticator) to scan the QR code below and
          enable two-factor authentication on your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage;
