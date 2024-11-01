// src/components/TopPage/PageLinks.tsx

import CreateButton from './create-button';
import SearchButton from './search-button';

interface Prop {
  playerName:string;
}

export default function RoomButton({playerName}:Prop) {
  return (
    <>
      <CreateButton playerName={playerName}/>
      <SearchButton />
    </>
  );
}
