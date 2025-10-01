'use client';

import { useQuery } from 'convex/react';
import { ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/convex/_generated/api';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';

export function UserAvatar() {
  const router = useRouter();
  const userData = useQuery(api.auth.getCurrentUser);

  if (!userData) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={'secondary'}
          size="sm"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-full bg-white"
        >
          {userData && (
            <Avatar className="size-7 rounded-lg">
              <AvatarImage
                src={userData.image ?? ''}
                alt={userData.name ?? ''}
              />
              <AvatarFallback className="rounded-lg">
                {userData.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            {userData && (
              <Avatar className="size-7 rounded-lg">
                <AvatarImage
                  src={userData.image ?? ''}
                  alt={userData.name ?? ''}
                />
                <AvatarFallback className="rounded-lg">
                  {userData.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userData.name}</span>
              <span className="truncate text-xs">{userData.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles /> Usage - {userData.usage}/2
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            try {
              await authClient.signOut();
            } finally {
              router.replace('/sign-in');
              router.refresh();
            }
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
