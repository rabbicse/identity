'use client'

import Link from 'next/link';
import { Form } from '@/components/form';
import { SubmitButton } from '@/components/submit-button';
import { useEffect, useState } from 'react';

async function initiateLoginFlow() {
  const response = await fetch('http://localhost:4433/self-service/login/api', {
    method: 'GET',
    credentials: 'include' // Include cookies if required
  })

  if (!response.ok) {
    throw new Error('Failed to initiate login flow')
  }

  const loginFlow = await response.json()
  console.log(loginFlow);
  return loginFlow.id // You need this flow ID for the next step
}


async function submitLoginCredentials(flowId: string, username: string, password: string) {
  const response = await fetch(`http://localhost:4433/self-service/login?flow=${flowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies if required
    body: JSON.stringify({
      // csrf_token: "kv+5OVQefOxfwflSHmipeyNQ5aJE7+vu6/5NQEtGp6coeReJ8VTAiQc6SVrHDdTFW7mr/foGIeQNs2HzA1fZ+Q==",
      method: 'password', // Specify the login method, in this case "password"
      identifier: username, // Username or email identifier
      password: password, // The password
    }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  const loginResult = await response.json()
  return loginResult
}

async function login(username: string, password: string) {
  try {
    const flowId = await initiateLoginFlow()
    const loginResult = await submitLoginCredentials(flowId, username, password)
    console.log('Login successful:', loginResult)
    // You can redirect the user to a protected page or store session information here
  } catch (error) {
    console.error('Login error:', error)
    // Handle login error, show user feedback, etc.
  }
}



export default function LoginPage() {
  // const [flow, setFlow] = useState(null);
  // const [formData, setFormData] = useState({ email: '', password: '' });
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Simulate router.isReady when searchParams become available
  //   const flowData = initiateLoginFlow();
  //   setFlow(flowData.);
  // }, []);



  // initiateLoginFlow().then((response) => {
  //   console.log(response);
  //   setFlow(response.id)
  // }).catch((err) => {
  //   console.log('Error when connect to initial login flow...');
  //   console.log(err);
  // });




  // useEffect(() => {
  //   // Fetch the login flow
  //   const fetchLoginFlow = async () => {
  //     if (flow) return;
  //     try {
  //       const response = await fetch('http://localhost:4433/self-service/login/api', {
  //         method: 'GET',
  //         credentials: 'include', // Ensures cookies are included, if needed for sessions
  //       });
  //       const data = await response.json();
  //       setFlow(data.id);
  //       // console.log(data.id);
  //       return;
  //     } catch (err) {
  //       console.log('Error fetching login flow');
  //       console.log(err);
  //     }
  //   };

  //   fetchLoginFlow();
  // }, [flow]);

  // console.log(flow);

  // {"csrf_token":"kv+5OVQefOxfwflSHmipeyNQ5aJE7+vu6/5NQEtGp6coeReJ8VTAiQc6SVrHDdTFW7mr/foGIeQNs2HzA1fZ+Q==","identifier":"mehmet@ory.com","password":"ory123456","method":"password"}


  const [username, setUsername] = useState('mehmet@ory.com')
  const [password, setPassword] = useState('Ory@123456')
  const [error, setError] = useState<string | null>(null)

  // const handleSubmit = async () => {
  //   // e.preventDefault()

  //   try {
  //     const flowId = await initiateLoginFlow() // Initiate login flow
  //     const loginResult = await submitLoginCredentials(flowId, username, password) // Submit credentials
  //     console.log('Login successful:', loginResult)
  //     // Handle successful login, redirect, or store session info
  //   } catch (err) {
  //     setError('Login failed. Please try again.')
  //     console.error('Login error:', err)
  //   }
  // }


  const submitLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'meh@ory.com',
        password: 'Ory@123456',
      //   csrf_token,
        method: 'password',
      }),
    });
  
    const data = await response.json();
    console.log(data);
  };
  



  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        {/* <Form
          action={async (formData: FormData) => {
            // TODO:
          }}
        > */}


        <Form action={submitLogin}>
          <SubmitButton>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {' for free.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
