// Centralized story data - simulates a real database
export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: any; // Can be require() or { uri: string }
  audioUrl: string;
  duration: string;
  tag: string; // Legacy single tag
  tags: string[]; // Multiple tags for filtering
  category: string;
  narrator: string;
  textContent: string; // Full story text for TTS audio generation
}

// Available tags for filtering
export const AVAILABLE_TAGS = [
  { id: 'bedtime', label: '🌙 Bedtime', color: '#7b68ee' },
  { id: 'adventure', label: '🗺️ Adventure', color: '#ff6b6b' },
  { id: 'animals', label: '🐾 Animals', color: '#4ecdc4' },
  { id: 'magic', label: '✨ Magic', color: '#f7b731' },
  { id: 'bravery', label: '💪 Bravery', color: '#eb3b5a' },
  { id: 'kindness', label: '💝 Kindness', color: '#fc5c65' },
  { id: 'lessons', label: '📚 Life Lessons', color: '#45aaf2' },
  { id: 'funny', label: '😄 Funny', color: '#fed330' },
  { id: 'fairy-tale', label: '👸 Fairy Tale', color: '#a55eea' },
  { id: 'short', label: '⏱️ Quick Read', color: '#26de81' },
] as const;

export type TagId = typeof AVAILABLE_TAGS[number]['id'];

export const STORIES: Story[] = [
  // ============================================
  // CLASSIC STORIES (10 child-friendly versions)
  // ============================================
  {
    id: 'three-little-pigs',
    title: 'The Three Little Pigs',
    description: 'Three brothers build their houses and learn an important lesson about hard work.',
    coverImage: require('@/assets/images/story-three-pigs.jpg'),
    audioUrl: '',
    duration: '5:00',
    tag: 'classics',
    tags: ['animals', 'lessons', 'bravery'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, there were three little pigs who left home to build their own houses. The first little pig built his house out of straw because it was quick and easy. The second little pig built his house out of sticks, which took a bit longer. But the third little pig worked very hard and built his house out of strong bricks, even though it took many days.

One day, a big bad wolf came to the straw house and said, "Little pig, little pig, let me in!" When the pig refused, the wolf huffed and puffed and blew the house down! The scared pig ran to his brother's stick house. But the wolf followed and blew that house down too! Both pigs ran as fast as they could to their brother's brick house.

The wolf tried his hardest to blow down the brick house, but no matter how much he huffed and puffed, it wouldn't fall. The three little pigs were safe inside! The wolf finally gave up and went away, never to bother them again. From that day on, all three pigs lived happily together in the strong brick house, and they learned that hard work always pays off in the end.`,
  },
  {
    id: 'little-red-riding-hood',
    title: 'Little Red Riding Hood',
    description: 'A young girl visits her grandmother and learns to be careful in the forest.',
    coverImage: require('@/assets/images/story-red-riding-hood.jpg'),
    audioUrl: '',
    duration: '5:00',
    tag: 'classics',
    tags: ['adventure', 'lessons', 'bravery', 'fairy-tale'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, there was a sweet little girl who always wore a beautiful red hood, so everyone called her Little Red Riding Hood. One sunny day, her mother asked her to take a basket of treats to her grandmother who lived in a cottage in the forest. "Stay on the path and don't talk to strangers," her mother said, and Little Red Riding Hood promised she would.

As she walked through the forest, a sly wolf spotted her and asked where she was going. Little Red Riding Hood forgot her mother's warning and told him about her grandmother. The wolf raced ahead to grandmother's house, but when he got there, grandmother was out picking flowers. So the wolf dressed up in grandmother's clothes and waited in bed.

When Little Red Riding Hood arrived, she noticed something was different about her grandmother. "What big eyes you have! What big ears you have! What big teeth you have!" she said. Just then, a kind woodcutter heard her voice and came to help. He chased the wolf far away into the forest. Grandmother came home safely, and they all shared the treats together. Little Red Riding Hood learned to always listen to her mother's wise advice.`,
  },
  {
    id: 'goldilocks',
    title: 'Goldilocks and the Three Bears',
    description: 'A curious girl explores a cozy cottage and meets a friendly bear family.',
    coverImage: require('@/assets/images/story-goldilocks.jpg'),
    audioUrl: '',
    duration: '5:00',
    tag: 'classics',
    tags: ['animals', 'adventure', 'funny', 'lessons'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, a little girl named Goldilocks was walking through the forest when she discovered a cozy cottage. She knocked on the door, but no one answered because the three bears who lived there had gone for a walk while their porridge cooled. Curious Goldilocks pushed open the door and went inside.

On the table, she found three bowls of porridge. Papa Bear's porridge was too hot. Mama Bear's porridge was too cold. But Baby Bear's porridge was just right, so she ate it all up! Then she tried sitting in their chairs. Papa's was too hard, Mama's was too soft, but Baby Bear's was just right—until it broke! Feeling sleepy, she went upstairs and tried the beds. Baby Bear's bed was just right, and she fell fast asleep.

Soon, the three bears came home and found their porridge eaten, their chairs moved, and little Goldilocks sleeping in Baby Bear's bed! Goldilocks woke up, saw the bears, and was so surprised that she jumped out the window and ran all the way home. The bears weren't angry—they just wished she had waited to meet them properly. Goldilocks learned to always ask permission before using things that don't belong to her.`,
  },
  {
    id: 'tortoise-and-hare',
    title: 'The Tortoise and the Hare',
    description: 'A slow tortoise challenges a speedy hare to a surprising race.',
    coverImage: require('@/assets/images/story-tortoise-hare.jpg'),
    audioUrl: '',
    duration: '4:00',
    tag: 'fables',
    tags: ['animals', 'lessons', 'funny', 'short'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, there was a hare who loved to brag about how fast he could run. He would tease all the other animals, especially the slow tortoise. One day, the tortoise had enough and said, "I challenge you to a race!" All the animals laughed, but the hare agreed, thinking it would be an easy win.

The race began, and the hare zoomed ahead so fast that the tortoise was just a tiny speck behind him. "This is too easy," laughed the hare. "I have plenty of time for a little nap." So he lay down under a shady tree and fell fast asleep. Meanwhile, the tortoise kept walking slowly and steadily, never stopping, never giving up, putting one foot in front of the other.

The hare slept for a long time. When he finally woke up, he stretched and yawned, then looked toward the finish line. To his shock, the tortoise was almost there! The hare ran as fast as he could, but it was too late. The tortoise crossed the finish line first! All the animals cheered for the tortoise, who smiled and said, "Slow and steady wins the race." The hare learned never to be too proud or to underestimate others.`,
  },
  {
    id: 'jack-and-beanstalk',
    title: 'Jack and the Beanstalk',
    description: 'A young boy climbs a magical beanstalk to a land high in the clouds.',
    coverImage: require('@/assets/images/story-jack-beanstalk.jpg'),
    audioUrl: '',
    duration: '6:00',
    tag: 'adventure',
    tags: ['adventure', 'magic', 'bravery', 'fairy-tale'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, a boy named Jack lived with his mother in a tiny cottage. They were very poor and had nothing left but their old cow. "Take the cow to market and sell her," his mother said. On the way, Jack met a strange old man who offered him magic beans for the cow. Jack couldn't resist and made the trade. When he got home, his mother was so upset that she threw the beans out the window.

The next morning, Jack woke up to find an enormous beanstalk growing outside his window, stretching up through the clouds! Brave Jack climbed and climbed until he reached a magnificent castle in the sky. Inside lived a giant who had a goose that laid golden eggs. Jack waited until the giant fell asleep, then carefully took the goose and climbed back down the beanstalk as fast as he could.

When the giant woke up and discovered his goose was gone, he chased Jack down the beanstalk! But Jack was too quick. As soon as he reached the ground, he grabbed an axe and chopped down the beanstalk. The giant tumbled away, never to be seen again. With the golden eggs, Jack and his mother never had to worry about money again, and they lived happily ever after.`,
  },
  {
    id: 'cinderella',
    title: 'Cinderella',
    description: 'A kind girl with a magical fairy godmother finds her happily ever after.',
    coverImage: require('@/assets/images/story-cinderella.jpg'),
    audioUrl: '',
    duration: '6:00',
    tag: 'fairy tales',
    tags: ['magic', 'kindness', 'fairy-tale'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, there lived a kind and beautiful girl named Cinderella. After her father passed away, she lived with her stepmother and two stepsisters who were very unkind to her. They made her do all the chores while they wore fine clothes and went to parties. One day, the prince announced a grand ball, and Cinderella wished with all her heart that she could go too.

That night, as Cinderella sat crying by the fireplace, a wonderful fairy godmother appeared! With a wave of her magic wand, she turned a pumpkin into a golden carriage, mice into horses, and Cinderella's rags into the most beautiful gown with sparkling glass slippers. "Go to the ball," said the fairy godmother, "but you must return before midnight, for that's when the magic ends!"

At the ball, Cinderella danced with the prince all night long. They fell in love at first sight! But when the clock struck midnight, Cinderella had to run away, leaving behind only one glass slipper on the palace steps. The prince searched the entire kingdom for the girl whose foot fit the slipper. When he finally found Cinderella, he knew she was the one. They were married and lived happily ever after, and Cinderella was always kind to everyone, even her stepsisters.`,
  },
  {
    id: 'ugly-duckling',
    title: 'The Ugly Duckling',
    description: 'A little bird who feels different discovers he is beautiful just as he is.',
    coverImage: require('@/assets/images/story-ugly-duckling.jpg'),
    audioUrl: '',
    duration: '5:00',
    tag: 'classics',
    tags: ['animals', 'kindness', 'lessons'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, on a peaceful farm, a mother duck sat on her nest waiting for her eggs to hatch. One by one, fuzzy yellow ducklings popped out. But the last egg was bigger, and when it finally cracked open, out came a duckling who looked very different. He was gray and clumsy, and the other animals called him the "ugly duckling." This made him very sad.

The poor little duckling felt so lonely that he ran away from the farm. Through the long, cold winter, he wandered alone, hiding in marshes and ponds. He dreamed of having friends who would accept him. When spring finally came, he saw a group of beautiful white swans gliding across a lake. He wished he could be as graceful as them, but he was afraid they would laugh at him too.

Gathering his courage, the duckling swam toward the swans. As he lowered his head sadly, he caught his reflection in the water and gasped! He wasn't an ugly duckling at all—he had grown into a beautiful white swan! The other swans welcomed him with open wings. He finally understood that he had been special all along. From that day on, he was the happiest swan on the lake, and he was always kind to anyone who felt different.`,
  },
  {
    id: 'hansel-and-gretel',
    title: 'Hansel and Gretel',
    description: 'Two brave siblings find their way home from a forest adventure.',
    coverImage: require('@/assets/images/story-hansel-gretel.jpg'),
    audioUrl: '',
    duration: '6:00',
    tag: 'adventure',
    tags: ['adventure', 'bravery', 'fairy-tale'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, two children named Hansel and Gretel lived at the edge of a great forest with their father, a poor woodcutter. One day, they wandered too deep into the forest and couldn't find their way home. They walked and walked until they discovered an amazing sight—a little cottage made entirely of candy and gingerbread! Hungry from their journey, they began to nibble on the house.

The door opened and out came an old woman who seemed very kind. "Come in, come in, dear children," she said with a sweet smile. But the old woman was actually a tricky witch! She locked Hansel in a cage and made Gretel do chores, planning to keep them forever. But Hansel and Gretel were very clever. They whispered plans to each other when the witch wasn't looking.

One day, when the witch wasn't paying attention, brave Gretel tricked her and locked her in her own pantry! Then she freed Hansel, and together they found a trail of pretty stones that led them all the way back home. Their father was overjoyed to see them and promised they would never be separated again. Hansel and Gretel learned that by being brave and working together, they could overcome any challenge.`,
  },
  {
    id: 'lion-and-mouse',
    title: 'The Lion and the Mouse',
    description: 'A tiny mouse proves that even the smallest friend can make a big difference.',
    coverImage: require('@/assets/images/story-lion-mouse.jpg'),
    audioUrl: '',
    duration: '3:00',
    tag: 'fables',
    tags: ['animals', 'kindness', 'lessons', 'short'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, a mighty lion was taking a nap in the warm sunshine when a tiny mouse accidentally ran across his nose. The lion woke up with a ROAR and caught the little mouse in his huge paw. "Please don't eat me!" squeaked the mouse. "If you let me go, I promise to help you someday." The lion laughed at the idea of a tiny mouse helping him, but he was feeling kind, so he let the mouse go.

A few days later, the lion was walking through the forest when he got caught in a hunter's net. He roared and struggled, but he couldn't break free. The more he fought, the more tangled he became. He was trapped and didn't know what to do. His mighty roars echoed through the forest.

The little mouse heard the lion's cries and came running as fast as her tiny legs could carry her. She began to gnaw on the ropes with her sharp little teeth. Nibble, nibble, nibble—one by one, the ropes snapped until the lion was free! The lion was amazed and grateful. "Thank you, little friend," he said gently. "I've learned that no act of kindness is ever wasted, and even the smallest friend can be the greatest helper."`,
  },
  {
    id: 'emperors-new-clothes',
    title: "The Emperor's New Clothes",
    description: 'A vain emperor learns an important lesson about honesty and pride.',
    coverImage: require('@/assets/images/story-emperor.jpg'),
    audioUrl: '',
    duration: '5:00',
    tag: 'fables',
    tags: ['funny', 'lessons'],
    category: 'Classic Tales',
    narrator: 'Your Voice',
    textContent: `Once upon a time, there was an emperor who loved fancy clothes more than anything else in the world. He had a different outfit for every hour of the day! One day, two tricky tailors came to the palace and said, "We can make you the most magnificent clothes in the world—clothes so special that only wise people can see them. Foolish people will see nothing at all." The vain emperor gave them bags of gold to make this magical outfit.

The tailors pretended to work for many days, but they weren't making anything at all! When the emperor's helpers came to check on the clothes, they saw nothing—but they were afraid to say so because they didn't want to seem foolish. "How beautiful!" they lied. Even the emperor, when he looked in the mirror and saw nothing, was too proud to admit it. "Magnificent!" he declared, and he decided to wear his "new clothes" in a grand parade.

The emperor marched through the streets in his underwear, and all the grown-ups clapped and cheered, pretending to see beautiful clothes. But then a little child called out, "The emperor has no clothes on!" Everyone began to laugh, and the emperor realized he had been tricked by his own pride. From that day on, he learned to value honesty over flattery, and he always listened to the truth, even when it was hard to hear.`,
  },

  // ============================================
  // ORIGINAL STORIES (keeping existing ones)
  // ============================================
  {
    id: 'i-can-fly',
    title: 'I Can Fly',
    description: 'You can be anything you want',
    coverImage: require('@/assets/images/icanfly.png'),
    audioUrl: 'https://drive.google.com/file/d/1Wam5mj0zToXGkD7hX2GNNIbubRHCCmp-/view?usp=sharing',
    duration: '2:06',
    tag: 'dreamland',
    tags: ['bedtime', 'animals', 'bravery', 'magic'],
    category: 'Bedtime Stories',
    narrator: 'Pat Zimmerman',
    textContent: `Once upon a time, there was a little bird who dreamed of flying higher than any bird had ever flown before. Every day, she would watch the clouds float by and imagine what it would be like to touch them. The other birds told her it was impossible, but she never stopped believing.

One morning, she spread her wings and began to fly. Higher and higher she went, past the treetops, past the hills, until she was soaring among the fluffy white clouds. She danced through the sky, twirling and spinning with pure joy.

When she returned to earth, all the other birds gathered around in amazement. "How did you do it?" they asked. The little bird smiled and said, "I believed I could, so I did." From that day on, all the birds in the forest knew that with courage and belief, you can be anything you want to be.`,
  },
  {
    id: 'moonlight-lullaby',
    title: 'Moonlight Lullaby',
    description: 'A gentle song under the stars that guides children to peaceful sleep.',
    coverImage: require('@/assets/images/story-peter.png'),
    audioUrl: '',
    duration: '8:00',
    tag: 'sleepy winds',
    tags: ['bedtime', 'magic'],
    category: 'Bedtime Stories',
    narrator: 'Starlight Voice',
    textContent: `High above the sleeping town, the moon began to sing a gentle lullaby. Her soft silver light drifted down through bedroom windows, wrapping children in warmth and peace. The stars twinkled along to the melody, each one adding its own tiny sparkle to the song.

In cozy beds across the land, little ones felt their eyes grow heavy. The moon's song told of peaceful dreams waiting just beyond the edge of sleep—dreams of floating on clouds, of friendly animals, and of magical adventures that would greet them in the morning.

As the lullaby continued, every child drifted off to dreamland, safe and loved. The moon smiled down at them all, promising to watch over them through the night until the sun came up to start a brand new day full of wonder and play.`,
  },
  {
    id: 'sleepy-forest',
    title: 'The Sleepy Forest',
    description: 'Join the forest animals as they prepare for a cozy night of sleep.',
    coverImage: require('@/assets/images/story-mystery.png'),
    audioUrl: '',
    duration: '12:00',
    tag: 'cozy house',
    tags: ['bedtime', 'animals'],
    category: 'Bedtime Stories',
    narrator: 'Forest Voice',
    textContent: `As the sun painted the sky in shades of orange and pink, all the animals in the Sleepy Forest began to yawn. The little rabbits hopped back to their burrow, the squirrels curled up in their tree houses, and the deer found soft spots among the ferns to rest their tired legs.

The wise old owl hooted softly, letting everyone know it was time for sleep. Fireflies lit up like tiny lanterns, creating a magical path of light through the darkening woods. Even the busy bees had returned to their hives, humming a drowsy tune.

One by one, the forest creatures closed their eyes. The trees swayed gently in the evening breeze, whispering goodnight to each and every animal. And as the first stars appeared in the sky, the Sleepy Forest became perfectly peaceful, dreaming together under the watchful moon.`,
  },
  {
    id: 'alice-in-wonderland',
    title: 'Alice in Wonderland',
    description: 'Follow Alice down the rabbit hole into a world of wonder and curiosity.',
    coverImage: require('@/assets/images/story-alice.png'),
    audioUrl: '',
    duration: '15:00',
    tag: 'classics',
    tags: ['adventure', 'magic', 'funny', 'fairy-tale'],
    category: 'Abridged Classics',
    narrator: 'Classic Voice',
    textContent: `One sunny afternoon, a curious girl named Alice was sitting by the riverbank when she spotted a white rabbit wearing a waistcoat and carrying a pocket watch. "I'm late! I'm late!" the rabbit cried, hopping toward a hole in the ground. Without thinking twice, Alice followed him and tumbled down, down, down into a magical place called Wonderland.

In Wonderland, everything was topsy-turvy and wonderfully strange. Alice met a grinning Cheshire Cat who could disappear, a sleepy Dormouse, and the Mad Hatter who threw the silliest tea party she had ever seen. She grew tall as a house and small as a mouse, all from eating magical treats and drinking curious potions.

Alice had the most extraordinary adventure, meeting playing cards that could walk and talk, and even a Queen who loved to shout. But when it was time to wake up, Alice found herself back by the riverbank, wondering if it had all been a dream. She smiled, knowing that in her imagination, she could visit Wonderland whenever she wished.`,
  },
];

// Helper function to get stories by category
export function getStoriesByCategory(category: string): Story[] {
  return STORIES.filter(story => story.category === category);
}

// Helper function to get a story by ID
export function getStoryById(id: string): Story | undefined {
  return STORIES.find(story => story.id === id);
}

// Get all unique categories
export function getCategories(): string[] {
  return [...new Set(STORIES.map(story => story.category))];
}

// Group stories by category
export function getStoriesGroupedByCategory(): { category: string; stories: Story[] }[] {
  const categories = getCategories();
  return categories.map(category => ({
    category,
    stories: getStoriesByCategory(category),
  }));
}

// Get only classic tales (the 10 new stories)
export function getClassicTales(): Story[] {
  return STORIES.filter(story => story.category === 'Classic Tales');
}

// Get "Ready to Hear" stories - pre-recorded by real people (have audioUrl)
export function getReadyToHearStories(): Story[] {
  return STORIES.filter(story => story.audioUrl && story.audioUrl.length > 0);
}

// Get stories for voice cloning (no pre-recorded audio)
export function getVoiceCloningStories(): Story[] {
  return STORIES.filter(story => !story.audioUrl || story.audioUrl.length === 0);
}

// Get stories by tag
export function getStoriesByTag(tagId: string): Story[] {
  return STORIES.filter(story => story.tags.includes(tagId));
}

// Get tag info by ID
export function getTagById(tagId: string) {
  return AVAILABLE_TAGS.find(tag => tag.id === tagId);
}

// Export all stories for search
export const ALL_STORIES = STORIES;
