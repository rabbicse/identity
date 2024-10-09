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