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

async function initiateLoginFlow() {
  const response = await fetch('http://localhost:4433/self-service/login/api', {
    method: 'GET',
    credentials: 'include', // Ensures cookies are included, if needed for sessions
  })

  if (!response.ok) {
    throw new Error('Failed to initiate login flow')
  }

  const flowData = await response.json();
  console.log(flowData);
  return flowData // Contains the flow ID and other important data
}