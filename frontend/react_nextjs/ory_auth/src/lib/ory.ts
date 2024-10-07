import { OAuth2Api, Configuration } from '@ory/client';

const ory = new OAuth2Api(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
    baseOptions: {
      withCredentials: true, // Important for session handling
    },
  })
);

const loginFlow = ory.initializeSelfServiceLoginFlowForBrowsers();

export default ory;
