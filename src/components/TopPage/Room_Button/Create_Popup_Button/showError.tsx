import React from 'react';
import styles from './showError.module.css';

interface ShowErrorProps {
  message: string;
  onClose: () => void;
}

const ShowError: React.FC<ShowErrorProps> = ({ message, onClose }) => {
  return (
    <div className={styles.content}>
      <div>
        <p>
          {message}
          <br />
          <button onClick={onClose}>閉じる</button>
        </p>
      </div>
    </div>
  );
};

export default ShowError;
