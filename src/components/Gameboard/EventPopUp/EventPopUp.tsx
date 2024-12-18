import React from 'react';
import styles from './EventPopUp.module.css';
import Image from 'next/image';
import { Members } from '@/types/session';
import { Event_Mold } from '@/types/game';

interface Props {
  isEventPop: boolean;
  eventDetails: Event_Mold;
  member: Members[];
  currentPlayer: number;
  yourInfo: Members;
  eventIgnition: () => void;
}

const EventPopUp = ({
  isEventPop,
  eventDetails,
  member,
  currentPlayer,
  yourInfo,
  eventIgnition,
}: Props) => {
  return (
    <div className={isEventPop ? styles.popUp : styles.noPopUp}>
      <div
        className={eventDetails ? styles[eventDetails.event.event_type] : ''}
      >
        <h1 className={styles.title}>{eventDetails?.event.title}</h1>
        <div className={styles.image}>
          <Image
            src={`/game/event/${eventDetails?.event.src}`}
            alt="イベント画像"
            fill
            sizes="(max-width: 768px) 100%, 300px"
          />
        </div>
        <p className={styles.text}>{eventDetails?.event.overview}</p>
        <button
          style={
            member[currentPlayer].id === yourInfo.id
              ? { display: 'block' }
              : { display: 'none' }
          }
          className={styles.button}
          onClick={eventIgnition}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default EventPopUp;
