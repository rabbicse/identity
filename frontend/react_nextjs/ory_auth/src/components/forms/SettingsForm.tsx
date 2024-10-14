"use client"

import ory from "@/lib/sdk/ory";
import { SettingsFlow } from "@ory/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SettingsForm = () => {
    const [flow, setFlow] = useState<SettingsFlow>()
    const [returnTo, setReturnTo] = useState<SettingsFlow>();
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
    const [totp, setTotp] = useState<string>('');
    const [totpSecret, setTotpSecret] = useState('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter()
    // const { flow: flowId, return_to: returnTo } = useSearchParams["flow"], useSearchParams["return_to"]

    useEffect(() => {
        if (flow) {
            return
        }

        const getSettings = () => {
            ory
                .createBrowserSettingsFlow({ returnTo: String(returnTo || "") })
                .then(({ data }) => {
                    setFlow(data);
                    console.log(`Flow: ${JSON.stringify(data)}`);

                    // Retrieve the CSRF token from the flow response
                    const csrfNode = data.ui.nodes.find(node => node.attributes.name === 'csrf_token');
                    if (csrfNode) {
                        setCsrfToken(csrfNode.attributes.value as string);
                    }

                    const totpSecretNode = data?.ui.nodes.find(node => node.attributes.text?.context?.secret);
                    setTotpSecret(totpSecretNode ? totpSecretNode.attributes.text.context.secret : '');
                })
                .catch((err) => console.error(err))
        };

        getSettings();

    }, [flow]);

    const totpNode = flow?.ui.nodes.find((node) => node.group === 'totp' && node.type === 'img');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        ory
            .updateSettingsFlow({
                flow: String(flow?.id),
                updateSettingsFlowBody: {
                    csrf_token: csrfToken,
                    method: "totp",
                    totp_code: totp
                }
            })
            .then(async ({ data }) => {
                // If we ended up here, it means we are successfully signed up!
                //
                // You can do cool stuff here, like having access to the identity which just signed up:
                console.log("This is the user session: ", data, data?.identity)

                // continue_with is a list of actions that the user might need to take before the registration is complete.
                // It could, for example, contain a link to the verification form.
                if (data.continue_with) {
                    for (const item of data.continue_with) {
                        switch (item.action) {
                            case "show_verification_ui":
                                await router.push("/verification?flow=" + item.flow.id)
                                return
                        }
                    }
                }

                // If continue_with did not contain anything, we can just return to the home page.
                await router.push(flow?.return_to || "/")
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
            });
    };
    return (
        <form onSubmit={onSubmit}>
            {error && <div className="text-red-500">{error}</div>}

            <div className="grid gap-4">
                <Image src={totpNode?.attributes.src}
                    alt="TOTP QR Code"
                    style={{ width: '200px', height: '200px' }}
                    width={200}
                    height={200} />
                <p>This is your authenticator app secret. Use it if you can not scan the QR code. {totpSecret}</p>

                <div className="grid gap-2">
                    <Label htmlFor="totp">Verify code *</Label>
                    <Input
                        id="totp"
                        type="text"
                        placeholder="TOTP"
                        value={totp}
                        onChange={(e) => setTotp(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Verify
                </Button>
            </div>
        </form>
    );
};

export default SettingsForm;