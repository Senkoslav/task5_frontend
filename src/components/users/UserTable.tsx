'use client';

import { useUserStore } from '@/store/userStore';
import { User } from '@/store/authStore';
import Loader from '@/components/common/Loader';

export default function UserTable() {
  const { 
    users, 
    selectedUsers, 
    loading, 
    toggleUserSelection, 
    selectAllUsers, 
    deselectAllUsers 
  } = useUserStore();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectAllUsers();
    } else {
      deselectAllUsers();
    }
  };

  const handleUserSelect = (userId: number) => {
    toggleUserSelection(userId);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: User['status']) => {
    const statusClasses = {
      UNVERIFIED: 'badge status-badge status-unverified',
      ACTIVE: 'badge status-badge status-active',
      BLOCKED: 'badge status-badge status-blocked',
    };

    return (
      <span className={statusClasses[status]}>
        {status.toLowerCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader text="Loading users" />
      </div>
    );
  }

  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: '50px' }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                title={isAllSelected ? 'Deselect all' : 'Select all'}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Registration Time</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-muted">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                  />
                </td>
                <td className="fw-medium">{user.name}</td>
                <td>{user.email}</td>
                <td className="text-muted">
                  {formatDate(user.lastLogin)}
                </td>
                <td>
                  {getStatusBadge(user.status)}
                </td>
                <td className="text-muted">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
