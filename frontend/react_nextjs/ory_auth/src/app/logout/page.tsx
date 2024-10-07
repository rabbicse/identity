import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ory from '@/lib/ory';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    ory.createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        router.push(data.logout_url);
      })
      .catch((err) => {
        console.error('Error logging out', err);
      });
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
