import { create } from 'zustand';
import { User } from './authStore';

interface UserState {
  users: User[];
  selectedUsers: number[];
  loading: boolean;
  setUsers: (users: User[]) => void;
  setSelectedUsers: (userIds: number[]) => void;
  toggleUserSelection: (userId: number) => void;
  selectAllUsers: () => void;
  deselectAllUsers: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUsers: [],
  loading: false,
  setUsers: (users) => set({ users }),
  setSelectedUsers: (userIds) => set({ selectedUsers: userIds }),
  toggleUserSelection: (userId) => {
    const { selectedUsers } = get();
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      set({ selectedUsers: selectedUsers.filter(id => id !== userId) });
    } else {
      set({ selectedUsers: [...selectedUsers, userId] });
    }
  },
  selectAllUsers: () => {
    const { users } = get();
    set({ selectedUsers: users.map(user => user.id) });
  },
  deselectAllUsers: () => set({ selectedUsers: [] }),
  setLoading: (loading) => set({ loading }),
}));