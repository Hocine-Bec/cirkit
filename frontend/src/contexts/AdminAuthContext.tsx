import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/services/api';
import type { AdminLoginRequest, AdminLoginResponse } from '@/types';

interface AdminAuthContextType {
    adminUser: AdminLoginResponse | null;
    adminToken: string | null;
    isAdminAuthenticated: boolean;
    isLoading: boolean;
    adminLogin: (data: AdminLoginRequest) => Promise<void>;
    adminLogout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [adminUser, setAdminUser] = useState<AdminLoginResponse | null>(null);
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');
        if (storedToken && storedUser) {
            setAdminToken(storedToken);
            setAdminUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const adminLogin = useCallback(async (data: AdminLoginRequest) => {
        const response = await authApi.adminLogin(data);
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response));
        setAdminToken(response.token);
        setAdminUser(response);
    }, []);

    const adminLogout = useCallback(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminToken(null);
        setAdminUser(null);
        window.location.href = '/admin/login';
    }, []);

    return (
        <AdminAuthContext.Provider
            value={{
                adminUser,
                adminToken,
                isAdminAuthenticated: !!adminToken,
                isLoading,
                adminLogin,
                adminLogout,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}
