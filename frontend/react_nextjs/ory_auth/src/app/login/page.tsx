"use client"

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ory from '../../lib/ory';
import { SelfServiceLoginFlow } from '@ory/client';

const LoginPage = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Create a login flow
    ory.createSelfServiceLoginFlowForBrowsers()
      .then(({ data }) => {
        setFlow(data);
      })
      .catch((err) => {
        console.error('Error creating login flow', err);
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!flow) return;

    try {
      const { data } = await ory.submitSelfServiceLoginFlow(flow.id, formData);
      router.push('/dashboard'); // Redirect on successful login
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  if (!flow) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {flow.ui.nodes.map((node) => (
        <div key={node.attributes.name}>
          <label>{node.meta?.label?.text}</label>
          <input
            {...node.attributes}
            type={node.attributes.type}
            name={node.attributes.name}
          />
        </div>
      ))}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
