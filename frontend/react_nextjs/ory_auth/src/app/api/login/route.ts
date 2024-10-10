import { NextRequest, NextResponse } from "next/server";

// In your Next.js API route (e.g., /pages/api/login.js)
async function initiateLoginFlow() {
    const response = await fetch(`${process.env.ORY_SDK_URL}/self-service/login/api`, {
        method: 'GET',
        credentials: 'include' // Include cookies if required
    });

    if (!response.ok) {
        throw new Error('Failed to initiate login flow');
    }

    const loginFlow = await response.json()
    console.log(loginFlow);
    return loginFlow.id; // You need this flow ID for the next step
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { identifier, password } = body;

    try {
        console.log(`getting flow...`);
        const flowId = await initiateLoginFlow() // Initiate login flow
        console.log(`flow id: ${flowId}`);
        const response = await fetch(`${process.env.ORY_SDK_URL}/self-service/login?flow=${flowId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: identifier,
                password: password,
                method: 'password',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.log(`Error when handle post request: ${error}`);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
