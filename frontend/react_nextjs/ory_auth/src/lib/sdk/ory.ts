import { Configuration, FrontendApi } from "@ory/client"

const basePath = process.env.NEXT_PUBLIC_ORY_SDK_URL;

const ory = new FrontendApi(
  new Configuration({
    basePath: basePath,
    baseOptions: {
      withCredentials: true,
    },
  })
);
export default ory;

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