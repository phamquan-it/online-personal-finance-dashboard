'use client';

import {
  Card,
  Col,
  Row,
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const t = useTranslations('ProfilePage');
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>('/default-avatar.png'); // default avatar
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatar(url);
      message.success(t('avatarUpdateSuccess'));
    }
  };

  const handleSave = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Updated profile:', values);
      setLoading(false);
      message.success(t('profileUpdateSuccess'));
    }, 1000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>{t('title')}</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card title={t('avatarTitle')} variant="outlined">
            <div style={{ textAlign: 'center' }}>
              <Avatar size={128} src={avatar} />
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                  {t('uploadAvatarButton')}
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title={t('profileInfoTitle')} variant="outlined">
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
              }}
              onFinish={handleSave}
            >
              <Form.Item
                label={t('nameLabel')}
                name="name"
                rules={[{ required: true, message: t('errorRequiredName') }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t('emailLabel')}
                name="email"
                rules={[
                  { required: true, message: t('errorRequiredEmail') },
                  { type: 'email', message: t('errorInvalidEmail') },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={t('passwordLabel')}
                name="password"
              >
                <Input.Password placeholder={t('passwordPlaceholder')} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {t('saveButton')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;

