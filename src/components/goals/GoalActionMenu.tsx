'use client'

import React from 'react'
import { Dropdown, Button } from 'antd'
import {
    EllipsisOutlined,
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons'

interface Props {
    onEdit: () => void
    onAddSaving: () => void
    onDelete: () => void
}

const GoalActionMenu: React.FC<Props> = ({ onEdit, onAddSaving, onDelete }) => {
    const items = [
        {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: onEdit,
        },
        {
            key: 'addSaving',
            label: 'Add Saving',
            icon: <PlusOutlined />,
            onClick: onAddSaving,
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: onDelete,
        },
    ]

    return (
        <Dropdown
            menu={{ items }}
            placement="bottomRight"
            trigger={['click']}
        >
            <Button icon={<EllipsisOutlined />} />
        </Dropdown>
    )
}

export default GoalActionMenu

