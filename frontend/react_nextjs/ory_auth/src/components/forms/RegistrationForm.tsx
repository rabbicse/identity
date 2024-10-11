'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ory from "@/lib/sdk/ory"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RegistrationFlow } from "@ory/client"

export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export default function RegistrationForm() {
    const router = useRouter()

    // The "flow" represents a registration process and contains
    // information about the form we need to render (e.g. username + password)
    const [flow, setFlow] = useState<RegistrationFlow>();
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (flow) {
            return;
        }

        // Otherwise we initialize it
        ory
            .createBrowserRegistrationFlow({
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
            .updateRegistrationFlow({
                flow: String(flow?.id),
                updateRegistrationFlowBody: {
                    csrf_token: csrfToken,
                    method: "password",
                    password: password,
                    traits: {
                        email: email,
                        name: {
                            first: firstName,
                            last: lastName
                        }
                    }
                }
            })
            .then(async ({ data }) => {
                // If we ended up here, it means we are successfully signed up!
                //
                // You can do cool stuff here, like having access to the identity which just signed up:
                console.log("This is the user session: ", data, data.identity)

                // // continue_with is a list of actions that the user might need to take before the registration is complete.
                // // It could, for example, contain a link to the verification form.
                // if (data.continue_with) {
                //     for (const item of data.continue_with) {
                //         switch (item.action) {
                //             case "show_verification_ui":
                //                 await router.push("/verification?flow=" + item.flow.id)
                //                 return
                //         }
                //     }
                // }

                // // If continue_with did not contain anything, we can just return to the home page.
                // await router.push(flow?.return_to || "/")
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
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                    Create an account
                </Button>
                <Button variant="outline" className="w-full">
                    Sign up with GitHub
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Sign in
                </Link>
            </div>
        </form>
    );
}