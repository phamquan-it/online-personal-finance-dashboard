'use client'

import React from 'react'
import {
    Layout,
    Card,
    Typography,
    Table,
    Input,
    Button,
    Space,
    Popconfirm,
    Form,
    message,
    Dropdown,
    InputNumber,
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import {
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoriesQuery,
} from '@/libs/redux/services/categoriesApi'
import { useTranslations, useLocale } from 'next-intl'

const { Content } = Layout
const { Title } = Typography

const ExpenseCategoriesPage = () => {
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const t = useTranslations('ExpenseCategoriesPage')
    const locale = useLocale()

    const { data: categories = [], isFetching } = useGetCategoriesQuery()
    const [addCategory, { isLoading: adding }] = useAddCategoryMutation()
    const [deleteCategory] = useDeleteCategoryMutation()
    const [messageApi, contextHolder] = message.useMessage()

    const handleAdd = async (values: { name: string; description: string; }) => {
        try {
            await addCategory(values).unwrap()
            messageApi.success(t('addCategorySuccess'))
            form.resetFields()
        } catch (err) {
            messageApi.error(t('addCategoryError'))
        }
    }

    const handleDelete = async (key: string) => {
        try {
            await deleteCategory(key).unwrap()
            messageApi.success(t('deleteCategorySuccess'))
        } catch (err) {
            messageApi.error(t('deleteCategoryError'))
        }
    }

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD', // Replace with your currency if needed
        }).format(value)

    const columns = [
        {
            title: t('categoryName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('categoryDescription'),
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: t('categoryAmount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (value: number) => formatCurrency(value),
        },
        {
            title: t('actions'),
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Popconfirm
                        title={t('deleteConfirm')}
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                    <Dropdown
                        trigger={['click']}
                        dropdownRender={() => (
                            <Card title={t('editTitle')} classNames={{ title: '!text-center' }}>
                                <Form
                                    form={editForm}
                                    layout="vertical"
                                    initialValues={{
                                        name: record.name,
                                        description: record.description,
                                    }}
                                    onFinish={(values) => {
                                        console.log('Edit values:', values)
                                        // handleUpdate(record.key, values)
                                    }}
                                >
                                    <Form.Item
                                        label={t('categoryName')}
                                        name="name"
                                        rules={[{ required: true, message: t('addCategoryError') }]}
                                    >
                                        <Input placeholder={t('placeholderName')} />
                                    </Form.Item>

                                    <Form.Item
                                        label={t('categoryDescription')}
                                        name="description"
                                    >
                                        <Input placeholder={t('placeholderDescription')} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" size="small">
                                            {t('saveButton')}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        )}
                        placement="topRight"
                    >
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ]

    return (
        <Content style={{ padding: 24 }}>
            {contextHolder}
            <Title level={2}>
                {t('title')} ({locale})
            </Title>

            <Card title={t('addCategoryTitle')} style={{ marginBottom: 24 }}>
                <Form layout="inline" form={form} onFinish={handleAdd}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: t('addCategoryError') }]}
                    >
                        <Input placeholder={t('placeholderName')} />
                    </Form.Item>
                    <Form.Item name="description">
                        <Input placeholder={t('placeholderDescription')} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            loading={adding}
                        >
                            {t('addButton')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title={t('existingCategoriesTitle')}>
                <Table
                    rowKey="key"
                    loading={isFetching}
                    dataSource={categories}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </Content>
    )
}

export default ExpenseCategoriesPage

