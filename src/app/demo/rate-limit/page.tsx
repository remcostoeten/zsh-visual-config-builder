'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { RateLimitService } from '@/services/rate-limit-service';
import { RateLimitTimer } from '@/features/rate-limit/components/rate-limit-timer';
import { RATE_LIMIT } from '@/features/rate-limit/constants';

const rateLimitService = new RateLimitService();

export default function RateLimitDemo() {
  const { data: session } = useSession();
  const [loginBlocked, setLoginBlocked] = useState(false);
  const [loginWaitTime, setLoginWaitTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  const [likeBlocked, setLikeBlocked] = useState(false);
  const [likeWaitTime, setLikeWaitTime] = useState(0);

  const handleLoginAttempt = async () => {
    const result = await rateLimitService.checkLoginAttempt(
      'demo-user',
      session?.user?.email
    );
    setLoginBlocked(!result.allowed);
    setLoginWaitTime(result.waitTime);
    setAttempts(prev => prev + 1);
  };

  const handleLikeAction = async () => {
    const result = await rateLimitService.checkActionLimit(
      'demo-post-1',
      session?.user?.id,
      session?.user?.email
    );
    setLikeBlocked(!result.allowed);
    setLikeWaitTime(result.waitTime);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Rate Limit Demonstrations</h1>

      {/* Login Rate Limit Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Login Rate Limiting</h2>
        <p className="text-muted-foreground">
          Demonstrates login rate limiting: {RATE_LIMIT.LOGIN.MAX_ATTEMPTS} attempts
          within {RATE_LIMIT.LOGIN.WINDOW_MINUTES} minutes before a {RATE_LIMIT.LOGIN.LOCKOUT_MINUTES} minute lockout.
        </p>
        
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm text-muted-foreground">
              Attempts: {attempts}/{RATE_LIMIT.LOGIN.MAX_ATTEMPTS}
            </span>
          </div>
          
          {loginBlocked ? (
            <RateLimitTimer
              waitTimeMs={loginWaitTime}
              onComplete={() => {
                setLoginBlocked(false);
                setAttempts(0);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={handleLoginAttempt}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Simulate Login Attempt
            </button>
          )}
        </div>
      </section>

      {/* Like Action Rate Limit Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Like Action Rate Limiting</h2>
        <p className="text-muted-foreground">
          Demonstrates one-time action limiting with a {RATE_LIMIT.LIKE_ACTION.COOLDOWN_DAYS} day cooldown period.
          Uses browser fingerprinting to prevent circumvention.
        </p>
        
        <div className="flex flex-col gap-4">
          {likeBlocked ? (
            <RateLimitTimer
              waitTimeMs={likeWaitTime}
              onComplete={() => setLikeBlocked(false)}
            />
          ) : (
            <button
              type="button"
              onClick={handleLikeAction}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Like Post
            </button>
          )}
        </div>
      </section>

      {/* Reset Demo */}
      <section className="pt-8">
        <button
          type="button"
          onClick={() => {
            rateLimitService.resetLoginAttempts('demo-user');
            setLoginBlocked(false);
            setAttempts(0);
            setLikeBlocked(false);
            window.location.reload();
          }}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Reset Demo
        </button>
      </section>
    </div>
  );
}