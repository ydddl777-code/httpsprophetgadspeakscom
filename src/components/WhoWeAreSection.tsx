import { WHO_WE_ARE_MANIFESTO } from '@/lib/pillarContent';

export const WhoWeAreSection = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-center text-xl md:text-2xl font-bold gold-text drop-shadow-text mb-6">
        WHO WE ARE
      </h2>
      
      <div className="parchment-bg p-6 md:p-8">
        <div className="text-foreground leading-relaxed whitespace-pre-line drop-shadow-text">
          {WHO_WE_ARE_MANIFESTO}
        </div>
      </div>
    </section>
  );
};