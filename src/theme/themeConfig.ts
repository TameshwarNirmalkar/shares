import { type ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
    // algorithm: theme.darkAlgorithm,
    token: {
        fontSize: 14,
        colorPrimary: '#1e293b',
        colorPrimaryBorder: '#1e293b',
        colorBgContainer: '#18181b',
        colorText: "#cbd5e1",
        // colorTextHeading: '#cbd5e1',  // --------- global component heading title color
        colorTextDescription: '#cbd5e1', // ----------- global description color
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
        colorWarningBorder: '#ca8a04',
        colorErrorBg: '#b91c1c',
        colorErrorBorder: '#b91c1c',
        colorIcon: '#cbd5e1',
        colorSplit: ' #cbd5e1',
        colorBgMask: '#d8ebff61',
        colorTextQuaternary: '#e2e8f0', // --------- dropdown default text color,
        colorTextPlaceholder: '#e4e4e7'
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
            darkItemSelectedBg: '#64748b',
            // darkItemSelectedColor: 'rgb(250 204 21)'
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
        },
        DatePicker: {
            // activeBorderColor: '#f59e0b',
            // activeBg: '#f59e0b',
            cellHoverBg: '#f59e0b',
            cellActiveWithRangeBg: '#f59e0b',
            cellHoverWithRangeBg: '#f59e0b',
        },
        Select: {
            selectorBg: '#334155',
            optionActiveBg: '#64748b',
            optionSelectedBg: '#64748b',
            optionSelectedColor: '#e2e8f0'
        }


    },

};

export default themeConfig;