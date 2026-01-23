import judah from '@/assets/tribes/judah.jpeg';
import reuben from '@/assets/tribes/reuben.jpeg';
import naphtali from '@/assets/tribes/naphtali.jpeg';
import asher from '@/assets/tribes/asher.jpeg';
import simeon from '@/assets/tribes/simeon.jpeg';
import issachar from '@/assets/tribes/issachar.jpeg';
import gad from '@/assets/tribes/gad.jpeg';
import benjamin from '@/assets/tribes/benjamin.jpeg';
import dan from '@/assets/tribes/dan.jpeg';
import zebulun from '@/assets/tribes/zebulun.jpeg';
import levi from '@/assets/tribes/levi.jpeg';
import ephraim from '@/assets/tribes/ephraim.png';

const tribes = [
  { name: 'Judah', image: judah },
  { name: 'Reuben', image: reuben },
  { name: 'Gad', image: gad },
  { name: 'Asher', image: asher },
  { name: 'Naphtali', image: naphtali },
  { name: 'Manasseh', image: ephraim }, // Using ephraim for now
  { name: 'Simeon', image: simeon },
  { name: 'Levi', image: levi },
  { name: 'Issachar', image: issachar },
  { name: 'Zebulun', image: zebulun },
  { name: 'Benjamin', image: benjamin },
  { name: 'Dan', image: dan },
];

export const TribesBorder = () => {
  // Left side: first 6 tribes (top to bottom)
  const leftTribes = tribes.slice(0, 6);
  // Right side: last 6 tribes (top to bottom)
  const rightTribes = tribes.slice(6, 12);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Left column */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 flex flex-col justify-evenly py-4">
        {leftTribes.map((tribe) => (
          <div
            key={tribe.name}
            className="relative w-14 h-14 md:w-18 md:h-18 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-yellow-500/50"
          >
            <img
              src={tribe.image}
              alt={tribe.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Right column */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 flex flex-col justify-evenly py-4">
        {rightTribes.map((tribe) => (
          <div
            key={tribe.name}
            className="relative w-14 h-14 md:w-18 md:h-18 mx-auto rounded-lg overflow-hidden shadow-lg border-2 border-yellow-500/50"
          >
            <img
              src={tribe.image}
              alt={tribe.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
