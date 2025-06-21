import { CallCard } from './CallCard';
import type { Call } from './types';

interface CallsListProps {
  calls: Call[];
}

export const CallsList = ({ calls }: CallsListProps) => {
  return (
    <div>
      {calls.map((call) => (
        <CallCard key={call.id} call={call} />
      ))}
    </div>
  );
};
