import { TRIBES_OF_ISRAEL, TribeName } from '@/lib/pillarContent';

// Import all tribal banner images
import reubenImg from '@/assets/tribes/reuben.jpeg';
import simeonImg from '@/assets/tribes/simeon.jpeg';
import leviImg from '@/assets/tribes/levi.jpeg';
import judahImg from '@/assets/tribes/judah.jpeg';
import danImg from '@/assets/tribes/dan.jpeg';
import naphtaliImg from '@/assets/tribes/naphtali.jpeg';
import gadImg from '@/assets/tribes/gad.jpeg';
import asherImg from '@/assets/tribes/asher.jpeg';
import issacharImg from '@/assets/tribes/issachar.jpeg';
import zebulunImg from '@/assets/tribes/zebulun.jpeg';
import josephImg from '@/assets/tribes/joseph.jpeg';
import benjaminImg from '@/assets/tribes/benjamin.jpeg';

const tribeImages: Record<TribeName, string> = {
  reuben: reubenImg,
  simeon: simeonImg,
  levi: leviImg,
  judah: judahImg,
  dan: danImg,
  naphtali: naphtaliImg,
  gad: gadImg,
  asher: asherImg,
  issachar: issacharImg,
  zebulun: zebulunImg,
  ephraim: josephImg,
  benjamin: benjaminImg,
};

const tribeLabels: Record<TribeName, string> = {
  reuben: 'Reuben',
  simeon: 'Simeon',
  levi: 'Levi',
  judah: 'Judah',
  dan: 'Dan',
  naphtali: 'Naphtali',
  gad: 'Gad',
  asher: 'Asher',
  issachar: 'Issachar',
  zebulun: 'Zebulun',
  ephraim: 'Joseph',
  benjamin: 'Benjamin',
};

interface TribalBannersProps {
  side: 'left' | 'right';
}

// Height variations for visual interest (in pixels)
const heightVariations = [48, 52, 44, 56, 46, 50];

export const TribalBanners = ({ side }: TribalBannersProps) => {
  // First 6 tribes on left, last 6 on right
  const tribes = side === 'left' 
    ? TRIBES_OF_ISRAEL.slice(0, 6) 
    : TRIBES_OF_ISRAEL.slice(6);

  return (
    <div className="flex flex-col gap-2 py-4">
      {tribes.map((tribe, index) => (
        <div
          key={tribe}
          className="tribal-banner flex flex-col items-center"
          title={tribeLabels[tribe]}
        >
          <img
            src={tribeImages[tribe]}
            alt={`Tribe of ${tribeLabels[tribe]}`}
            className="object-contain rounded-sm"
            style={{ 
              width: `${heightVariations[index]}px`,
              height: `${heightVariations[index]}px`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          {/* Tribe name with purple glass style and gold rim */}
          <span 
            className="text-[8px] font-bold text-primary-foreground mt-0.5 px-1 py-0.5 rounded border border-accent"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {tribeLabels[tribe]}
          </span>
        </div>
      ))}
    </div>
  );
};