import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/apiClient';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (data) => {
    const user = await api.createUser(data);
    setUsers((prev) => [user, ...prev]);
    return user;
  };

  const removeUser = async (id) => {
    await api.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, loading, error, refetch: fetchUsers, addUser, removeUser };
}
