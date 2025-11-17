 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'Login failed');
        return;
      }

      // If Supabase returned a session, sync it to our server so server-side pages see the auth cookie
      const accessToken = (data as any)?.session?.access_token;
      if (accessToken) {
        const res = await fetch('/api/auth/sync', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error || 'Failed to sync session');
          return;
        }
      }

      const role = (data.user?.user_metadata as any)?.role || 'student';
      router.push(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student');
    } catch (error) {
      const msg = (error as any)?.message || 'An error occurred';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMagicLink() {
    if (!email) return setError('Enter your email to receive a sign-in link');
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        setError(error.message || 'Could not send sign-in link');
        return;
      }
      setError('Magic sign-in link sent — check your email');
    } catch (err) {
      setError('Could not send sign-in link');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your student assignment account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded">{error}</div>}
            
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
            {/* Show magic link action when error indicates confirmation required */}
            {error?.toLowerCase().includes('confirm') && (
              <div className="mt-2">
                <button type="button" className="w-full bg-secondary text-white py-2 rounded" onClick={handleSendMagicLink} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send sign-in link'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t space-y-2 text-xs text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Student: student@example.com / Student123!</p>
            <p>Teacher: teacher@example.com / Teacher123!</p>
            <p>Admin: admin@example.com / Admin123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
