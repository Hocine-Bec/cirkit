import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-bg-primary via-accent/5 to-bg-primary">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold gradient-text">Stay in the loop</h2>
        <p className="text-text-secondary mt-2">
          Get notified about new products and exclusive deals
        </p>

        <div className="flex gap-3 mt-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            className="flex-1 px-4 py-3 rounded-xl bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
          <Button variant="primary" onClick={handleSubscribe}>
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
