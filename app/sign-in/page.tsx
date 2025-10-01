'use client';

import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';
import PublicHeader from '@/components/PublicHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function SignIn() {
  const handleGithubSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: 'github',
        callbackURL: `${process.env.SITE_URL}/parent`,
      },
      {
        onError: (ctx) => {
          console.log(ctx);
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at 0% 200px, #fce7f378, transparent),
            radial-gradient(circle 600px at 100% 200px, #fce7f378, transparent),
            radial-gradient(circle 600px at 0% calc(100% - 200px), #cee7f078, transparent),
            radial-gradient(circle 600px at 100% calc(100% - 200px), #fce7f378, transparent)
          `,
        }}
      />
      <div className="relative z-10">
        <PublicHeader />
        <main className="mx-auto max-w-4xl px-6 pt-40 min-h-auto">
          <section className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <Card className="rounded-xl border border-border bg-card shadow-sm">
                <CardHeader>
                  <Link href="/" className="w-full text-sm">
                    ← Back to home
                  </Link>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Sign in to your voice journal
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Capture your day, then wind down with a short bedtime story.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-xs text-muted-foreground">
                    We only use your account so your journal entries and stories
                    stay in sync across devices.
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                    className="grid gap-3"
                  >
                    <Button
                      type="button"
                      className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
                      onClick={handleGithubSignIn}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                        />
                      </svg>
                      Sign in with Github
                    </Button>

                    <div className="text-[11px] text-muted-foreground text-center">
                      Want details about how this works?
                      <a
                        href="/#faq"
                        className="underline underline-offset-2 ml-1"
                      >
                        See the FAQ
                      </a>
                      .
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <PublicFooter variant="floating" />
      </div>
    </div>
  );
}
