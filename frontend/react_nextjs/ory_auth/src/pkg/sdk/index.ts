import { Configuration, FrontendApi } from "@ory/client"

const localConfig = {
  basePath: "127.0.0.1:4455",//process.env.NEXT_PUBLIC_ORY_SDK_URL,
  baseOptions: {
    withCredentials: true,
  },
}

export default new FrontendApi(
  new Configuration(
    localConfig
  ),
)
