import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../utils/storage';
import { motion } from 'framer-motion';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !rollNumber.trim()) return;
    setUser({ name: name.trim(), email: email.trim().toLowerCase(), rollNumber: rollNumber.trim() });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">KRMU TALKS</h1>
          <p className="text-muted-foreground text-sm">Your campus. Your voice.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-3xl p-6 shadow-sm border border-border space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@krmu.edu"
              type="email"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Roll Number</label>
            <input
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="2024CSE001"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">
            Enter Campus
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Made with ❤️ for KRMU students
        </p>
      </motion.div>
    </div>
  );
}
