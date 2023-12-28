import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {' '}
          <span className="text-danger">Opps!</span> Page not found.
        </p>
        <p className="lead mb-2">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link className="btn btn-primary d-inline-block" href="/dashboard">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
