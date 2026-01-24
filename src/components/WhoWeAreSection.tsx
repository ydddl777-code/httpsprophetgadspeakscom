import { WHO_WE_ARE_MANIFESTO } from '@/lib/pillarContent';

export const WhoWeAreSection = () => {
  // Split the manifesto into parts for different styling
  const parts = WHO_WE_ARE_MANIFESTO.split('\n\n');
  const firstParagraph = parts[0];
  const rejectSection = parts[1] + '\n' + parts[2] + '\n' + parts[3] + '\n' + parts[4];
  const proclaimSection = parts[5] + '\n' + parts[6] + '\n' + parts[7] + '\n' + parts[8] + '\n' + parts[9];
  const closingParagraphs = parts.slice(10).join('\n\n');

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Top header with purple glass style */}
      <div 
        className="text-center py-3 px-6 mb-6 rounded border border-accent mx-auto w-fit"
        style={{
          background: 'rgba(88, 28, 135, 0.85)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground drop-shadow-text">
          WHO WE ARE
        </h2>
      </div>
      
      {/* Gold tint background container */}
      <div 
        className="p-6 md:p-8 rounded-lg border border-accent"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(184, 134, 11, 0.2) 50%, rgba(212, 175, 55, 0.15) 100%)',
          backdropFilter: 'blur(2px)'
        }}
      >
        {/* First paragraph - 14pt */}
        <p 
          className="text-foreground leading-relaxed drop-shadow-text mb-6"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '14pt',
            textAlign: 'justify'
          }}
        >
          {firstParagraph}
        </p>

        {/* We reject section - 14pt for bullets */}
        <div className="mb-6">
          <p 
            className="text-foreground font-bold mb-2"
            style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '14pt'
            }}
          >
            We reject:
          </p>
          <ul 
            className="text-foreground leading-relaxed drop-shadow-text pl-4"
            style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '14pt'
            }}
          >
            <li>• The Trinity (we affirm one God and His Son)</li>
            <li>• Eternal torment (the wicked perish, they do not burn forever)</li>
            <li>• Lawlessness (the commandments stand forever)</li>
            <li>• Identity confusion (we know who we are)</li>
          </ul>
        </div>

        {/* We proclaim section - 14pt for bullets */}
        <div className="mb-6">
          <p 
            className="text-foreground font-bold mb-2"
            style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '14pt'
            }}
          >
            We proclaim:
          </p>
          <ul 
            className="text-foreground leading-relaxed drop-shadow-text pl-4"
            style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '14pt'
            }}
          >
            <li>• The Three Angels' Messages to the last generation</li>
            <li>• The hour of judgment is NOW</li>
            <li>• The Earth will be made new and given to the faithful</li>
            <li>• You need no priest, no intermediary—Christ's blood has opened the way</li>
          </ul>
        </div>

        {/* Closing paragraphs - 12pt bold, justified */}
        <p 
          className="text-foreground leading-relaxed drop-shadow-text mb-4"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12pt',
            fontWeight: 'bold',
            textAlign: 'justify'
          }}
        >
          Each man is priest of his own household. Build your altar. Follow the Word. But God still sends prophets to guide His people: "Believe His prophets, so shall ye prosper" (2 Chronicles 20:20).
        </p>

        <p 
          className="text-foreground leading-relaxed drop-shadow-text"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '12pt',
            fontWeight: 'bold',
            textAlign: 'justify'
          }}
        >
          Prophet Gad speaks to awaken the remnant—not as your priest, but as a watchman in the spirit of Elijah. Test the message against Scripture. If it aligns, receive it. Your household is your altar. God's prophet is your guide.
        </p>
      </div>

      {/* Bottom header with purple glass style - duplicated from top */}
      <div 
        className="text-center py-3 px-6 mt-6 rounded border border-accent mx-auto w-fit"
        style={{
          background: 'rgba(88, 28, 135, 0.85)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground drop-shadow-text">
          WHO WE ARE
        </h2>
      </div>
    </section>
  );
};
