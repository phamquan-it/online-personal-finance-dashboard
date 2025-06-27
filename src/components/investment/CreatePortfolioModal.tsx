import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import CreatePortfolioForm from './CreatePortfolioForm';

const CreatePortfolioModal = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        + New Portfolio
      </Button>

      <Modal
        title="Create Investment Portfolio"
        open={open}
        onCancel={handleClose}
        footer={null}
        destroyOnClose
      >
        <CreatePortfolioForm onSuccess={handleClose} />
      </Modal>
    </>
  );
};

export default CreatePortfolioModal;

