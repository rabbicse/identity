import { Configuration, FrontendApi } from "@ory/client"

const localConfig = {
  basePath: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
  baseOptions: {
    withCredentials: true,
  },
}

export default new FrontendApi(
  new Configuration(
    localConfig
  ),
)
