"use client";

import { AxiosError } from "axios"
import { LoginFlow, Configuration, FrontendApi, UpdateLoginFlowBody } from "@ory/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NextRouter } from "next/router";

const basePath = process.env.NEXT_PUBLIC_ORY_SDK_URL;

const ory = new FrontendApi(
    new Configuration({
        basePath: basePath,
        baseOptions: {
            withCredentials: true,
        },
    })
);





const CustomLoginForm = ({ flow, onSubmit }: { flow: LoginFlow, onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) => {
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




// Error handler for login flows
export const handleFlowError = (
    flowType: string,
    setFlow: any
) => async (error: AxiosError) => {
    const router = useRouter();

    // If the flow ID was invalid, redirect back to the login page
    if (error.response?.status === 404 || error.response?.status === 410) {
        await router.push(`/login`)
        return
    }
    // Handle other errors (e.g., form validation)
    console.error(`Error in ${flowType} flow:`, error)
    setFlow(undefined)
}

// Error handler for fetching flow
export const handleGetFlowError = (
    flowType: string,
    setFlow: any
) => async (error: AxiosError) => {
    const router = useRouter();
    if (error.response?.status === 404 || error.response?.status === 410) {
        await router.push(`/login`)
        return
    }
    console.error(`Error fetching ${flowType} flow:`, error)
}








const SelfLoginPage: NextPage = () => {
    const router = useRouter()
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
        if (!isReady || flow) return

        // If a flow ID is present, fetch the flow from Ory Kratos
        if (flowId) {
            ory
                .getLoginFlow({ id: String(flowId) })
                .then(({ data }) => setFlow(data))
                .catch(handleGetFlowError("login", setFlow))
            return
        }

        // Otherwise, create a new login flow
        ory
            .createBrowserLoginFlow({
                refresh: Boolean(refresh),
                aal: aal ? String(aal) : undefined,
                returnTo: returnTo ? String(returnTo) : undefined,
            })
            .then(({ data }) => setFlow(data))
            .catch(handleFlowError("login", setFlow))
    }, [flowId, isReady, aal, refresh, returnTo, flow])

    // Handle form submission
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const values = Object.fromEntries(formData.entries()) as UpdateLoginFlowBody

        ory
            .updateLoginFlow({
                flow: String(flow?.id),
                updateLoginFlowBody: values,
            })
            .then(() => {
                if (flow?.return_to) {
                    window.location.href = flow.return_to
                    return
                }
                router.push("/")
            })
            .catch(handleFlowError("login", setFlow))
    }

    return (
        <>
            <div className="login-container">
                <h1>Login</h1>
                {flow ? (
                    <CustomLoginForm flow={flow} onSubmit={onSubmit} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    )
}

export default SelfLoginPage