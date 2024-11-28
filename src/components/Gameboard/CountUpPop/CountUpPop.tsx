import React from 'react';
import styles from './CountUpPop.module.css';
import CountUp from 'react-countup';

interface Props {
  isCountUpPop: boolean;
  eventDetails: Event_Mold;
  isCountUpAnimation: boolean;
  beforeMoney: number[];
  moneys: number[];
  currentPlayer: number;
}

const CountUpPop = ({
  isCountUpPop,
  eventDetails,
  isCountUpAnimation,
  beforeMoney,
  moneys,
  currentPlayer,
}: Props) => {
  return (
    <div className={isCountUpPop ? styles.popUp : styles.noPopUp}>
      <div className={styles.countUpPop}>
        {eventDetails && (
          <h1>
            {isCountUpAnimation ? (
              <CountUp
                start={beforeMoney[currentPlayer]}
                end={moneys[currentPlayer]}
                duration={2}
              />
            ) : (
              beforeMoney[currentPlayer]
            )}
            万円
          </h1>
        )}
      </div>
    </div>
  );
};

export default CountUpPop;
