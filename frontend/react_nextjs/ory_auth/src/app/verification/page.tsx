'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import VerificationForm from "@/components/forms/VerificationForm"

export const description =
    "A verification form with code."

const VerificationPage = () => {

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <VerificationForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default VerificationPage;