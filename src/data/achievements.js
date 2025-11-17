export const achievementsData = [
  {
    id: 'first_case',
    title: 'First Investigation',
    description: 'Complete your first historical case',
    icon: '🕵️',
    unlockCondition: () => true, // Will be implemented with actual logic
    getProgress: () => 0
  },
  {
    id: 'quick_solver',
    title: 'Quick Thinker',
    description: 'Solve a case in under 5 minutes',
    icon: '⚡',
    unlockCondition: () => false,
    getProgress: () => 25
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a case without using any hints',
    icon: '🎯',
    unlockCondition: () => false,
    getProgress: () => 50
  },
  {
    id: 'historian',
    title: 'Junior Historian',
    description: 'Complete 5 different historical cases',
    icon: '📚',
    unlockCondition: () => false,
    getProgress: () => 20
  },
  {
    id: 'art_expert',
    title: 'Art Expert',
    description: 'Achieve perfect scores on all art-related cases',
    icon: '🎨',
    unlockCondition: () => false,
    getProgress: () => 10
  },
  {
    id: 'royal_specialist',
    title: 'Royal Specialist',
    description: 'Solve all royal family related cases',
    icon: '👑',
    unlockCondition: () => false,
    getProgress: () => 30
  }
];