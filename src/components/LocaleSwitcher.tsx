'use client';

import React from 'react';
import { Select } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

// --- Flag Components: using emoji for a more attractive look --- 
const FlagEN = () => <span style={{ fontSize: 16 }}>🇺🇸</span>;
const FlagDE = () => (
    <svg width="16" height="16" viewBox="0 0 5 3">
        <rect width="5" height="1" y="0" fill="#000" />
        <rect width="5" height="1" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
);
const FlagVI = () => (
    <svg width="16" height="16" viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#da251d" />
        <polygon
            points="1.5,0.5 1.7,1 2.3,1 1.8,1.3 2,1.8 1.5,1.5 1,1.8 1.2,1.3 0.7,1 1.3,1"
            fill="#ffcd00"
        />
    </svg>
);
const FlagZH = () => (
    <svg width="16" height="16" viewBox="0 0 30 20">
        <rect width="30" height="20" fill="#de2910" />
        <polygon
            fill="#ffde00"
            points="5,3 6,6 9,6 6.5,8 7.5,11 5,9 2.5,11 3.5,8 1,6 4,6"
        />
    </svg>
);
// Hindi flag using emoji for a clean look
const FlagHI = () => <span style={{ fontSize: 16 }}>🇮🇳</span>;

const LocaleSwitcher: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname() || '/';

    // Assume that pathname starts with "/<locale>/..."
    const segments = pathname.split('/'); // e.g. ['', 'en', ...]
    const currentLocale = segments[1] || 'en';

    // Switch locale while preserving the rest of the pathname.
    const switchLocale = (locale: string) => {
        const remainder = segments.slice(2).join('/');
        router.push(`/${locale}${remainder ? '/' + remainder : ''}`);
    };

    // Configure options for the Select component with flag icons and labels
    const options = [
        {
            value: 'en',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagEN />
                    <span style={{ marginLeft: 4 }}>En</span>
                </span>
            ),
        },
        {
            value: 'de',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagDE />
                    <span style={{ marginLeft: 4 }}>De</span>
                </span>
            ),
        },
        {
            value: 'vi',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagVI />
                    <span style={{ marginLeft: 4 }}>Vi</span>
                </span>
            ),
        },
        {
            value: 'zh',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagZH />
                    <span style={{ marginLeft: 4 }}>中文</span>
                </span>
            ),
        },
        {
            value: 'hi',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FlagHI />
                    <span style={{ marginLeft: 4 }}>हिंदी</span>
                </span>
            ),
        },
    ];

    return (
        <Select
            variant="borderless"
            value={currentLocale}
            suffixIcon={null}
            style={{ width: 90 }}
            onChange={(val) => switchLocale(val)}
            options={options}
        />
    );
};

export default LocaleSwitcher;

