// src/components/TopPage/PageLinks.tsx

import CreateButton from './create-button';
import SearchButton from './search-button';

interface PlayedNameProps{
  playerName:string;
}

export default function RoomButton({playerName}:PlayedNameProps) {
  return (
    <>
      <CreateButton />
      <SearchButton playerName={playerName} />
    </>
  );
}
