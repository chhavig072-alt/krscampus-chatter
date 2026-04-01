export const seedPosts = [
  {
    id: '1',
    username: 'Aarav Sharma',
    email: 'aarav@krmu.edu',
    caption: 'Amazing sunset view from the campus rooftop! 🌅 Nothing beats this vibe after a long day of lectures.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    likes: ['priya@krmu.edu', 'rohan@krmu.edu'],
    comments: [
      { username: 'Priya Verma', email: 'priya@krmu.edu', text: 'This is gorgeous! 😍' },
      { username: 'Rohan Gupta', email: 'rohan@krmu.edu', text: 'Need to check this spot out' },
    ],
    poll: null,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    username: 'Priya Verma',
    email: 'priya@krmu.edu',
    caption: 'Which club should host the next campus fest?',
    image: null,
    likes: ['aarav@krmu.edu'],
    comments: [],
    poll: {
      options: [
        { text: 'Tech Club', votes: ['aarav@krmu.edu', 'rohan@krmu.edu'] },
        { text: 'Cultural Club', votes: ['priya@krmu.edu'] },
        { text: 'Sports Club', votes: [] },
        { text: 'Art Club', votes: ['neha@krmu.edu'] },
      ],
    },
    createdAt: Date.now() - 7200000,
  },
  {
    id: '3',
    username: 'Rohan Gupta',
    email: 'rohan@krmu.edu',
    caption: 'Just finished my final year project presentation! 🎉 Feeling relieved and proud.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
    likes: ['aarav@krmu.edu', 'priya@krmu.edu', 'neha@krmu.edu'],
    comments: [
      { username: 'Aarav Sharma', email: 'aarav@krmu.edu', text: 'Congrats bro! 🎊' },
    ],
    poll: null,
    createdAt: Date.now() - 14400000,
  },
  {
    id: '4',
    username: 'Neha Singh',
    email: 'neha@krmu.edu',
    caption: 'Coffee + coding = perfect combo ☕💻',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    likes: [],
    comments: [],
    poll: null,
    createdAt: Date.now() - 28800000,
  },
  {
    id: '5',
    username: 'Aarav Sharma',
    email: 'aarav@krmu.edu',
    caption: 'Best canteen food today? 🍕',
    image: null,
    likes: ['neha@krmu.edu'],
    comments: [{ username: 'Neha Singh', email: 'neha@krmu.edu', text: 'Definitely the paneer roll!' }],
    poll: {
      options: [
        { text: 'Paneer Roll', votes: ['neha@krmu.edu', 'priya@krmu.edu'] },
        { text: 'Pasta', votes: ['aarav@krmu.edu'] },
        { text: 'Maggi', votes: ['rohan@krmu.edu'] },
      ],
    },
    createdAt: Date.now() - 43200000,
  },
];

export function initializePosts() {
  const existing = localStorage.getItem('krmu_posts');
  if (!existing) {
    localStorage.setItem('krmu_posts', JSON.stringify(seedPosts));
  }
}
