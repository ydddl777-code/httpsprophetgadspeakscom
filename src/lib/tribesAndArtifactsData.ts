// Tribes of Israel - Complete Data
// CRITICAL: Use EXACTLY as Written

export interface TribeData {
  title: string;
  meaning: string;
  symbol: string;
  lineage: string;
  biblicalFacts: string;
  modernTheory: string;
}

export interface ArtifactData {
  title: string;
  significance: string;
  details: string;
}

export const TRIBES_DATA: Record<string, TribeData> = {
  Reuben: {
    title: "Tribe of Reuben",
    meaning: "See, a Son",
    symbol: "Mandrake / Rising Sun / Water",
    lineage: "1st Born Son of Jacob & Leah",
    biblicalFacts: "The firstborn son of Jacob. He lost his birthright due to misconduct. Jacob prophesied he would be 'unstable as water' (Gen 49:4). Represented by the rising sun and water.",
    modernTheory: "In 20th-century Hebrew Israelite theology (The 12 Tribes Chart), Reuben is often identified with the Seminole Indians, known for their distinct history and resistance in the Florida everglades."
  },
  Simeon: {
    title: "Tribe of Simeon",
    meaning: "Heard",
    symbol: "Castle / Towers / Sword",
    lineage: "2nd Son of Jacob & Leah",
    biblicalFacts: "Known for their fierce temper and weapons of violence (Gen 49:5). They were eventually scattered within the territory of Judah. Represented by the tower and sword.",
    modernTheory: "Modern Hebrew Israelite theology identifies Simeon with the people of the Dominican Republic, citing historical parallels in temperament and geographical history."
  },
  Levi: {
    title: "Tribe of Levi",
    meaning: "Joined / Attached",
    symbol: "Priestly Breastplate",
    lineage: "3rd Son of Jacob & Leah",
    biblicalFacts: "The priestly tribe, set apart for service to God in the Tabernacle and Temple. They received no land inheritance but dwelt among all the tribes. Represented by the High Priest's Breastplate.",
    modernTheory: "On the 12 Tribes Chart, Levi is identified with the people of Haiti. This connection is often drawn from their deep spiritual roots and historical resilience."
  },
  Judah: {
    title: "Tribe of Judah",
    meaning: "Yahweh be Praised",
    symbol: "Lion",
    lineage: "4th Son of Jacob & Leah",
    biblicalFacts: "The Royal Tribe. Jacob prophesied 'The scepter shall not depart from Judah' (Gen 49:10). King David and Jesus (Yeshua) descend from this line. Represented by the Lion.",
    modernTheory: "Widely identified in Hebrew Israelite theology as the so-called African Americans, bearing the legacy of the kingship and the endurance of the 'yoke of iron' (Deut 28)."
  },
  Dan: {
    title: "Tribe of Dan",
    meaning: "Judge",
    symbol: "Serpent / Scales of Justice",
    lineage: "5th Son of Jacob (1st of Bilhah)",
    biblicalFacts: "Prophesied to 'judge his people' and be a 'serpent by the way' that bites the horse's heels (Gen 49:16-17). Famous for Samson. Notably missing from the 144,000 in Revelation 7.",
    modernTheory: "Historical mysteries abound regarding Dan. 19th-century British Israelism theorized they became the Danish (Denmark). However, Ethiopian tradition holds that the Beta Israel Jews are descendants of Dan. In Caribbean theology, Dan often represents a spiritual 'House' rather than a specific national border."
  },
  Naphtali: {
    title: "Tribe of Naphtali",
    meaning: "My Wrestling",
    symbol: "Hind (Deer) Let Loose",
    lineage: "6th Son of Jacob (2nd of Bilhah)",
    biblicalFacts: "Jacob blessed Naphtali as a 'hind let loose' who gives 'goodly words' (Gen 49:21). They settled in the fertile Galilee region.",
    modernTheory: "The 12 Tribes Chart identifies Naphtali with the indigenous and mixed populations of Argentina and Chile, referencing the 'goodly words' and spacious lands of the region."
  },
  Gad: {
    title: "Tribe of Gad",
    meaning: "Troop / Fortune",
    symbol: "Tents / Troop",
    lineage: "7th Son of Jacob (1st of Zilpah)",
    biblicalFacts: "Jacob prophesied 'A troop shall overcome him: but he shall overcome at the last' (Gen 49:19). Known as mighty warriors.",
    modernTheory: "Identified in Hebrew Israelite theology as the North American Indians, famed for their warrior spirit and the tragic history of being 'overcome' by colonial troops, yet prophesied to rise."
  },
  Asher: {
    title: "Tribe of Asher",
    meaning: "Happy / Blessed",
    symbol: "Olive Tree / Cup / Bread",
    lineage: "8th Son of Jacob (2nd of Zilpah)",
    biblicalFacts: "Prophesied to yield 'royal dainties' and be rich in food and resources (Gen 49:20). Represented by the olive tree and overflowing cup.",
    modernTheory: "The Chart connects Asher to the peoples of Colombia to Uruguay (Incas), regions known for immense natural resources and ancient wealth."
  },
  Issachar: {
    title: "Tribe of Issachar",
    meaning: "Reward / Hire",
    symbol: "Donkey with Burdens",
    lineage: "9th Son of Jacob & Leah",
    biblicalFacts: "Described as a 'strong donkey couching down between two burdens' (Gen 49:14). Known for their wisdom and understanding of the times and seasons.",
    modernTheory: "Identified as the Mexicans (Aztecs). The 'burdens' are often interpreted as the hard labor and endurance characteristic of the people throughout history."
  },
  Zebulun: {
    title: "Tribe of Zebulun",
    meaning: "Dwelling",
    symbol: "Ship / Haven",
    lineage: "10th Son of Jacob & Leah",
    biblicalFacts: "Jacob prophesied he would dwell at the 'haven of the sea' and be a haven for ships (Gen 49:13). Associated with commerce and maritime life.",
    modernTheory: "Identified with the peoples of Guatemala to Panama (Mayans), fitting the geography of the isthmus between the seas."
  },
  Joseph: {
    title: "Tribe of Joseph",
    meaning: "He Shall Add",
    symbol: "Sheaf of Wheat / Bull",
    lineage: "11th Son of Jacob (1st of Rachel)",
    biblicalFacts: "The holder of the birthright, a 'fruitful bough.' His sons Ephraim and Manasseh became two distinct, populous tribes. Represented by the powerful ox/buffalo.",
    modernTheory: "Spiritually represents the double-portion. In the Chart, his sons are identified as Puerto Ricans (Ephraim) and Cubans (Manasseh)."
  },
  Benjamin: {
    title: "Tribe of Benjamin",
    meaning: "Son of My Right Hand",
    symbol: "Wolf",
    lineage: "12th Son of Jacob (2nd of Rachel)",
    biblicalFacts: "Jacob prophesied 'Benjamin shall ravin as a wolf' (Gen 49:27). The tribe of King Saul, Queen Esther, and the Apostle Paul.",
    modernTheory: "Identified as the West Indians (Jamaicans, Trinidadians, etc.). The 'Wolf' nature is often correlated with the fierce independence and distinct culture of the Caribbean islands."
  }
};

export const ARTIFACTS_DATA: Record<string, ArtifactData> = {
  Ark: {
    title: "The Ark of the Covenant",
    significance: "The most sacred object, symbolizing God's throne and presence among His people.",
    details: "A wooden chest covered in gold, containing the stone tablets of the 10 Commandments, a pot of manna, and Aaron's rod. Its lid, the 'Mercy Seat,' featured two golden cherubim where God's glory would appear."
  },
  Menorah: {
    title: "The Golden Menorah",
    significance: "Symbolizes the light of God and the mission of Israel to be a 'light to the nations'.",
    details: "A seven-branched lampstand hammered from a single piece of pure gold. It was kept burning daily in the Holy Place of the Tabernacle, using pure olive oil."
  },
  Showbread: {
    title: "Table of Showbread",
    significance: "Represents God's constant provision for the twelve tribes of Israel and their fellowship with Him.",
    details: "A table overlaid with gold, holding twelve loaves of bread (one for each tribe) that were replaced every Sabbath by the priests. Also held golden pitchers and bowls for libation offerings."
  },
  Altar: {
    title: "Altar of Incense",
    significance: "Symbolizes the prayers of the people ascending to God, a pleasing aroma to Him.",
    details: "A small, tall altar overlaid with gold, placed directly in front of the veil to the Most Holy Place. A special, holy incense was burned on it morning and evening."
  },
  Breastplate: {
    title: "High Priest's Breastplate",
    significance: "A breastplate of judgment worn by the High Priest, bearing the names of the tribes before God as a continual memorial.",
    details: "A sacred vestment set with twelve precious stones (like Ruby, Topaz, Emerald, Sapphire, etc.), each engraved with the name of one of the twelve tribes of Israel."
  }
};

// Ordered list of tribes (birth order)
export const TRIBES_ORDER = [
  'Reuben',
  'Simeon', 
  'Levi',
  'Judah',
  'Dan',
  'Naphtali',
  'Gad',
  'Asher',
  'Issachar',
  'Zebulun',
  'Joseph',
  'Benjamin'
] as const;

// Ordered list of artifacts
export const ARTIFACTS_ORDER = [
  'Ark',
  'Menorah',
  'Showbread',
  'Altar',
  'Breastplate'
] as const;

export type TribeName = typeof TRIBES_ORDER[number];
export type ArtifactName = typeof ARTIFACTS_ORDER[number];
