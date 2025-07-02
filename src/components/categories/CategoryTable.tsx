import React from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import EditCategoryDropdown from './EditCategoryDropdown';

const CategoryTable = ({
    data,
    onDelete,
    onUpdate,
    updating,
}: {
    data: Category[];
    onDelete: (id: string) => void;
    onUpdate: (id: number, values: { name: string; description: string }) => void;
    updating: boolean;
}) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_: any, record: Category) => (
                <Space>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => onDelete(`${record.id}`)}
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                    <EditCategoryDropdown
                        record={record}
                        onUpdate={onUpdate}
                        loading={updating}
                    />
                </Space>
            ),
        },
    ];

    return <Table rowKey="id" dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />;
};

export default CategoryTable;

