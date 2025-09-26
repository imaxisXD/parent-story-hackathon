'use client';
import { Authenticated, AuthLoading } from 'convex/react';

import ParentPageSkeleton from '@/components/ParentPageSkeleton';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
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
          {children}
        </div>
      </Authenticated>
      <AuthLoading>
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
          <ParentPageSkeleton />
        </div>
      </AuthLoading>
    </>
  );
}

// function redirectToSignIn() {
//   const { isLoading, isAuthenticated } = useConvexAuth();
//   if (isLoading) {
//     console.log('isLoading', isLoading);
//     return null;
//   }
//   // if (isAuthenticated) {
//   //   redirect('/parent');
//   // }
//   redirect('/sign-in');
//   return null;
// }
