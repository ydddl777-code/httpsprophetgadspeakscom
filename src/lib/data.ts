import { DailyVerse, DoctrineQuestion, AgeGroup } from './types';

// Daily verses categorized by age group appropriateness
export const DAILY_VERSES: Record<AgeGroup, DailyVerse[]> = {
  child: [
    {
      reference: 'Ephesians 6:1',
      text: 'Children, obey your parents in the Lord: for this is right.',
      book: 'Ephesians',
      chapter: 6,
      verse: 1,
    },
    {
      reference: 'Proverbs 20:11',
      text: 'Even a child is known by his doings, whether his work be pure, and whether it be right.',
      book: 'Proverbs',
      chapter: 20,
      verse: 11,
    },
    {
      reference: 'Psalm 119:9',
      text: 'Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word.',
      book: 'Psalms',
      chapter: 119,
      verse: 9,
    },
    {
      reference: 'Proverbs 22:6',
      text: 'Train up a child in the way he should go: and when he is old, he will not depart from it.',
      book: 'Proverbs',
      chapter: 22,
      verse: 6,
    },
  ],
  teen: [
    {
      reference: 'Ecclesiastes 12:1',
      text: 'Remember now thy Creator in the days of thy youth, while the evil days come not.',
      book: 'Ecclesiastes',
      chapter: 12,
      verse: 1,
    },
    {
      reference: '1 Timothy 4:12',
      text: 'Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.',
      book: '1 Timothy',
      chapter: 4,
      verse: 12,
    },
    {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
      book: 'Proverbs',
      chapter: 3,
      verse: 5,
    },
  ],
  parent: [
    {
      reference: 'Deuteronomy 6:7',
      text: 'And thou shalt teach them diligently unto thy children, and shalt talk of them when thou sittest in thine house, and when thou walkest by the way.',
      book: 'Deuteronomy',
      chapter: 6,
      verse: 7,
    },
    {
      reference: 'Proverbs 22:7',
      text: 'The rich ruleth over the poor, and the borrower is servant to the lender.',
      book: 'Proverbs',
      chapter: 22,
      verse: 7,
    },
    {
      reference: 'Proverbs 31:27',
      text: 'She looketh well to the ways of her household, and eateth not the bread of idleness.',
      book: 'Proverbs',
      chapter: 31,
      verse: 27,
    },
  ],
  elder: [
    {
      reference: 'Psalm 92:14',
      text: 'They shall still bring forth fruit in old age; they shall be fat and flourishing.',
      book: 'Psalms',
      chapter: 92,
      verse: 14,
    },
    {
      reference: 'Proverbs 16:31',
      text: 'The hoary head is a crown of glory, if it be found in the way of righteousness.',
      book: 'Proverbs',
      chapter: 16,
      verse: 31,
    },
    {
      reference: 'Titus 2:2',
      text: 'That the aged men be sober, grave, temperate, sound in faith, in charity, in patience.',
      book: 'Titus',
      chapter: 2,
      verse: 2,
    },
  ],
};

// Clean/Unclean foods database
export const CLEAN_FOODS = [
  'chicken', 'beef', 'lamb', 'goat', 'deer', 'venison', 'turkey', 'duck', 'goose',
  'salmon', 'tuna', 'cod', 'bass', 'trout', 'tilapia', 'halibut', 'sardines', 'herring',
  'locust', 'grasshopper', 'cricket',
];

export const UNCLEAN_FOODS = [
  'pork', 'pig', 'ham', 'bacon', 'sausage',
  'shrimp', 'crab', 'lobster', 'clam', 'oyster', 'mussel', 'scallop', 'squid', 'octopus',
  'catfish', 'eel', 'shark',
  'rabbit', 'hare', 'camel', 'horse',
  'eagle', 'owl', 'vulture', 'raven', 'crow', 'bat',
  'snake', 'lizard', 'mouse', 'rat',
];

// Red-flag artists for music checker
export const RED_FLAG_ARTISTS = [
  'hillsong', 'hillsong united', 'hillsong worship', 'hillsong young & free',
  'bethel', 'bethel music', 'bethel worship',
  'elevation', 'elevation worship',
  'jesus culture',
  'planetshakers',
  'kari jobe',
  'chris tomlin',
];

// Doctrine Q&A database
export const DOCTRINE_QUESTIONS: DoctrineQuestion[] = [
  {
    id: '1',
    question: 'Why keep the Sabbath?',
    answer: 'The Sabbath is the fourth commandment, a sign between the Most High and His people forever. It was established at creation and remains binding for all who follow the Creator.',
    verse: 'Exodus 20:8-10',
    verseText: 'Remember the sabbath day, to keep it holy. Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the LORD thy God.',
    ageGroups: ['child', 'teen', 'parent', 'elder'],
  },
  {
    id: '2',
    question: 'Why no pork?',
    answer: 'The Creator declared the pig unclean in Leviticus 11. The swine does not chew the cud, making it an abomination to eat. This law was never abolished.',
    verse: 'Leviticus 11:7-8',
    verseText: 'And the swine, though he divide the hoof, and be clovenfooted, yet he cheweth not the cud; he is unclean to you.',
    ageGroups: ['child', 'teen', 'parent', 'elder'],
  },
  {
    id: '3',
    question: 'Why not celebrate Christmas?',
    answer: 'Christmas has pagan origins rooted in sun worship. The Bible warns against learning the way of the heathen and adopting their customs to worship the Most High.',
    verse: 'Jeremiah 10:2-4',
    verseText: 'Thus saith the LORD, Learn not the way of the heathen... For the customs of the people are vain.',
    ageGroups: ['teen', 'parent', 'elder'],
  },
  {
    id: '4',
    question: 'My child is lying, what do I do?',
    answer: 'Address lying immediately with love and correction. Teach that lying is an abomination to the Most High. Use consistent discipline and model truthfulness.',
    verse: 'Proverbs 12:22',
    verseText: 'Lying lips are abomination to the LORD: but they that deal truly are his delight.',
    practicalTip: 'Have a calm conversation about why they felt they needed to lie. Focus on building trust and explain the consequences of dishonesty.',
    ageGroups: ['parent', 'elder'],
  },
  {
    id: '5',
    question: 'Why keep the feast days?',
    answer: 'The feast days (Passover, Unleavened Bread, Pentecost, Trumpets, Atonement, Tabernacles) are commanded forever. They prophesy of the Messiah and His return.',
    verse: 'Leviticus 23:2',
    verseText: 'Speak unto the children of Israel, and say unto them, Concerning the feasts of the LORD, which ye shall proclaim to be holy convocations, even these are my feasts.',
    ageGroups: ['teen', 'parent', 'elder'],
  },
  {
    id: '6',
    question: 'My teenager wants to date. What should I do?',
    answer: 'Biblical courtship differs from modern dating. Focus on building godly character first. Parents should be involved in the process to protect their children.',
    verse: 'Proverbs 18:22',
    verseText: 'Whoso findeth a wife findeth a good thing, and obtaineth favour of the LORD.',
    practicalTip: 'Set clear boundaries and have open conversations about purity. Ensure any potential spouse shares your faith and values.',
    ageGroups: ['parent', 'elder'],
  },
  {
    id: '7',
    question: 'Why is the Sabbath on Saturday?',
    answer: 'The seventh day Sabbath has always been from Friday sunset to Saturday sunset. Sunday worship was introduced by Rome, not Scripture.',
    verse: 'Genesis 2:2-3',
    verseText: 'And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.',
    ageGroups: ['child', 'teen', 'parent', 'elder'],
  },
  {
    id: '8',
    question: 'How do I explain our beliefs to others?',
    answer: 'Speak with gentleness and respect. Let your life be a testimony. Focus on Scripture rather than arguments. Plant seeds and let the Most High give the increase.',
    verse: '1 Peter 3:15',
    verseText: 'But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear.',
    ageGroups: ['teen', 'parent', 'elder'],
  },
  {
    id: '9',
    question: 'What is the true name of the Creator?',
    answer: 'The Creator revealed His name as YHWH (Yahweh/Yahuah). This name appears over 6,800 times in the Hebrew Scriptures. We should use His name with reverence.',
    verse: 'Exodus 3:14-15',
    verseText: 'And God said unto Moses, I AM THAT I AM... this is my name for ever, and this is my memorial unto all generations.',
    ageGroups: ['teen', 'parent', 'elder'],
  },
  {
    id: '10',
    question: 'Why do we eat only clean foods?',
    answer: 'Clean food laws were given for our physical and spiritual wellbeing. Our bodies are temples. What we eat affects our health and our ability to serve the Most High.',
    verse: '1 Corinthians 6:19',
    verseText: 'What? know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own?',
    ageGroups: ['child', 'teen', 'parent', 'elder'],
  },
];
