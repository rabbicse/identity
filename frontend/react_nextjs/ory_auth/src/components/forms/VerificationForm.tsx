'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ory from "@/lib/sdk/ory"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RegistrationFlow, VerificationFlow } from "@ory/client"

export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export default function VerificationForm() {
    const router = useRouter()

    // The "flow" represents a registration process and contains
    // information about the form we need to render (e.g. username + password)
    const [flow, setFlow] = useState<VerificationFlow>();
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (flow) {
            return;
        }

        // Otherwise we initialize it
        ory
            .createBrowserVerificationFlow({
                returnTo: undefined,
            })
            .then(({ data }) => {
                setFlow(data);
                // Retrieve the CSRF token from the flow response
                const csrfNode = data.ui.nodes.find(node => node.attributes.name === 'csrf_token');
                if (csrfNode) {
                    setCsrfToken(csrfNode.attributes.value as string);
                }
            })
            .catch((error) => {
                console.log(`Error when create browser registration flow! ${error}`);
            })
    }, [flow]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        ory
            .updateVerificationFlow({
                flow: String(flow?.id),
                updateVerificationFlowBody: {
                    csrf_token: csrfToken,
                    code: code,
                    method: "code"                    
                }
            })
            .then(async ({ data }) => {
                // If we ended up here, it means we are successfully signed up!
                //
                // You can do cool stuff here, like having access to the identity which just signed up:
                console.log("This is the user session: ", data, data?.state)
            })
            .catch((err) => {
                console.log(err);
                // If the previous handler did not catch the error it's most likely a form validation error
                if (err.response?.status === 400) {
                    // Yup, it is!
                    setFlow(err.response?.data)
                    return
                }

                return Promise.reject(err)
            })
    }

    return (
        <form onSubmit={onSubmit}>
            {error && <div className="text-red-500">{error}</div>}

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="verification-code">First name</Label>
                    <Input id="verification-code"
                        placeholder="Ex: 123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required />
                </div>
                <Button type="submit" className="w-full">
                    Verify
                </Button>
            </div>
        </form>
    );
}