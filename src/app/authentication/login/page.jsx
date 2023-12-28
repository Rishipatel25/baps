'use client';

import Image from 'next/image';
import CustomButton from '@/components/Button';
import logoDark from '@/assets/images/svg/feedback-logo-dark.svg';

function Login() {
  const sso_url = process.env.NEXT_PUBLIC_LOGIN_SSO_URL;
  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_key = process.env.NEXT_PUBLIC_CLIENT_KEY;
  const client_uri = process.env.NEXT_PUBLIC_SSO_CALLBACK_URL;

  return (
    <>
      <div className="d-flex flex-column gap-3 justify-content-center align-items-centre h-100 login-wrapper">
        <div className="vtms-logo">
          <Image
            src={logoDark}
            height={'500px'}
            width={'500px'}
            alt="Akshardham-logo"
          />
        </div>
        <div className="login-card">
          <div className="login-title-text">
            <h4 className="fw-bolder">Visitor Tour Management System</h4>
            <p className="fw-normal">
              Please login with the credentials you use for mySeva App,
              mySamarpan App, or Satsang Diksha Rajipo App.
            </p>
            <p className="text-danger">
              If you do not have BAPS SSO account, please contact the Volunteer
              Coordinator, Network Admin or Yuvak/Yuvati coordinator in your
              center.
            </p>
            {/* This is used for login button please don't remove this */}
            <form action={sso_url} method="post" className="login-form">
              <input type="hidden" name="client_id" value={client_id} />
              <input type="hidden" name="client_key" value={client_key} />
              <input type="hidden" name="client_uri" value={client_uri} />

              <div className="btn-login">
                <CustomButton type="submit">Login with BAPS SSO</CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
