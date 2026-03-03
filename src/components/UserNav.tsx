import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function UserNav() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className="rounded-lg px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            Sign in
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
