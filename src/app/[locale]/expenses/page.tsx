'use client';

import React from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateExpenseCategoryMutation, // ✅ add this
} from '@/libs/redux/services/categoriesApi';
import { useTranslations, useLocale } from 'next-intl';
import { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title } = Typography;

const ExpenseCategoriesPage = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const t = useTranslations('ExpenseCategoriesPage');
  const locale = useLocale();

  const { data: categories = [], isFetching } = useGetCategoriesQuery();
  const [addCategory, { isLoading: adding }] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateExpenseCategoryMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAdd = async (values: { name: string; description: string }) => {
    try {
      await addCategory(values).unwrap();
      messageApi.success('Added category successfully.');
      form.resetFields();
    } catch (err) {
      messageApi.error('Failed to add category.');
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteCategory(key).unwrap();
      messageApi.success('Deleted category successfully.');
    } catch (err) {
      messageApi.error('Failed to delete category.');
    }
  };

  const handleUpdate = async (id: number, values: { name: string; description: string }) => {
    try {
      await updateCategory({ id, ...values }).unwrap();
      messageApi.success('Updated category successfully.');
      editForm.resetFields();
    } catch (err) {
      messageApi.error('Failed to update category.');
    }
  };

  const columns: ColumnsType<Category> = [
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
      title: t('actions'),
      key: 'action',
      render: (_: Category, record) => (
        <Space>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(`${record.id}`)}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
          <Dropdown
            trigger={['click']}
            dropdownRender={() => (
              <Card title="Edit Category" classNames={{ title: '!text-center' }}>
                <Form
                  form={editForm}
                  layout="vertical"
                  initialValues={{
                    name: record.name,
                    description: record.description,
                  }}
                  onFinish={(values) => {
                    handleUpdate(record.id?? -1, values);
                  }}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Name is required.' }]}
                  >
                    <Input placeholder="Enter name" />
                  </Form.Item>
                  <Form.Item label="Description" name="description">
                    <Input placeholder="Enter description" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="small"
                      loading={updating}
                    >
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}
            placement="topRight"
          >
            <Button icon={<EditOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

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
            rules={[{ required: true, message: 'Name is required.' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="description">
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={adding}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={t('existingCategoriesTitle')}>
        <Table
          rowKey="id"
          loading={isFetching}
          dataSource={categories}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </Content>
  );
};

export default ExpenseCategoriesPage;

