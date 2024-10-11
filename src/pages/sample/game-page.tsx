export async function getServerSideProps({ query }: any) {
  const { roomId }: { roomId: string | null } = query;

  try {
    if (!roomId) {
      throw new Error('ルームが存在しません。');
    }
    const res = await fetch(
      `http://localhost:3000/api/make-room?roomId=${roomId}`
    );
    if (!res.ok) {
      throw new Error('ルームが存在しません。');
    }
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/sample/make-room', // リダイレクト先のパス
        permanent: false, // permanent: true の場合、ステータスコード 308 でリダイレクト。false だと307。
      },
    };
  }
  return {
    props: {
      roomId,
    },
  };
}

const GamePage = ({ roomId }: { roomId: string | null }) => {
  return (
    <div>
      <h1>ルームID：{roomId}</h1>
    </div>
  );
};

export default GamePage;
