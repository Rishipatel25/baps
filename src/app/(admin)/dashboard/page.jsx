import DashboardProgressIcon from '@/assets/images/icons/dashboard-progress-icon.png';
import PageProgressIcon from '@/components/page-progress';

// Set metadata
export const metadata = {
  title: 'VTMS | Dashboard',
};

const Dashboard = () => {
  return (
    <>
      <div className="p-30">
        <h5 className="can p-2 font-weight-bold">Dashboard</h5>
        <PageProgressIcon
          icon={DashboardProgressIcon}
          title="Work in Progress"
          description="Exciting things are brewing! Stay tuned for updates"
        />
      </div>
    </>
  );
};

export default Dashboard;
