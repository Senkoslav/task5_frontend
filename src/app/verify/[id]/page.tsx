'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/services/api';
import Loader from '@/components/common/Loader';

interface VerifyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(id);
        
        if (response.data.success) {
          setSuccess(true);
        } else {
          setError('Verification failed. The link may be invalid or expired.');
        }
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      verifyEmail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <Loader text="Verifying your email" size="lg" />
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              {success ? (
                <>
                  <div className="text-success mb-3">
                    <i className="bi bi-check-circle" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="card-title text-success mb-3">Email Verified!</h2>
                  <p className="mb-4">
                    Your email has been successfully verified. You can now login to your account.
                  </p>
                  <Link href="/login" className="btn btn-primary">
                    Go to Login
                  </Link>
                </>
              ) : (
                <>
                  <div className="text-danger mb-3">
                    <i className="bi bi-x-circle" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="card-title text-danger mb-3">Verification Failed</h2>
                  <p className="mb-4">{error}</p>
                  <div className="d-grid gap-2">
                    <Link href="/login" className="btn btn-primary">
                      Go to Login
                    </Link>
                    <Link href="/register" className="btn btn-outline-secondary">
                      Register Again
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}