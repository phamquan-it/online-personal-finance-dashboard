'use client';

import React from 'react';
import { Layout, Typography, Card, message } from 'antd';
import { useTranslations, useLocale } from 'next-intl';
import {
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
    useUpdateExpenseCategoryMutation,
} from '@/libs/redux/services/categoriesApi';

import AddCategoryForm from '@/components/categories/AddCategoryForm';
import CategoryTable from '@/components/categories/CategoryTable';

const { Content } = Layout;
const { Title } = Typography;

const ExpenseCategoriesPage = () => {
    const t = useTranslations('ExpenseCategoriesPage');
    const locale = useLocale();
    const [messageApi, contextHolder] = message.useMessage();

    const { data: categories = [], isFetching } = useGetCategoriesQuery();
    const [addCategory, { isLoading: adding }] = useAddCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateExpenseCategoryMutation();

    const handleAdd = async (values: { name: string; description: string }) => {
        try {
            await addCategory(values).unwrap();
            messageApi.success('Added category successfully.');
        } catch {
            messageApi.error('Failed to add category.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id).unwrap();
            messageApi.success('Deleted category successfully.');
        } catch {
            messageApi.error('Failed to delete category.');
        }
    };

    const handleUpdate = async (id: number, values: { name: string; description: string }) => {
        try {
            await updateCategory({ id, ...values }).unwrap();
            messageApi.success('Updated category successfully.');
        } catch {
            messageApi.error('Failed to update category.');
        }
    };

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>{t('title')} ({locale})</Title>

            <Card title={t('addCategoryTitle')} style={{ marginBottom: 24 }}>
                <AddCategoryForm onAdd={handleAdd} loading={adding} />
            </Card>

            <Card title={t('existingCategoriesTitle')}>
                <CategoryTable
                    data={categories}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    updating={updating}
                />
            </Card>
        </Content>
    );
};

export default ExpenseCategoriesPage;

