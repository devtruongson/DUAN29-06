import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useCustomerStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            customerInfor: null,
            setCustomerLogin: (customerInfor) => set({ isLoggedIn: true, customerInfor: customerInfor }),
            refreshAccessToken: ({ accessToken, accessTokenExpires }) => set((state) => ({
                customerInfor: {
                    ...state.customerInfor,
                    accessToken,
                    accessTokenExpires
                }
            })),
            setCustomerLogout: () => set({ isLoggedIn: false, customerInfor: null })
        }),
        {
            name: 'customer-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useCustomerStore;
