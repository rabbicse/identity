import { NextRequest, NextResponse } from "next/server";

// In your Next.js API route (e.g., /pages/api/login.js)
async function initiateLoginFlow() {
    const response = await fetch('http://localhost:4433/self-service/login/api', {
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
        const flowId = await initiateLoginFlow() // Initiate login flow
        const response = await fetch(`http://localhost:4433/self-service/login?flow=${flowId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: identifier,//'meh@ory.com',
                password: password,//'Ory@123456',
                // csrf_token: '123456',
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
        // return res.status(200).json(data);
    } catch (error) {
        console.log(`Error when handle post request: ${error}`);
        // return res.status(500).json({ error: 'Internal server error' });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
