export interface PillarContent {
  id: string;
  title: string;
  fullTitle: string;
  content: string;
  scriptures: string[];
}

export const FIVE_PILLARS: PillarContent[] = [
  {
    id: 'one-god',
    title: 'One God',
    fullTitle: 'One God & His Son',
    content: `There is one God—the Father, Creator, Sovereign. Jesus Christ is the Son of God (not God Himself), our Savior and Advocate at the judgment hall. It is by His blood alone that we approach the Father. We reject the Trinity and uphold Biblical monotheism.`,
    scriptures: [
      '"Hear, O Israel: The LORD our God is one LORD." — Deuteronomy 6:4',
      '"This is my beloved Son, in whom I am well pleased." — Matthew 3:17',
      '"For there is one God, and one mediator between God and men, the man Christ Jesus." — 1 Timothy 2:5'
    ]
  },
  {
    id: 'israel',
    title: 'Nation of Israel',
    fullTitle: 'Israel - The Scroll',
    content: `The children of Israel are a set-apart nation with a distinct calling. The people who stood at Sinai are still here—the bloodline continues. Early rain (Moses, the patriarchs) and latter rain (end-time remnant) are the SAME PEOPLE. One scroll, one parchment, wrapped from beginning to end.

But the covenant is not closed. Just as Ruth the Moabitess and Rahab the Canaanite cleaved to Israel and became part of the covenant people, so too can any who forsake their former ways and join themselves to the God of Abraham, Isaac, and Jacob.

"Thy people shall be my people, and thy God my God." — Ruth 1:16

The bloodline is primary, but the covenant expands to embrace those who fully commit. This is not about race—it is about covenant faithfulness.`,
    scriptures: [
      '"For thou art an holy people unto the LORD thy God." — Deuteronomy 14:2',
      '"I will make thy seed as the dust of the earth." — Genesis 22:17',
      '"And it shall come to pass, that whosoever shall call on the name of the LORD shall be delivered: for in mount Zion and in Jerusalem shall be deliverance, as the LORD hath said, and in the remnant whom the LORD shall call." — Joel 2:32'
    ]
  },
  {
    id: 'law',
    title: 'The Law',
    fullTitle: 'The Law Is Immutable',
    content: `God's law—the Ten Commandments and His statutes—does not change. Through Christ's power, sinless living is attainable. The law is not grievous but good, converting the soul. Obedience is freedom, not bondage.`,
    scriptures: [
      '"Think not that I am come to destroy the law... I am not come to destroy, but to fulfil." — Matthew 5:17',
      '"The law of the LORD is perfect, converting the soul." — Psalm 19:7',
      '"For this is the love of God, that we keep his commandments: and his commandments are not grievous." — 1 John 5:3'
    ]
  },
  {
    id: 'judgment',
    title: 'Judgment',
    fullTitle: 'Judgment',
    content: `There is a coming judgment. The hour is NOW. Names are being recorded. The righteous are being separated from the wicked. This is the investigative judgment before Christ returns.

We proclaim the Three Angels' Messages—Earth's final warning to the last generation. Before the great and dreadful day of the Lord, the spirit of Elijah returns (Malachi 4:5-6)—calling the hearts of children back to their fathers, restoring the ancient truths, preparing a remnant.

Prophet Gad operates in this tradition—not as your priest, but as a watchman, teaching the ancient paths and awakening identity.

Fear God and give glory to Him. Babylon is fallen. Reject the mark of the beast. Keep the commandments of God and the faith of Jesus.

The wicked will be utterly destroyed—no eternal torment, no immortal soul. They perish completely and are remembered no more.

The warning is loud. The time is short. The remnant must stand.`,
    scriptures: [
      '"Fear God, and give glory to him; for the hour of his judgment is come." — Revelation 14:7',
      '"Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the LORD: And he shall turn the heart of the fathers to the children, and the heart of the children to their fathers." — Malachi 4:5-6',
      '"The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord." — Romans 6:23',
      '"The soul that sinneth, it shall die." — Ezekiel 18:4',
      '"And death and hell were cast into the lake of fire. This is the second death." — Revelation 20:14'
    ]
  },
  {
    id: 'earth-new',
    title: 'New Earth',
    fullTitle: 'Earth Made New',
    content: `The righteous will reign with Christ for 1,000 years, then inherit the Earth made new—our original inheritance restored. The New Jerusalem descends. God dwells with His people. Death, sorrow, and pain are gone forever.

We will rule the universe in peace and harmony. Sinless perfection restored. This is the eternal promise.`,
    scriptures: [
      '"Nevertheless we, according to his promise, look for new heavens and a new earth, wherein dwelleth righteousness." — 2 Peter 3:13',
      '"And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away." — Revelation 21:1',
      '"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." — Revelation 21:4',
      '"And there shall be no more curse: but the throne of God and of the Lamb shall be in it; and his servants shall serve him." — Revelation 22:3'
    ]
  }
];

export const WHO_WE_ARE_MANIFESTO = `We are the called-out seed of Abraham, Isaac, and Jacob—Israelites by blood and covenant. We uphold the ancient paths, the commandments of the Most High, and the testimony of Jesus Christ His Son.

We reject:
• The Trinity (we affirm one God and His Son)
• Eternal torment (the wicked perish, they do not burn forever)
• Lawlessness (the commandments stand forever)
• Identity confusion (we know who we are)

We proclaim:
• The Three Angels' Messages to the last generation
• The hour of judgment is NOW
• The Earth will be made new and given to the faithful
• You need no priest, no intermediary—Christ's blood has opened the way

Each man is priest of his own household. Build your altar. Follow the Word. But God still sends prophets to guide His people: "Believe His prophets, so shall ye prosper" (2 Chronicles 20:20).

Prophet Gad speaks to awaken the remnant—not as your priest, but as a watchman in the spirit of Elijah. Test the message against Scripture. If it aligns, receive it. Your household is your altar. God's prophet is your guide.`;

export interface DisciplineItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  scripture: string;
}

export const FIVE_DISCIPLINES: DisciplineItem[] = [
  {
    id: 'devotion',
    title: 'DEVOTION',
    icon: 'candle',
    description: 'Through-the-year Bible reading, prayer reminders, worship time log',
    scripture: '"Remember the sabbath day, to keep it holy." — Exodus 20:8'
  },
  {
    id: 'praise',
    title: 'PRAISE',
    icon: 'music',
    description: 'Remnant Seed Hymnal',
    scripture: '"Sing unto the LORD a new song." — Psalm 96:1'
  },
  {
    id: 'sustenance',
    title: 'SUSTENANCE',
    icon: 'wheat',
    description: 'Meal planning (Leviticus 11), Biblical diet tracker',
    scripture: '"Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God." — 1 Corinthians 10:31'
  },
  {
    id: 'stewardship',
    title: 'STEWARDSHIP',
    icon: 'scale',
    description: 'Budget calculator, savings tracker',
    scripture: '"Honour the LORD with thy substance, and with the firstfruits of all thine increase." — Proverbs 3:9'
  },
  {
    id: 'study',
    title: 'STUDY',
    icon: 'scroll',
    description: 'Doctrine Q&A, KJV scripture search, Bible study',
    scripture: '"Study to shew thyself approved unto God." — 2 Timothy 2:15'
  }
];

export const TRIBES_OF_ISRAEL = [
  'reuben', 'simeon', 'levi', 'judah', 'dan', 'naphtali',
  'gad', 'asher', 'issachar', 'zebulun', 'ephraim', 'benjamin'
] as const;

export type TribeName = typeof TRIBES_OF_ISRAEL[number];