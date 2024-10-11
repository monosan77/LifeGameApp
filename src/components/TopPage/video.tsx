import styles from './video.module.css';


const Video = () => {
  return (
    <div className={styles.video}>
      <video autoPlay loop muted>
        <source src="/life_of_game.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
