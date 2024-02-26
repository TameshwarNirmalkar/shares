import { type ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
    // algorithm: theme.darkAlgorithm,
    token: {
        fontSize: 14,
        colorPrimary: '#1e293b',
        colorPrimaryBorder: '#1e293b',
        colorBgContainer: '#18181b',
        colorText: "#cbd5e1",
        borderRadius: 4,
        colorBgElevated: '#18181b',
        controlItemBgHover: '#64748b',
        colorBorder: "#64748b",
        colorTextDisabled: "#64748b",
        boxShadowTertiary: 'none',
        colorInfoBg: "#0ea5e9",
        colorInfoBorder: '#0ea5e9',
        colorSuccessBg: '#22c55e',
        colorSuccessBorder: '#16a34a',
        colorWarningBg: '#eab308',
        colorWarningBorder: '#ca8a04'
    },
    components: {
        Button: {
            primaryShadow: 'none',
            boxShadow: 'none',
            dangerShadow: 'none',
            colorBorder: 'none'
        },
        Layout: {
            bodyBg: '#1e293b',
            triggerBg: '#64748b',
            // siderBg: '#64748b',
            headerPadding: "0px 5px"
        },
        Menu: {
            darkItemHoverBg: '#64748b',
            darkItemSelectedBg: '#64748b'
        },
        Table: {
            headerBg: '#64748b',
            borderColor: '#64748b',
            footerBg: '#64748b'
        },
        Pagination: {
            itemBg: '#18181b',
            itemActiveBg: '#64748b',
        },
        Input: {
            activeBorderColor: '#64748b',
            activeShadow: 'none'
        },
        Card: {
            colorBorder: '#64748b',
            borderRadius: 50,
            actionsBg: '#1e293b'
        }


    },

};

export default themeConfig;