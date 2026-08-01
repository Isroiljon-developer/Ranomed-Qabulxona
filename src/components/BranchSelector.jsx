import { MapPin } from 'lucide-react';
import { useReception } from '../context/ReceptionContext';

export default function BranchSelector() {
  const { branches, currentBranch, setCurrentBranch } = useReception();

  return (
    <div className="branch-selector">
      <MapPin className="w-4 h-4 text-primary" />
      {branches.map((branch) => (
        <button
          key={branch.id}
          onClick={() => setCurrentBranch(branch.id)}
          className={`branch-btn ${currentBranch === branch.id ? 'active' : ''}`}
        >
          {branch.name}
        </button>
      ))}
    </div>
  );
}
