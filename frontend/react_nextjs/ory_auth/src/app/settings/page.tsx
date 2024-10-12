import ory from "@/lib/sdk/ory";
import { SettingsFlow } from "@ory/client";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

const Settings = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => setFlow(data))
        .catch((err) => console.error(err))
      return
    }

    ory
      .createBrowserSettingsFlow({ returnTo: String(returnTo || "") })
      .then(({ data }) => setFlow(data))
      .catch((err) => console.error(err))
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
          })
          .then(({ data }) => {
            setFlow(data)
            if (data.return_to) {
              window.location.href = data.return_to
            }
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 400) {
              setFlow(err.response?.data)
              return
            }
            console.error(err)
          }),
      )

  return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        {/* Custom TOTP Management Section */}
        {flow && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Manage 2FA TOTP</h2>
            <p className="text-gray-600 mb-4">
              Use a TOTP Authenticator App to secure your account. Popular apps
              include Google Authenticator and LastPass.
            </p>
            
            {/* Display QR Code */}
            {flow.ui.nodes
              .filter((node) => node.group === "totp")
              .map((node) => {
                const qrCodeUri = node.attributes?.value || ""
                return (
                  <div key={node.attributes.name}>
                    {qrCodeUri && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold">
                          Scan this QR Code with your TOTP app:
                        </h3>
                        <QRCode value={qrCodeUri} size={200} />
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Messages */}
            <Messages messages={flow.ui.messages} />

            {/* Custom Form for TOTP */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const values: UpdateSettingsFlowBody = Object.fromEntries(
                  formData.entries(),
                )
                onSubmit(values)
              }}
              className="space-y-4"
            >
              {/* Input Field for TOTP Code */}
              {flow.ui.nodes
                .filter((node) => node.group === "totp")
                .map((node) => (
                  <div key={node.attributes.name}>
                    <label htmlFor={node.attributes.name} className="block text-sm font-medium text-gray-700">
                      {node.meta.label?.text}
                    </label>
                    <input
                      id={node.attributes.name}
                      name={node.attributes.name}
                      type={node.attributes.type}
                      placeholder={node.meta.label?.text}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save TOTP Settings
              </button>
            </form>
          </div>
        )}
      </div>
  )
}

export default Settings
