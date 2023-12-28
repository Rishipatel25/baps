import Image from 'next/image';
import logo from '@/assets/images/svg/feedback-logo.svg';

export const metadata = {
  title: 'VTMS | Feedback',
  description: 'Baps',
};

const FeedbackLayout = ({ children }) => {
  return (
    <>
      <div className="bg-primary text-white pt-3 pb-3 d-flex align-items-center">
        <Image src={logo} width="100" height="50" alt="logo" />

        <h5>Feedback</h5>
      </div>
      {children}
    </>
  );
};

export default FeedbackLayout;
