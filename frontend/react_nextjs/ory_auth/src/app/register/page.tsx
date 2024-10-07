import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ory from '../../lib/ory';
import { SelfServiceRegistrationFlow } from '@ory/client';

const RegisterPage = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Create a registration flow
    ory.createSelfServiceRegistrationFlowForBrowsers()
      .then(({ data }) => {
        setFlow(data);
      })
      .catch((err) => {
        console.error('Error creating registration flow', err);
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!flow) return;

    try {
      const { data } = await ory.submitSelfServiceRegistrationFlow(flow.id, formData);
      router.push('/login'); // Redirect to login after registration
    } catch (err) {
      console.error('Registration failed', err);
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
