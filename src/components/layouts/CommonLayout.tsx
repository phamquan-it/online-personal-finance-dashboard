'use client';

import React, { ReactNode, useState } from 'react';
import { Layout, Menu, Avatar, Button, Dropdown, Card, Form, Input, Select } from 'antd';
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    UnorderedListOutlined,
    PieChartOutlined,
    FlagOutlined,
    DollarCircleOutlined,
    BarChartOutlined,
    BellOutlined,
    BookOutlined,
    ColumnHeightOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from '@/i18n/navigation';
import NavigationLink from '../NavigationLink';
import { Path } from '@/enums/path';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../LocaleSwitcher';
import IncomeForm from '../incomes/IncomeForm';
import IncomeChart from '../incomes/IncomeChart';
import IncomeTable from '../incomes/IncomeTable';

const { Header, Sider, Content } = Layout;

interface CommonLayoutProps {
    children: ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const t = useTranslations('CommonLayout');
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            // Xóa token
            localStorage.removeItem('token');
            // Chuyển về login page (hoặc Path.LOGIN nếu bạn có constant)
            router.push('/login');
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <NavigationLink href="/profile">{t('userMenu.profile')}</NavigationLink>,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: t('userMenu.logout'),
        },
    ];

    const menuItems = [
        {
            key: Path.HOME,
            icon: <HomeOutlined />,
            label: <NavigationLink href={Path.HOME}>{t('menu.home')}</NavigationLink>,
        },
        {
            key: Path.EXPENSE_LIST,
            icon: <UnorderedListOutlined />,
            label: <NavigationLink href={Path.EXPENSE_LIST}>{t('menu.expenses')}</NavigationLink>,
        },
        {
            key: Path.BUDGET_OVERVIEW,
            icon: <PieChartOutlined />,
            label: <NavigationLink href={Path.BUDGET_OVERVIEW}>{t('menu.budgets')}</NavigationLink>,
        },
        {
            key: Path.GOALS_OVERVIEW,
            icon: <FlagOutlined />,
            label: <NavigationLink href={Path.GOALS_OVERVIEW}>{t('menu.goals')}</NavigationLink>,
        },
        {
            key: Path.INVESTMENT_PORTFOLIO,
            icon: <DollarCircleOutlined />,
            label: <NavigationLink href={Path.INVESTMENT_PORTFOLIO}>{t('menu.investments')}</NavigationLink>,
        },
        {
            key: Path.DEBT_OVERVIEW,
            icon: <BarChartOutlined />,
            label: <NavigationLink href={Path.DEBT_OVERVIEW}>{t('menu.debts')}</NavigationLink>,
        },
        {
            key: Path.FINANCIAL_REPORTS,
            icon: <BarChartOutlined />,
            label: <NavigationLink href={Path.FINANCIAL_REPORTS}>{t('menu.reports')}</NavigationLink>,
        },
        {
            key: Path.NOTIFICATIONS,
            icon: <BellOutlined />,
            label: <NavigationLink href={Path.NOTIFICATIONS}>{t('menu.notifications')}</NavigationLink>,
        },
        {
            key: Path.EDUCATION_HUB,
            icon: <BookOutlined />,
            label: <NavigationLink href={Path.EDUCATION_HUB}>{t('menu.education')}</NavigationLink>,
        },
    ];
    function formatShortNumber(num: number): string {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num.toString();
    }
    const [totalIncome, setTotalIncome] = useState(7000); // ví dụ
    const [lastDepositDate, setLastDepositDate] = useState('2024-06-22'); // ví dụ
    const [isInComeOpen, setIsInComeOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('Add Income');
    return (
        <Layout className="!h-screen">
            <Sider className="border-r border-gray-200" id="sider-income"
                trigger={<div className="border-r border-gray-200 !relative">
                    {!collapsed && <Dropdown
                        placement="topLeft"
                        trigger={["click"]}
                        open={isInComeOpen}
                        dropdownRender={() => (
                            <Card style={{
                                minWidth: 530,
                                minHeight: 420
                            }}
                                title={
                                    <Select
                                        className="!w-48"
                                        value={selectedOption}
                                        onChange={setSelectedOption}
                                        options={[
                                            { value: 'Add Income', label: 'Add Income' },
                                            { value: 'Analysis', label: 'Analysis' },
                                            { value: 'Table', label: 'Income Table' },
                                        ]}
                                    />
                                }
                                extra={
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={() => setIsInComeOpen(false)}
                                    />
                                }
                            >
                                {selectedOption === 'Add Income' && <IncomeForm />}
                                {selectedOption === 'Analysis' && <IncomeChart />}
                                {selectedOption === 'Table' && <IncomeTable />}
                            </Card>
                        )}
                    >
                        <Button onClick={() => setIsInComeOpen(!isInComeOpen)}>
                            Total income: ${totalIncome}
                        </Button>
                    </Dropdown>}

                </div>}
                collapsed={collapsed}
                collapsible
                theme="light"
                breakpoint="sm"
            >
                <div className="text-center font-bold text-lg py-4">
                    {collapsed ? '💰' : t('appName')}
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    className="!border-none"
                    selectedKeys={[pathname as string]}
                    items={menuItems}
                />

            </Sider>

            <Layout>
                <Header
                    style={{
                        background: 'white',
                        padding: '0 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    className="border-b border-gray-200"
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <div className="flex gap-2 items-center">
                        <LocaleSwitcher />
                        <Dropdown
                            menu={{ items: userMenuItems, onClick: handleMenuClick }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </Dropdown>
                    </div>
                </Header>

                <Content style={{ background: '#fff', overflowY: 'auto' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default CommonLayout;

