'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { userAPI } from '@/services/api';
import UserTable from '@/components/users/UserTable';
import Toolbar from '@/components/users/Toolbar';
import Navbar from '@/components/layout/Navbar';
import Loader from '@/components/common/Loader';
import { useToast } from '@/components/ui/ToastContainer';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { setUsers, setLoading } = useUserStore();
  const { showSuccess, showError } = useToast();
  const [isHydrated, setIsHydrated] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      showError(error.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [setUsers, setLoading, showError]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadUsers();
  }, [isAuthenticated, router, loadUsers, isHydrated]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Loader text="Loading" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 mb-0">User Management</h1>
              <span className="text-muted">Welcome, {user?.name}</span>
            </div>

            <div className="table-container">
              <Toolbar 
                onSuccess={showSuccess} 
                onError={showError} 
                onRefresh={loadUsers} 
              />
              <UserTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}