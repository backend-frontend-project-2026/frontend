import { Modal, Button, Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface MatchedModalProps {
  open: boolean;
  myName: string;
  myAvatar: string;
  matchedName: string;
  matchedAvatar: string;
  matchedUserId: string;
  onWrite: () => void;
  onContinue: () => void;
}

export const MatchedModal = ({
  open,
  myName,
  myAvatar,
  matchedName,
  matchedAvatar,
  onWrite,
  onContinue,
}: MatchedModalProps) => (
  <Modal open={open} footer={null} closable={false} centered width={360}>
    <div style={{ textAlign: 'center' }}>
      <Title level={2}>💘 Это мэтч!</Title>
      <Text>Вы и {matchedName} понравились друг другу</Text>
      <Space size={24} style={{ marginTop: 24, marginBottom: 24 }}>
        <div>
          <img src={myAvatar || '/default-avatar.png'} alt={myName} style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div>{myName}</div>
        </div>
        <div style={{ fontSize: 32 }}>❤️</div>
        <div>
          <img src={matchedAvatar || '/default-avatar.png'} alt={matchedName} style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div>{matchedName}</div>
        </div>
      </Space>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button type="primary" block onClick={onWrite}>
          Написать
        </Button>
        <Button block onClick={onContinue}>
          Продолжить
        </Button>
      </Space>
    </div>
  </Modal>
);