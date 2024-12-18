import Image from 'next/image';
import React from 'react';
import styles from './Square.module.css';

const PLAYER_ICON = [
  '/game/icon/car-icon1.png',
  '/game/icon/car-icon2.png',
  '/game/icon/car-icon3.png',
  '/game/icon/car-icon4.png',
  '/game/icon/car-icon5.png',
];

interface Props {
  playerPositions: number[];
  squareNumber: number;
  isReserved: boolean;
}
const Square = ({ playerPositions, squareNumber, isReserved }: Props) => {
  return (
    <>
      {playerPositions.map(
        (position, index) =>
          position === squareNumber && (
            <div key={index} className={styles.carIcon}>
              <Image
                className={
                  isReserved === true
                    ? styles.reservedCarImage
                    : styles.carImage
                }
                src={PLAYER_ICON[index]}
                width={80}
                height={80}
                alt="アイコン"
              />
            </div>
          )
      )}
    </>
  );
};

export default Square;
