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
    };
    return (
        <form onSubmit={onSubmit}>
            {error && <div className="text-red-500">{error}</div>}

            <div  className="grid gap-4">
                <Image src={totpNode?.attributes.src}
                    alt="TOTP QR Code"
                    style={{ width: '200px', height: '200px' }}
                    width={200}
                    height={200} />
                <p>This is your authenticator app secret. Use it if you can not scan the QR code. { totpSecret }</p>

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