import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function UserNav() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1 }}
          >
            Sign In &rarr;
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { avatarBox: "w-9 h-9" },
          }}
        />
      </SignedIn>
    </>
  );
}
