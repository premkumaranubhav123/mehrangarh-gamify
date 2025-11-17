// src/data/mehrangarhStories.js

// Base URL for media files - will work in both development and production
const getBaseUrl = () => {
  // In production, use relative paths since backend serves frontend
  if (process.env.NODE_ENV === 'production') {
    return '/api/media';
  }
  // In development, use the backend server URL
  return 'http://localhost:5001/api/media';
};

const BASE_URL = getBaseUrl();

// URL helper functions with enhanced error handling
const getVideoUrl = (videoId) => {
  if (!videoId) {
    console.warn('⚠️ No videoId provided to getVideoUrl');
    return null;
  }
  return `${BASE_URL}/video/${videoId}`;
};

const getAudioUrl = (type, audioId) => {
  if (!type || !audioId) {
    console.warn('⚠️ Missing parameters for getAudioUrl:', { type, audioId });
    return null;
  }
  return `${BASE_URL}/audio/${type}/${audioId}`;
};

// Media availability check
export const checkMediaAvailability = async () => {
  try {
    const response = await fetch(`${BASE_URL}/files`);
    const data = await response.json();
    console.log('📊 Available media files:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to check media availability:', error);
    return null;
  }
};

export const mehrangarhStories = [
  {
    id: 'kannauj-legacy',
    title: 'Kannauj - Where Legends Were Born',
    description: 'Discover the ancestral home and exile that forged the Rathore dynasty',
    difficulty: 'beginner',
    audioFile: getAudioUrl('english', 'a1'),
    hindiAudioFile: getAudioUrl('hindi', 'a1'),
    videoFile: getVideoUrl('v1'),
    paintings: [
      {
        id: 'kannauj-city',
        title: 'Kannauj - The Golden City',
        imageUrl: '/img/p1.png',
        story: `Imagine a city bathed in golden light, cradled by the sacred Ganga, where marble palaces whispered secrets of empire and war drums echoed through cobbled streets. This was Kannauj — not just a kingdom, but a crown jewel of North India, the ancestral hearth of the mighty Rathore dynasty.

In this breathtaking 1829 masterpiece — painted with opulent watercolors, shimmering gold, and gleaming tin — we are transported back to the moment when history turned on its heel. The artist doesn't merely depict a city; they resurrect an era. With poetic precision, multiple perspectives unfold like chapters of an epic: the fortified walls stand proud, temples rise like prayers to heaven, gardens bloom in geometric harmony, and the river flows as if carrying the soul of the land itself.

But look closer... near the verdant banks, beneath the canopy of trees, horsemen ride away — cloaks billowing, spears glinting, hearts heavy with farewell. These are not mere travelers. These are the Rathores, noble sons of Kannauj, fleeing the ashes of defeat after their king, Jayachand, fell to Muhammad Ghori's thunderous invasion in 1194.

It was a rupture — a wound that would birth legend.

Forced into exile, they rode westward into the unknown, guided by destiny and steel. And from that dust-strewn journey emerged Jodhpur — the Blue City, the Sun City, the fortress of Rajput valor. Yet even as centuries passed, the Rathores never forgot their roots. They carried Kannauj in their blood, in their songs, in their dreams.

This painting? It is no mere historical record. It is a declaration. Commissioned nearly 700 years after the exodus, it is the Rathores' defiant cry across time: "We remember. We endure. Our glory began here."

The artist's brush becomes a time machine — inviting you to walk those ancient streets, feel the weight of history, witness the sorrow of departure, and taste the fire of rebirth.

Kannauj may have fallen... but the Rathores? They rose — higher, fiercer, eternal.`,
        clues: [
          'Look for the horsemen riding away near the river banks',
          'Find the fortified walls and temples rising to heaven',
          'Identify the moment of exile and new beginnings'
        ],
        questions: [
          {
            question: "In which year did the Rathores flee Kannauj after Jayachand's defeat?",
            options: ["1194", "1294", "1094", "1394"],
            correct: 0,
            points: 100
          },
          {
            question: "Which city did the Rathores establish after their exile from Kannauj?",
            options: ["Jodhpur", "Jaipur", "Udaipur", "Bikaner"],
            correct: 0,
            points: 150
          },
          {
            question: "What materials were used to create this masterpiece?",
            options: ["Watercolors, gold, and tin", "Oil paints and canvas", "Charcoal and paper", "Digital art"],
            correct: 0,
            points: 120
          }
        ]
      }
    ],
    completionReward: 500
  },
  {
    id: 'coronation-glory',
    title: 'Coronation Chronicles',
    description: 'Witness the sacred rituals that crowned Rajput kings',
    difficulty: 'intermediate',
    audioFile: getAudioUrl('english', 'a2'),
    hindiAudioFile: getAudioUrl('hindi', 'a2'),
    videoFile: getVideoUrl('v2'),
    paintings: [
      {
        id: 'man-singh-coronation',
        title: 'Maharaja Man Singh\'s Coronation',
        imageUrl: '/img/p2.png',
        story: `Jodhpur, January 19, 1804 — The air itself trembled with destiny.

Beneath the watchful gaze of Mehrangarh's towering ramparts, where history had whispered through centuries of conquest and courtly intrigue, a new era was being forged — not by sword, but by sacred ritual, royal splendor, and divine sanction.

This is no ordinary painting. This is a living chronicle, captured in gold leaf and vibrant pigment by the masterful hand of Amardas Bhatti — a visual symphony of sovereignty unfolding before your eyes.

At the heart of it all, seated upon a throne carved from legend — a golden lion, its mane gilded, its paws gripping the earth like the very foundations of the kingdom — sits Maharaja Man Singh, resplendent in silks and jewels, his brow about to be anointed with sacred tilak by none other than the revered Thakur of Bagri. It is the rajtilak — the moment when mortal becomes monarch, when bloodline meets blessing, and when the heavens themselves nod in approval.

Around him, the Rathore nobility stand like pillars of stone and steel — their turbans blazing crimson and saffron, their armor glinting under the winter sun. These are the men who will carry his name into battle, into council, into eternity. Their silence is louder than any war cry — for they know: today, the soul of Marwar has been crowned anew.

Behind them, on raised platforms, the second tier of courtiers watch — their expressions a tapestry of awe, ambition, and reverence. And below, in the courtyard's hushed embrace, the women — veiled yet radiant — stand as quiet witnesses to history. Their presence whispers that power does not reside only in crowns and swords — but also in the silent strength of those who hold the kingdom's soul.

And rising above it all? The Ajit Vilas Palace, its balconies adorned with intricate latticework, its windows watching like the eyes of ancestors past. It stands not just as architecture — but as a symbol. A monument to resilience. To legacy. To the unbroken line of kings who shaped this land.

Every brushstroke here is deliberate. Every figure placed with purpose. Amardas Bhatti didn't merely paint a coronation — he orchestrated a revelation. He turned ceremony into scripture, spectacle into scripture, and tradition into triumph.

So lean closer. Let your eyes wander across the sea of turbans, the gleam of ceremonial daggers, the delicate hands pouring blessings from golden vessels. Feel the weight of the moment — the hush before thunder, the breath before the roar.

Because what you're witnessing isn't just the crowning of a king.

It's the birth of a legend.`,
        clues: [
          'Find the golden lion throne at the center',
          'Look for the sacred tilak ceremony',
          'Identify the Rathore nobility in crimson turbans',
          'Notice the women witnesses in the courtyard'
        ],
        questions: [
          {
            question: "Who performed the sacred tilak ceremony for Maharaja Man Singh?",
            options: ["Thakur of Bagri", "Royal Priest", "Mughal Emperor", "His Father"],
            correct: 0,
            points: 200
          },
          {
            question: "What animal symbolizes the throne in this coronation?",
            options: ["Golden Lion", "Royal Elephant", "Mythical Griffin", "Imperial Eagle"],
            correct: 0,
            points: 180
          },
          {
            question: "Which palace is depicted rising above the coronation ceremony?",
            options: ["Ajit Vilas Palace", "Umaid Bhawan", "Mehrangarh Fort", "Jaswant Thada"],
            correct: 0,
            points: 160
          }
        ]
      }
    ],
    completionReward: 750
  },
  {
    id: 'warrior-kings',
    title: 'Warrior Kings of Marwar',
    description: 'Meet the rulers who balanced battlefield valor with cultural refinement',
    difficulty: 'intermediate',
    audioFile: getAudioUrl('english', 'a3'),
    hindiAudioFile: getAudioUrl('hindi', 'a3'),
    videoFile: getVideoUrl('v3'),
    paintings: [
      {
        id: 'gaj-singh',
        title: 'Maharaja Gaj Singh I - Sword and Splendor',
        imageUrl: '/img/p3.png',
        story: `This is not merely a portrait.

This is a declaration.

A man stands — poised, regal, unyielding — his gaze fixed beyond the frame, as if scanning the horizon for battle, or perhaps gazing into the annals of history where his name will be etched in gold.

Maharaja Gaj Singh I — not just a ruler of Marwar, but a titan among Mughal nobles. A king who wore the crown of Jodhpur while answering the call of emperors — Jahangir, then Shah Jahan — to march south, far from the arid winds of Rajasthan, into the sultry, treacherous heart of the Deccan.

He didn't go as a vassal.

He went as a conqueror.

In 1621, beneath the burning sun of Ahmadnagar, he led Mughal legions against the legendary Malik Ambar, the African-born genius who defied empires. And Gaj Singh? He didn't just fight — he shattered. With steel in hand and strategy in soul, he carved victory from chaos. That day, the Deccan trembled — not from thunder, but from the roar of Rathore cavalry and the clash of his khanda sword, long, straight, and deadly as justice itself.

And here — in this luminous portrait, painted decades later yet pulsing with timeless power — we see him again.

Draped in robes that whisper of imperial favor — embroidered with gold thread, jeweled at the collar, flowing like liquid moonlight — he holds not just weapons, but symbols:
➡️ The khanda — a blade forged for war, wielded by kings.
➡️ The jeweled dagger — a weapon of ceremony, yes... but also of precision, of courtly grace under pressure.

His stance? Unshakable. One foot forward, as if ready to step into battle — or into legacy.

His turban? Crowned with jewels, yet humble in its form — a reminder that true power needs no boast.

And look closer — those striped leggings, the soft pink slippers — they speak of culture, of refinement, of a ruler who didn't just command armies... he cultivated art.

Because Gaj Singh was more than a warrior.

He was a cultural ambassador.

Stationed at Burhanpur, the glittering provincial capital of the Mughal south, he didn't just take orders — he took inspiration. He brought back to Jodhpur the delicate brushwork of Deccani miniatures, the lyrical curves of Persian poetry, the rhythm of southern melodies. Under his patronage, Jodhpur became not just a fortress of stone — but a sanctuary of beauty.

This painting? It's a mirror held up to greatness.

It shows us a man who walked between worlds — Rajput valor and Mughal grandeur, battlefield grit and courtly elegance, tradition and innovation. He wore both crowns — the royal diadem and the commander's armor — without faltering.

So when you gaze upon this image, don't just see a king.

See the storm that calmed empires.

See the sword that sculpted peace.

See the soul who carried two cultures in one heart.

And remember — behind every jewel-studded robe, there lies a story of sweat, sacrifice, and supreme sovereignty.`,
        clues: [
          'Look for the khanda sword and jeweled dagger',
          'Notice the Mughal-inspired robes with gold thread',
          'Observe the stance ready for battle',
          'Find the cultural elements in his attire'
        ],
        questions: [
          {
            question: "Against whom did Gaj Singh I lead Mughal legions in the Deccan?",
            options: ["Malik Ambar", "Shivaji", "Aurangzeb", "Babur"],
            correct: 0,
            points: 220
          },
          {
            question: "Which two empires' influences can be seen in Gaj Singh's portrait?",
            options: ["Rajput and Mughal", "British and French", "Portuguese and Dutch", "Persian and Chinese"],
            correct: 0,
            points: 200
          },
          {
            question: "What was Gaj Singh's role in the Mughal court?",
            options: ["Mughal Noble and Commander", "Diplomatic Advisor", "Trade Minister", "Religious Scholar"],
            correct: 0,
            points: 180
          }
        ]
      }
    ],
    completionReward: 800
  },
  {
    id: 'music-art',
    title: 'Music and Miniatures',
    description: 'Explore the artistic soul of Marwar through music and painting',
    difficulty: 'advanced',
    audioFile: getAudioUrl('english', 'a4'),
    hindiAudioFile: getAudioUrl('hindi', 'a4'),
    videoFile: getVideoUrl('v4'),
    paintings: [
      {
        id: 'ragini-gundakari',
        title: 'Ragini Gundakari - Music in Color',
        imageUrl: '/img/p4.png',
        story: `This is not just a page from a ragamala.

This is a love letter painted in pigment and gold, where every curve, every hue, every petal sings with the ache of anticipation — the sweet, trembling wait for a lover's return.

Welcome to Ragini Gundakari — the feminine counterpart to the raga Gundakari, whose notes ripple through the air like sighs caught between dusk and dawn. In this sacred visual symphony, music is no longer heard — it is seen. Felt. Lived.

At the heart of this jewel-toned dream stands a young maiden, her skin glowing like dawn-kissed marble, her eyes heavy with longing as she gathers lotuses — soft, sacred blooms that will become a bed fit for divine reunion. She doesn't merely pluck flowers — she weaves hope into petals, prayer into perfume.

Around her, her sakhis — her confidantes, her sisters-in-soul — watch with knowing smiles and gentle hands. They are the chorus to her solo, the rhythm to her yearning. One adjusts her veil, another holds a mirror reflecting not her face — but her inner fire. Together, they form a circle of intimacy, of shared secrets whispered under jasmine vines.

And beneath them all?

A lone peacock — its tail feathers folded, its gaze fixed upward — stands sentinel at the edge of paradise. Not strutting. Not showing off. But waiting. Just like her. For in Indian tradition, the peacock is the bird of lovers — its cry echoes the call of the heart, its presence a symbol of fidelity, desire, and the beauty of patience.

Look closer — the architecture around them isn't mere backdrop. It's poetry carved in stone and paint. The Deccani style sings here — rich mauve-pinks bleeding into velvet blues, intricate arabesques swirling like smoke from incense, patterns so delicate they seem spun from starlight. These were the colors brought back by Rathore nobles who marched south with Mughal armies — not just to conquer, but to absorb, to transform, to elevate.

This painting was born during campaigns — yes — but not of war.

It was born of wonder.

Of courtiers returning from Ahmadnagar and Bijapur with new melodies, new hues, new ways of seeing love — not as conquest, but as communion. And here, in this gilded frame, they gave form to emotion itself.

The text above? Written in elegant Devanagari script — it's the raga's name, its lineage, its invocation. A mantra to summon the mood. To make you feel what the maiden feels — the flutter before footsteps, the hush before embrace, the sweetness of waiting when love is near.

So let your eyes wander — across the arches framing her like a shrine, across the floral borders blooming with impossible grace, across the peacock's quiet vigil.

Because what you're witnessing isn't just art.

It's the embodiment of romance — frozen in time, yet pulsing with life.

It's the sound of silence before a kiss.

It's the color of a heartbeat echoing through centuries.

And if you listen closely... you might hear the faintest whisper of a flute — calling her name.`,
        clues: [
          'Find the maiden gathering lotuses for her lover',
          'Look for the peacock waiting at the edge',
          'Notice the Deccani style with rich mauve-pinks',
          'Identify the sakhis (companions) around her'
        ],
        questions: [
          {
            question: "What is Ragini Gundakari waiting for in this painting?",
            options: ["Her lover's return", "A musical performance", "A royal ceremony", "The monsoon rains"],
            correct: 0,
            points: 250
          },
          {
            question: "Which artistic style influences this painting's colors and patterns?",
            options: ["Deccani style", "Mughal style", "European style", "Chinese style"],
            correct: 0,
            points: 230
          },
          {
            question: "What does the peacock symbolize in this painting?",
            options: ["Love and fidelity", "Royal power", "Divine blessing", "Wealth and prosperity"],
            correct: 0,
            points: 210
          }
        ]
      }
    ],
    completionReward: 900
  },
  {
    id: 'court-life',
    title: 'Royal Court Chronicles',
    description: 'Experience the vibrant life and ceremonies of the Marwar court',
    difficulty: 'advanced',
    audioFile: getAudioUrl('english', 'a5'),
    hindiAudioFile: getAudioUrl('hindi', 'a5'),
    videoFile: getVideoUrl('v5'),
    paintings: [
      {
        id: 'zenana-durbar',
        title: 'The Velvet Throne of Whispered Power',
        imageUrl: '/img/p5.png',
        story: `c. 1850 — Jodhpur. But this is no ordinary court.

This is the heart of the palace that never sleeps — where silk rustles louder than swords, where jewels glint brighter than crowns, and where women rule not with scepters... but with silence, strategy, and sublime splendor.

Welcome to the Zenana Durbar — a rare, radiant glimpse behind the veil, painted by the masterful hand of Bulaki, who dared to capture what few ever saw: the hidden empire within the empire.

At the center — draped in gold like living deities — sit the dowager queen-mothers and the Patrani, the Chief Queen herself. They share a single bolster, a single carpet — not out of modesty, but because their power needs no separation. Their proximity to the center is their crown. Their stillness? A throne.

Their garments shimmer — brocade woven with threads of legend, necklaces heavy with history, bangles clinking like temple bells. These are not mere ornaments — they are armor. Symbols of lineage, loyalty, and unspoken authority.

To their left and right — arrayed like petals around a sacred bloom — are the other queens, concubines, and royal ladies. Each posture, each glance, each fold of fabric tells a story. Some lean forward with eager eyes — hungry for favor, for attention, for the next whisper of intrigue. Others sit back, serene as goddesses — knowing their place is secure, their influence eternal.

And there, seated perpendicular to the Patrani — almost guarding her like silent sentinels — are the eunuch guards. Not warriors of steel, but keepers of secrets. Masters of discretion. Their presence reminds us: this is a world where power flows through whispers, where alliances are forged over tea, and where a single word can shift dynasties.

Look closer — beyond the glittering elite — and you'll see the senior women, perhaps widows, dressed in striped or printed cotton skirts, adorned with minimal jewelry. Their simplicity is not poverty — it is dignity. A quiet strength born of experience, of survival, of having seen empires rise and fall from behind latticed windows. They are the memory of the court — the anchors in the storm.

And then... in the distant corner on the left?

There he sits — Maharaja Takhat Singh, observing his own birthday celebration from afar. He is present — yet absent. The king, yes — but here, in this realm of women, he is a guest. A spectator. For today, the zenana does not bow — it shines.

The painting itself is a tapestry of hierarchy — every inch calculated, every figure placed with purpose. The red patterned floor beneath them? It pulses like a heartbeat. The golden arches above? They frame not just bodies — but legacies.

This is not just a birthday gathering.

This is a coronation of femininity — a declaration that power doesn't always roar. Sometimes, it smiles softly, adjusts its veil, and lets the world come to it.

It's a world where:
- A glance can command an army.
- A laugh can change policy.
- A silence can seal fate.

So let your eyes linger — on the curve of a sari, the gleam of a nose ring, the poised elegance of a hand resting on a bolster.

Because what you're witnessing isn't just art.

It's history breathing through silk.

It's power wearing perfume.

It's the unseen kingdom that held the throne together — even when no one was looking.`,
        clues: [
          'Find the chief queen and queen-mothers at center',
          'Look for Maharaja Takhat Singh observing from corner',
          'Notice the eunuch guards protecting the zenana',
          'Identify the hierarchy through clothing and positioning'
        ],
        questions: [
          {
            question: "Who painted the Zenana Durbar scene?",
            options: ["Bulaki", "Amardas Bhatti", "Dalchand", "Ali"],
            correct: 0,
            points: 280
          },
          {
            question: "What special occasion is depicted in this painting?",
            options: ["Maharaja's birthday", "Coronation ceremony", "Wedding celebration", "Religious festival"],
            correct: 0,
            points: 260
          },
          {
            question: "Where is Maharaja Takhat Singh positioned in this scene?",
            options: ["Observing from the corner", "At the center throne", "Standing with guards", "Not present in the scene"],
            correct: 0,
            points: 240
          }
        ]
      }
    ],
    completionReward: 1000
  },
  {
    id: 'royal-sports',
    title: 'Royal Sports & Recreation',
    description: 'Discover how royalty entertained themselves with sports and games',
    difficulty: 'intermediate',
    audioFile: getAudioUrl('english', 'a6'),
    hindiAudioFile: getAudioUrl('hindi', 'a6'),
    videoFile: getVideoUrl('v6'),
    paintings: [
      {
        id: 'polo-queens',
        title: 'Ladies Play Polo with Maharaja Takhat Singh',
        imageUrl: '/img/p6.png',
        story: `c. 1845–50 — Jodhpur. But this isn't just a game.

This is a rebellion painted in gold leaf and horsehair.

A thunderous, glittering, utterly unapologetic declaration that royal women of India did not wait behind veils — they charged into the arena, mallets raised, hearts blazing, riding like warriors born of wind and fire.

Forget what you've been told.

Forget the myths of passive princesses locked in gilded cages.

Because here — beneath the golden sky of Jodhpur, captured by the visionary brush of Bulaki — we witness something radical, exhilarating, glorious: Ladies playing polo with their king.

Yes — with him.

Not beside him.

Not behind him.

Beside him on horseback, astride magnificent Marwari steeds — their ears curled upward like crescent moons, their manes flying like banners of defiance. These are no mere mounts — they are symbols of Rajput spirit, bred for battle, now dancing to the rhythm of sport.

And look at them — these queens, these noblewomen — dressed not in courtly silks meant for stillness, but in flowing robes designed for motion. Their turbans flutter, their bangles catch the sun as they lean into turns, their eyes sharp, focused, fierce. They wield polo sticks not as toys — but as extensions of their will. Each swing is a statement. Each gallop, a manifesto.

At the center — radiant, commanding, haloed in divine light — rides Maharaja Takhat Singh himself. The nimbus around his head? Not just artistic flourish — it's a crown forged in celestial approval. He doesn't dominate the scene — he anchors it. A king among equals, sharing the field, sharing the thrill, sharing the glory.

And Bulaki? Genius. Absolute genius.

Faced with chaos — horses rearing, players charging, sticks crossing like swords in a duel — he didn't panic. He orchestrated. He arranged the figures in a perfect circle — a mandala of motion, a wheel of power. The polo sticks become lines of symmetry, dividing the arena not into halves... but into harmonies. It's geometry meets grace. Strategy meets spectacle.

This painting shatters every stereotype.

It says:
➡️ Women weren't spectators — they were champions.
➡️ Seclusion was never their destiny — speed was.
➡️ Their jewels weren't just adornments — they were armor.
➡️ Their laughter wasn't soft — it echoed across dusty fields like war cries turned sweet.

Hunting? Yes. Polo? Absolutely. Dancing under stars? Of course. These women lived fully — fiercely — fabulously.

They didn't ask permission to ride.

They rode anyway.

And in doing so, they rewrote history — not with ink, but with hoofbeats.

So let your eyes follow the arc of the mallet, the curve of the horse's neck, the gleam in the queen's eye as she charges toward the ball.

Because what you're seeing isn't just sport.

It's freedom in motion.

It's power wearing perfume and spurs.

It's a moment when tradition met triumph — and chose joy over constraint.`,
        clues: [
          'Find the royal women playing polo alongside the king',
          'Look for the Marwari horses with curled ears',
          'Notice the circular composition of the painting',
          'Identify the divine halo around Maharaja Takhat Singh'
        ],
        questions: [
          {
            question: "What makes this polo game revolutionary for its time?",
            options: ["Women playing alongside the king", "Playing at night", "Use of golden mallets", "International players"],
            correct: 0,
            points: 270
          },
          {
            question: "What special breed of horses are depicted in this painting?",
            options: ["Marwari steeds", "Arabian horses", "Thoroughbreds", "Mongolian ponies"],
            correct: 0,
            points: 250
          },
          {
            question: "Who was the artist of this revolutionary painting?",
            options: ["Bulaki", "Amardas Bhatti", "Dalchand", "Ali"],
            correct: 0,
            points: 230
          }
        ]
      }
    ],
    completionReward: 850
  },
  {
    id: 'royal-patronage',
    title: 'Royal Patronage of Arts',
    description: 'Explore how kings supported and participated in artistic endeavors',
    difficulty: 'advanced',
    audioFile: getAudioUrl('english', 'a7'),
    hindiAudioFile: getAudioUrl('hindi', 'a7'),
    videoFile: getVideoUrl('v7'),
    paintings: [
      {
        id: 'abhai-singh-performance',
        title: 'Evening Performance for Maharaja Abhai Singh',
        imageUrl: '/img/p7.png',
        story: `c. 1725 — Jodhpur. But this is no ordinary night.

This is a symphony painted in candlelight, where every brushstroke hums with devotion, every dancer's step echoes like poetry, and every note rises not just to please the ear... but to crown a king.

Welcome to the Durbar of Delight, commissioned by none other than Maharaja Abhai Singh himself — fresh upon his throne, radiant with power, yet utterly enchanted by beauty. He didn't just rule Marwar — he curated its soul. And on this evening, beneath the velvet hush of twilight, he invited the heavens down to earth... through music.

At the heart of it all — seated upon a jeweled gold throne, larger than life, literally and figuratively — sits Abhai Singh. His presence dominates not through force, but through grace. The artist, Dalchand, a master of Mughal finesse, paints him slightly oversized — not as vanity, but as reverence. This is how kings are seen when they are loved: larger than men, closer to gods.

Around him, a troupe of female musicians and dancers perform — their bodies flowing like liquid silk, their hands tracing rhythms only the soul can hear. Some pluck strings that whisper secrets of love; others sway to melodies older than empires. Their garments shimmer — saffron, crimson, emerald — each hue a verse in the epic of pleasure.

Dalchand's genius? It lies in the silence between notes. In the way he frames Abhai Singh against white expanses of marble, glowing softly under candlelight — a luminous island in the dark garden beyond. The contrast is divine: light vs. shadow, court vs. nature, mortal vs. myth. You can almost smell the jasmine, feel the cool stone beneath bare feet, hear the faint clink of bangles as hips sway.

The pavilion itself? A palace within a palace — arches carved with floral lace, balconies heavy with hanging lanterns, walls alive with intricate patterns. Even the floor tiles seem to dance beneath the performers' feet.

And look — at the edges, near the fountain, a few courtiers watch in quiet awe. Not competing for attention — simply bearing witness to magic. For tonight, the king doesn't command. He receives. He is the still point around which joy revolves.

This painting isn't just a record of an event.

It's a ritual of reverence.

It's a celebration of culture as sovereignty.

It's proof that true power doesn't shout — it sings.

Because Abhai Singh knew something many rulers forget:

A kingdom thrives not only on armies and alliances...
But on art, on music, on moments that make hearts tremble with wonder.

He didn't just build forts — he built feelings.

He didn't just collect jewels — he collected moments.

And here, in this golden glow, we see him at his most human — not ruling, but reveling. Not commanding, but communing.

So let your eyes wander — across the curve of a dancer's arm, the gleam of a lute string, the flicker of candlelight catching the edge of a turban.

Because what you're witnessing isn't just performance.

It's devotion rendered in pigment.

It's power dressed in rhythm.

It's a king who understood that the greatest conquest is the one that makes the soul sigh — "Ah... yes. This is living."`,
        clues: [
          'Find Maharaja Abhai Singh on the jeweled throne',
          'Look for the female musicians and dancers',
          'Notice the contrast between light and shadow',
          'Identify the Mughal artistic influences'
        ],
        questions: [
          {
            question: "What artistic style is evident in this painting?",
            options: ["Mughal finesse", "European realism", "Chinese brushwork", "Persian miniature"],
            correct: 0,
            points: 300
          },
          {
            question: "How is Maharaja Abhai Singh depicted compared to others?",
            options: ["Larger than life", "Same size as others", "Small and distant", "Not visible"],
            correct: 0,
            points: 280
          },
          {
            question: "What type of event is being depicted in this painting?",
            options: ["Musical performance", "Coronation ceremony", "War council", "Hunting expedition"],
            correct: 0,
            points: 260
          }
        ]
      }
    ],
    completionReward: 950
  },
  {
    id: 'divine-power',
    title: 'Divine Power & Spirituality',
    description: 'Discover the spiritual beliefs that guided the Rathore rulers',
    difficulty: 'expert',
    audioFile: getAudioUrl('english', 'a8'),
    hindiAudioFile: getAudioUrl('hindi', 'a8'),
    videoFile: getVideoUrl('v8'),
    paintings: [
      {
        id: 'nine-goddesses',
        title: 'Nine Forms of the Goddess',
        imageUrl: '/img/p8.png',
        story: `c. 1780–90 — Jodhpur. But this is no earthly court.

This is the celestial throne room, where nine goddesses ride into your soul on lions, elephants, peacocks, and lotuses — each a facet of the Divine Feminine, each a storm of strength, each a hymn to the power that birthed worlds... and shattered them.

Welcome to Folio 2 of the Durga Charit — not just a painting, but a manifesto.

Commissioned by the Rathore kings, who bowed not only to crowns and conquests — but to the Goddess Durga herself, the warrior-mother whose sword cleaves illusion and whose gaze ignites courage. For them, she was not myth — she was military strategy, spiritual armor, royal destiny. And here, in radiant gold and jewel-toned fury, she reveals her many faces — each more breathtaking than the last.

From left to right — they come:

➡️ Chamunda — fierce, skeletal, draped in skulls, riding a jackal. She is the destroyer of demons, the embodiment of time's teeth. Her presence alone makes fear tremble.

➡️ Varahi — boar-headed, mighty, seated upon a buffalo. She is raw primal force — the earth's roar, the storm's breath. No foe stands before her and lives.

➡️ Indrani — queen of heaven, consort of Indra, crowned with stars, riding an elephant. She is regality forged in thunder — grace with lightning in its veins.

➡️ Vaishnavi — blue-skinned, serene yet potent, mounted on Garuda — the eagle king. She is cosmic order, divine law, the rhythm of the universe made manifest.

➡️ Maheshwari — three-eyed, crescent-crowned, astride a bull. She is Shiva's counterpart — destruction and rebirth woven into one divine form. Her silence speaks louder than any war cry.

➡️ Kaumari — youthful, radiant, armed with spear and shield, riding a peacock. She is the fire of youth, the spark of rebellion, the unyielding will of the unconquered.

➡️ Brahmani — four-faced, holding sacred texts and rosary, seated on a swan. She is wisdom incarnate — the mother of creation, the architect of all that is, was, and shall be.

➡️ Padmasana — seated upon a blooming lotus, calm as dawn, eyes closed in meditation. She is peace after battle, stillness after chaos — the heart of the cosmos beating softly.

➡️ Bees-hattha (Twenty-Armed Devi) — the ultimate avatar — twenty arms outstretched, each wielding weapon, symbol, or blessing. She is the totality of divine power — unstoppable, omniscient, omnipotent.

And look how they are arranged — not randomly, but like jewels set in a crown, each within her own arched alcove, framed by pillars of light, beneath golden canopies that shimmer like prayer flags in the wind. Dalchand's successor? Or perhaps a new master — whoever painted this knew: this is not decoration. This is devotion rendered in pigment.

The Rathores didn't merely worship these forms — they invoked them. Before battle, they whispered their names. In council, they sought their counsel. On coronation day, they offered garlands to their feet.

Because for them, the Goddess was not distant.

She rode beside them in war.

She danced with them in court.

She wept with them in grief.

She laughed with them in triumph.

And now — centuries later — she still rides.

Through this painting, she speaks:

"I am the blade that cuts through fear.
I am the lotus that blooms in mud.
I am the quiet strength behind every throne.
I am the rage that shatters empires.
I am the mother who births gods.
And I am yours."

So let your eyes linger — on the curve of a peacock's tail, the gleam of a trident, the serenity of a meditating goddess surrounded by chaos.

Because what you're witnessing isn't just art.

It's a pantheon walking among mortals.

It's divinity wearing color, movement, and majesty.

It's the ultimate declaration: The feminine is not soft — it is sovereign. Not gentle — it is glorious. Not passive — it is unstoppable.`,
        clues: [
          'Identify the nine different goddess forms',
          'Look for their respective animal vehicles',
          'Notice the arched alcove arrangement',
          'Find the twenty-armed ultimate goddess form'
        ],
        questions: [
          {
            question: "Which goddess is depicted with a jackal as her vehicle?",
            options: ["Chamunda", "Varahi", "Indrani", "Vaishnavi"],
            correct: 0,
            points: 350
          },
          {
            question: "How many arms does the ultimate goddess form have?",
            options: ["Twenty", "Eight", "Twelve", "Sixteen"],
            correct: 0,
            points: 330
          },
          {
            question: "What is the purpose of this painting series?",
            options: ["Spiritual invocation and protection", "Decorative art", "Historical recording", "Entertainment"],
            correct: 0,
            points: 320
          }
        ]
      }
    ],
    completionReward: 1200
  },
  {
    id: 'royal-hunts',
    title: 'Royal Hunts & Adventures',
    description: 'Experience the thrill of royal hunts and outdoor pursuits',
    difficulty: 'intermediate',
    audioFile: getAudioUrl('english', 'a9'),
    hindiAudioFile: getAudioUrl('hindi', 'a9'),
    videoFile: getVideoUrl('v9'),
    paintings: [
      {
        id: 'royal-hunt',
        title: 'Maharaja Takhat Singh on a Hunt with Royal Women',
        imageUrl: '/img/p9.png',
        story: `c. 1853 — Jodhpur. But this is no ordinary hunt.

This is a storm painted in gold, where lightning cracks not just across the sky — but across tradition itself.

Here, beneath a tempestuous heavenscape that bleeds emerald and indigo, Maharaja Takhat Singh leads not just men — but queens — into the wilds of Rajasthan's desert, guns blazing, camels charging, hearts pounding like war drums.

Forget what you think you know about royal women "staying behind."

Because here — in this electrifying masterpiece by Ali, court painter of Jodhpur — we witness something revolutionary: Royal ladies hunting alongside their king — armed, astride, unafraid.

At the center — radiant as a sunburst amid the chaos — rides Takhat Singh himself, his turban blazing crimson, his gaze fixed ahead like a predator scenting prey. He doesn't merely lead — he commands the elements. Behind him, the sky churns with thunderclouds, the wind whips dust into spirals, and yet... nothing slows them.

And beside him?

The Zenana — not as spectators, but as soldiers of grace.

They ride camels — majestic beasts born for desert storms — their robes billowing like banners of defiance. Each holds a toradar gun — short, deadly matchlocks designed for precision while mounted. No delicate fans or idle parasols here. These are weapons wielded with purpose — fingers steady, eyes sharp, souls alight with thrill.

Look closer — even the Maharaja's own matchlock bears a bayonet at its barrel's end. This isn't sport — it's ceremony of strength. A declaration that power doesn't rest only in palaces — it gallops across dunes, echoes through rifle cracks, and rises from the dust kicked up by camel hooves.

The composition? A whirlwind of motion. Ali arranges the figures like a living tapestry — riders swirling around the king, camels leaping over dunes, attendants scrambling to keep pace. It's not chaos — it's controlled fury. Every line, every curve, every splash of color screams energy, urgency, triumph.

And the landscape? Oh, the landscape!

Rolling hills bathed in eerie green light — as if nature herself has donned her finest jewels to honor the hunt. Trees bend under the gale, shadows stretch long and dark, and yet — there's no fear. Only exhilaration.

This painting shatters centuries of myth.

It says:

➡️ Women didn't watch hunts — they led them.
➡️ Silk wasn't meant for sitting — it was made for riding.
➡️ Jewelry wasn't decoration — it was armor.
➡️ Love of the chase wasn't male — it was royal.

These weren't passive princesses.

They were huntresses of legend — skilled marksmen, fearless riders, partners in conquest. Their presence transforms the hunt from mere pastime into ritual of unity — where gender dissolves before courage, and hierarchy bows before skill.

And Takhat Singh? He doesn't overshadow them — he elevates them. By placing them at his side, he declares: True royalty isn't measured by how many bow before you — but by who stands beside you when the storm breaks.

So let your eyes follow the arc of a raised toradar, the gleam of a bayonet catching lightning, the determined set of a queen's jaw as she aims true.

Because what you're witnessing isn't just sport.

It's a rebellion rendered in pigment and powder smoke.

It's power wearing silk and carrying steel.

It's the moment when tradition met thunder — and chose to ride into it, laughing.`,
        clues: [
          'Find the royal women hunting with firearms',
          'Look for the camels and dramatic landscape',
          'Notice the toradar guns with bayonets',
          'Identify the stormy sky setting'
        ],
        questions: [
          {
            question: "What type of guns are the royal women using in this hunt?",
            options: ["Toradar matchlocks", "British rifles", "Mughal cannons", "French pistols"],
            correct: 0,
            points: 280
          },
          {
            question: "Who was the artist of this hunting scene?",
            options: ["Ali", "Bulaki", "Amardas Bhatti", "Dalchand"],
            correct: 0,
            points: 260
          },
          {
            question: "What makes this hunting scene revolutionary?",
            options: ["Royal women participating actively", "Use of camels", "Stormy weather", "Large number of participants"],
            correct: 0,
            points: 240
          }
        ]
      }
    ],
    completionReward: 900
  },
  {
    id: 'court-culture',
    title: 'Court Culture & Intellectuals',
    description: 'Meet the scholars and artists who shaped Marwar\'s cultural legacy',
    difficulty: 'advanced',
    audioFile: getAudioUrl('english', 'a10'),
    hindiAudioFile: getAudioUrl('hindi', 'a10'),
    videoFile: getVideoUrl('v10'),
    paintings: [
      {
        id: 'bard-ishwardas',
        title: 'Portrait of Ishwardas - The Bard',
        imageUrl: '/img/p10.png',
        story: `Jodhpur, c. 1830 — Where poetry was power, and praise was priceless.

Look upon this man.

Not clad in armor. Not seated on a lion-throne. No sword at his hip, no crown upon his brow.

Yet... he holds more authority than any general.

He is Ishwardas — Charan. Poet. Chronicler. Keeper of bloodlines. Architect of legacy.

And in the court of Maharaja Man Singh — a ruler who knew that empires are built not only by conquest, but by memory — Ishwardas was not merely honored.

He was worshipped.

🐘 Hathi Siropav — A Gift From Head to Toe

Imagine this:

An elephant — majestic, slow-moving, draped in silk and gold — strides through the palace gates, bearing gifts not for war, but for word. For verse. For voice.

That was the hathi siropav — the royal gift bestowed upon Ishwardas — an honor so rare, so lavish, it shimmered like legend itself. An elephant? Yes. But also jewels that kissed his neck, robes that whispered royalty with every step, and coins that sang of devotion measured in lakhs.

Why?

Because Ishwardas didn't just write poems.

He wrote history.

He wove the lineage of the Rathores into epic verses — each syllable a thread in the tapestry of kingship. He sang the valor of ancestors, praised the virtue of the present ruler, and ensured that future generations would remember their roots — not as dry records, but as living, breathing sagas.

In a world where literacy was privilege and memory was currency, the Charan was the bank. The bard was the historian. The poet — the soul of the state.

🎨 Amardas Bhatti's Quiet Reverence

Observe how artist Amardas Bhatti frames him — not amidst chaos or ceremony, but in serene contemplation.

Seated cross-legged on a cushioned divan, one hand resting gently on his knee, the other poised as if mid-recitation — perhaps composing a hymn to Shiva, or penning another stanza glorifying Man Singh's reign.

Behind him, the cool blue archway opens to a garden — nature's quiet witness to human genius. A potted plant blooms beside him — life growing alongside art. Even the floor beneath him is patterned with stars — as if the cosmos itself bows to his talent.

This is no mere portrait.

It is a sacred space — where words are sacred, and the man who speaks them, divine.

💬 "To Praise a King Is to Shape His Immortality"

In Jodhpur, bards were not entertainers.

They were guardians of eternity.

Their verses echoed in palaces, stirred hearts in battlefields, and calmed souls in temples. They turned mortal rulers into mythic figures — and ensured that even when the last soldier fell, the last banner burned — the king's name would still ring true.

Ishwardas did not need a throne to command reverence.

His quill was his scepter.

His meter, his law.

His devotion, his kingdom.

So let us pause here — before this quiet figure, bathed in soft light and golden borders — and understand:

True power does not always roar. Sometimes, it rhymes.

Sometimes, it sings.

And sometimes — like Ishwardas — it sits calmly, knowing that its voice will outlive armies, outlast dynasties, and echo louder than any coronation drum.

For in the end, what survives?

Not the gold of the throne...

But the glory of the word.`,
        clues: [
          'Observe the serene contemplative pose',
          'Look for the garden background',
          'Notice the star-patterned floor',
          'Identify the elements showing his importance'
        ],
        questions: [
          {
            question: "What special honor was given to Ishwardas by the Maharaja?",
            options: ["Hathi Siropav (elephant gift)", "Gold crown", "Palace residence", "Military command"],
            correct: 0,
            points: 320
          },
          {
            question: "Who painted this portrait of Ishwardas?",
            options: ["Amardas Bhatti", "Bulaki", "Dalchand", "Ali"],
            correct: 0,
            points: 300
          },
          {
            question: "What was the primary role of bards in Rajput courts?",
            options: ["Preservers of history and lineage", "Military advisors", "Religious priests", "Tax collectors"],
            correct: 0,
            points: 280
          }
        ]
      }
    ],
    completionReward: 1100
  }
];

// Additional stories for the gallery view
export const additionalStories = [
  {
    id: 'polo-queens-gallery',
    title: 'Ladies Play Polo with Maharaja Takhat Singh',
    imageUrl: '/img/p6.png',
    story: `c. 1845–50 — Jodhpur. But this isn't just a game. This is a rebellion painted in gold leaf and horsehair...`,
    category: 'Royal Sports',
    era: 'c. 1845-50'
  },
  {
    id: 'abhai-singh-performance-gallery',
    title: 'Evening Performance for Maharaja Abhai Singh',
    imageUrl: '/img/p7.png',
    story: `c. 1725 — Jodhpur. But this is no ordinary night. This is a symphony painted in candlelight...`,
    category: 'Royal Patronage',
    era: 'c. 1725'
  },
  {
    id: 'nine-goddesses-gallery',
    title: 'Nine Forms of the Goddess',
    imageUrl: '/img/p8.png',
    story: `c. 1780–90 — Jodhpur. But this is no earthly court. This is the celestial throne room...`,
    category: 'Divine Power',
    era: 'c. 1780-90'
  },
  {
    id: 'royal-hunt-gallery',
    title: 'Maharaja Takhat Singh on a Hunt with Royal Women',
    imageUrl: '/img/p9.png',
    story: `c. 1853 — Jodhpur. But this is no ordinary hunt. This is a storm painted in gold...`,
    category: 'Royal Hunts',
    era: 'c. 1853'
  },
  {
    id: 'bard-ishwardas-gallery',
    title: 'Portrait of Ishwardas - The Bard',
    imageUrl: '/img/p10.png',
    story: `Jodhpur, c. 1830 — Where poetry was power, and praise was priceless...`,
    category: 'Court Culture',
    era: 'c. 1830'
  }
];

// Helper functions for the gallery
export const getFunFacts = (storyId) => {
  const facts = {
    'kannauj-city': [
      'Kannauj was known as the "City of Perfume" in ancient times',
      'The Rathore exile led to the founding of Jodhpur in 1459',
      'This painting was created 700 years after the actual exile'
    ],
    'man-singh-coronation': [
      'Coronations were called "Rajyabhisheka" in Rajput tradition',
      'The golden lion throne symbolized both power and protection',
      'Women played crucial roles in coronation ceremonies'
    ],
    'gaj-singh': [
      'Gaj Singh served under both Jahangir and Shah Jahan',
      'He brought Deccani art styles to Rajasthan',
      'His military campaigns expanded Marwar\'s influence'
    ],
    'ragini-gundakari': [
      'Ragamala paintings visualize musical modes as human emotions',
      'Each raga is associated with specific times and seasons',
      'These paintings were often used for meditation and worship'
    ],
    'zenana-durbar': [
      'The zenana was often the real seat of power in Rajput kingdoms',
      'Women in the zenana could own property and manage estates',
      'Some zenana women were trained in martial arts and administration'
    ],
    'polo-queens': [
      'Polo was originally a training exercise for cavalry units',
      'Royal women often played polo in segregated female teams',
      'The mallets used were often decorated with precious stones'
    ],
    'abhai-singh-performance': [
      'Musicians and dancers held high status in Rajput courts',
      'Many rulers were accomplished musicians themselves',
      'Court performances could last through the entire night'
    ],
    'nine-goddesses': [
      'The nine forms represent different aspects of cosmic energy',
      'Warriors would invoke these goddesses before battle',
      'Each goddess has specific weapons and animal vehicles'
    ],
    'royal-hunt': [
      'Hunts were military exercises disguised as sport',
      'Women participated in hunts to demonstrate their skills',
      'Successful hunts were seen as omens of good governance'
    ],
    'bard-ishwardas': [
      'Bards could criticize kings without punishment',
      'Their poems were considered historical documents',
      'Some bards were given land grants and royal privileges'
    ]
  };
  
  return facts[storyId] || ['This artwork reveals fascinating aspects of Rajput culture and history.'];
};

export const startQuiz = (story) => {
  console.log('Starting quiz for:', story.title);
  alert(`Quiz feature coming soon for: ${story.title}`);
};

export const shareStory = (story) => {
  if (navigator.share) {
    navigator.share({
      title: story.title,
      text: story.story.substring(0, 200) + '...',
      url: window.location.href,
    });
  } else {
    alert(`Share this amazing story: ${story.title}`);
  }
};