import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/services/api';
import type { CustomerRegisterRequest, CustomerLoginRequest, CustomerLoginResponse } from '@/types';

interface CustomerAuthContextType {
    customer: CustomerLoginResponse | null;
    customerToken: string | null;
    isCustomerAuthenticated: boolean;
    isLoading: boolean;
    customerLogin: (data: CustomerLoginRequest) => Promise<void>;
    customerRegister: (data: CustomerRegisterRequest) => Promise<void>;
    customerLogout: () => void;
}

export const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<CustomerLoginResponse | null>(null);
    const [customerToken, setCustomerToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('customer_token');
        const storedUser = localStorage.getItem('customer_user');
        if (storedToken && storedUser) {
            setCustomerToken(storedToken);
            setCustomer(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const customerLogin = useCallback(async (data: CustomerLoginRequest) => {
        const response = await authApi.login(data);
        localStorage.setItem('customer_token', response.token);
        localStorage.setItem('customer_user', JSON.stringify(response));
        setCustomerToken(response.token);
        setCustomer(response);
    }, []);

    const customerRegister = useCallback(async (data: CustomerRegisterRequest) => {
        const response = await authApi.register(data);
        localStorage.setItem('customer_token', response.token);
        localStorage.setItem('customer_user', JSON.stringify(response));
        setCustomerToken(response.token);
        setCustomer(response);
    }, []);

    const customerLogout = useCallback(() => {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        setCustomerToken(null);
        setCustomer(null);
        window.location.href = '/account/login';
    }, []);

    return (
        <CustomerAuthContext.Provider
            value={{
                customer,
                customerToken,
                isCustomerAuthenticated: !!customerToken,
                isLoading,
                customerLogin,
                customerRegister,
                customerLogout,
            }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
}
