import React from 'react';
import styles from './ErrorMessage.module.css';

interface Props {
  isErrorAnimation: boolean;
  errorMessage: string;
}

const ErrorMessage = ({ isErrorAnimation, errorMessage }: Props) => {
  return (
    <div
      data-testid="error-container"
      className={
        isErrorAnimation ? styles.onErrorContainer : styles.offErrorContainer
      }
    >
      <h3 className={styles.message}>{errorMessage}</h3>
    </div>
  );
};

export default ErrorMessage;
