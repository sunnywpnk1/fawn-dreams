import { useNavigate } from 'react-router-dom';
import { useBooth } from '../../context/BoothContext';
import type { FrameDesign } from '../../types';
import TemplateCard from './TemplateCard';

interface Props {
  frames: FrameDesign[];
}

export default function TemplateGallery({ frames }: Props) {
  const { setFrameId } = useBooth();
  const navigate = useNavigate();
  const use = (f: FrameDesign) => {
    setFrameId(f.id);
    navigate('/', { state: { frameSelected: f.id } });
    window.scrollTo({ top: 0 });
  };
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {frames.map((f, i) => (
        <TemplateCard key={f.id} frame={f} onUse={use} index={i} />
      ))}
    </div>
  );
}
