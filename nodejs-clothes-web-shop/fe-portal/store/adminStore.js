import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAdminStore = create(persist(
    (set) => ({
        isLoggedIn: false,
        adminInfo: null,
        setAdminLogin: (adminInfo) => set({ isLoggedIn: true, adminInfo: adminInfo }),
        setAdminLogout: () => set({ isLoggedIn: false, adminInfo: null })
    }),
    {
        name: 'admin-storage',
        storage: createJSONStorage(() => localStorage),
    }
));

export default useAdminStore;
