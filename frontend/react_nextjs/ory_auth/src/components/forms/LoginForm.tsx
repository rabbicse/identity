'use client'

import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { Configuration, FrontendApi, LoginFlow } from "@ory/client"
import { useRouter } from "next/navigation";

const basePath = process.env.NEXT_PUBLIC_ORY_SDK_URL;

const ory = new FrontendApi(
    new Configuration({
        basePath: basePath,
        baseOptions: {
            withCredentials: true,
        },
    })
);

export default function LoginForm() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [flow, setFlow] = useState<LoginFlow>();
    const [error, setError] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [isFlowCreated, setIsFlowCreated] = useState(false); // Track if flow is created    

    useEffect(() => {
        if (flow) {
            console.log("flow already exists!");
            console.log(`Flow id exists: ${flow?.id}`);
            return;
        }

        const createLoginFlow = async () => {
            try {
                const { data } = await ory.createBrowserLoginFlow({
                    refresh: false,
                    aal: undefined,
                    returnTo: undefined,
                });
                setFlow(data);
                console.log(data);
                console.log(data.ui.nodes);
                console.log(`Flow id: ${data?.id}`);

                // Retrieve the CSRF token from the flow response
                const csrfNode = data.ui.nodes.find(node => node.attributes.name === 'csrf_token');
                if (csrfNode) {
                    console.log(csrfNode);
                    setCsrfToken(csrfNode.attributes.value as string);
                }
            } catch (err) {
                console.error("Error creating login flow:", err);
                setError("Could not create login flow. Please try again.");
            }
        };

        if (!isFlowCreated) {
            createLoginFlow();
            setIsFlowCreated(true);
        }

    }, [isFlowCreated, flow]);


    const onSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!flow || !csrfToken) {
            setError("Login flow is not available. Please refresh the page.");
            return;
        }

        try {
            console.log(`Flow id on submit: ${flow?.id}`);
            const response = await ory.updateLoginFlow({
                flow: flow?.id,
                updateLoginFlowBody: {
                    csrf_token: csrfToken,
                    identifier: userName,
                    password: password,
                    method: "password"
                }
            });

            console.log("Login success:", response.data);
            // Redirect or handle login success
            return router.push('/');
        } catch (err: any) {
            console.error("Login failed:", err.response?.data || err);
            setError("Login failed. Please check your credentials.");
        }
    };


    return (
        <form onSubmit={onSubmitLogin} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
            {error && <div className="text-red-500">{error}</div>}

            <div>
                <label
                    htmlFor="email"
                    className="block text-xs text-gray-600 uppercase"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    autoComplete="email"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-xs text-gray-600 uppercase"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
            </div>


            <SubmitButton>Sign in</SubmitButton>
            <p className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/register" className="font-semibold text-gray-800">
                    Sign up
                </Link>
                {' for free.'}
            </p>
        </form>
    );
}

// export default LoginForm;