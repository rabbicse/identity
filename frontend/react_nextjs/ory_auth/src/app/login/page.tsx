"use client";

import { LoginFlow, Configuration, FrontendApi, UpdateLoginFlowBody } from "@ory/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_ORY_SDK_URL;

const ory = new FrontendApi(
    new Configuration({
        basePath: basePath,
        baseOptions: {
            withCredentials: true,
        },
    })
);





const CustomLoginForm = ({ flow, onSubmit } : {flow: LoginFlow, onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) => {
    return (
        <form onSubmit={onSubmit}>
          {flow.ui.nodes.map((node) => {
            switch (node.type) {
              case "input":
                return (
                  <div key={node.attributes.name}>
                    <label htmlFor={node.attributes.name}>
                      {node.meta.label?.text}
                    </label>
                    <input
                      id={node.attributes.name}
                      name={node.attributes.name}
                      type={node.attributes.type}
                      value={node.attributes.value || ""}
                    />
                  </div>
                );
              case "button":
                return (
                  <button key={node.attributes.name} type={node.attributes.type}>
                    {node.meta.label?.text}
                  </button>
                )
              default:
                return null
            }
          })}
        </form>
      )
  }
  

async function initiateLoginFlow() {
    const response = await fetch('http://localhost:4455/self-service/login/api', {
        method: 'GET',
        credentials: 'include', // Ensures cookies are included, if needed for sessions
    })

    if (!response.ok) {
        throw new Error('Failed to initiate login flow')
    }

    const flowData = await response.json()
    return flowData // Contains the flow ID and other important data
}

async function submitLoginCredentials(flowId: string, email: string, password: string) {
    const response = await fetch(`http://localhost:4433/self-service/login?flow=${flowId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method: 'password',
            password_identifier: email, // Can be username or email based on Kratos config
            password: password,
        }),
    })

    if (!response.ok) {
        throw new Error('Login failed')
    }

    const loginResult = await response.json();
    console.log(loginResult);
    return loginResult // Contains session info or success message
}

async function getSession() {
    const response = await fetch('http://localhost:4433/sessions/whoami', {
        method: 'GET',
        credentials: 'include', // Include session cookies
    })

    if (!response.ok) {
        throw new Error('Session not found')
    }

    const sessionData = await response.json()
    return sessionData // Contains session info like user ID, etc.
}




export default function Login() {

    initiateLoginFlow().then((response) => {
        console.log(response);
    }).catch((err) => {
        console.log(err);
    });


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [flow, setFlow] = useState<LoginFlow>();
    const [isReady, setIsReady] = useState(false);
    const searchParams = useSearchParams();
    useEffect(() => {
        // Simulate router.isReady when searchParams become available
        if (searchParams) {
            setIsReady(true)
        }
    }, [searchParams])

    const returnTo = searchParams.get('return_to');
    const flowId = searchParams.get('flow');
    const refresh = searchParams.get('refresh');
    const aal = searchParams.get('aal');

    useEffect(() => {
        // If the router is not ready yet, or we already have a flow, do nothing.
        if (!isReady || flow) {
            return
        }

        // If ?flow=.. was in the URL, we fetch it
        if (flowId) {
            ory
                .getLoginFlow({ id: String(flowId) })
                .then(({ data }) => {
                    setFlow(data)
                }).catch((err) => {
                    console.log(err);
                })
            // .catch(handleGetFlowError(router, "login", setFlow))
            return
        }

        // Otherwise we initialize it
        ory
            .createBrowserLoginFlow({
                refresh: Boolean(refresh),
                aal: aal ? String(aal) : undefined,
                returnTo: returnTo ? String(returnTo) : undefined,
            })
            .then(({ data }) => {
                setFlow(data)
            })
            .catch((err) => {
                console.log(err);
            });
        // .catch(handleFlowError(router, "login", setFlow))
    }, [flowId, isReady, aal, refresh, returnTo, flow]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await submitLoginCredentials("123456", username, password);
            // const response = true;//await kratos.submitSelfServiceLoginFlow({
            // loginMethod: "password",
            // username,
            // password
            //   })

            // Handle successful response, like redirecting to dashboard
            console.log("Login successful:", response)
        } catch (err) {
            console.error("Login failed:", err)
            setError("Login failed. Please try again.")
        }
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="https://nextjs.org/icons/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />



                <div>
                    <h1>Custom Authentication</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>



                <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    <li className="mb-2">
                        Get started by editing{" "}
                        <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li>Save and see your changes instantly.</li>
                </ol>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <a
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className="dark:invert"
                            src="https://nextjs.org/icons/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        Deploy now
                    </a>
                    <a
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="https://nextjs.org/icons/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    )
}