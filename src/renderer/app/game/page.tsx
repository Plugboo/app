import { useParams } from 'react-router'

export default function GamePage() {
  const params = useParams();
  const gameId = params.id;

  return <main>
    <p>{gameId}</p>
  </main>
}