import { useUser } from "@clerk/clerk-react";

const ALPHABET = "2345679ABCDEFGHJKMNPQRSTUVWXYZ";

function checksumSegment(seg1: string, seg2: string): string {
  let hash = 0;
  const combined = seg1 + seg2;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i) * (i + 1)) >>> 0;
  }
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += ALPHABET[hash % ALPHABET.length];
    hash = Math.floor(hash / ALPHABET.length);
  }
  return result;
}

/** Derive a deterministic THEEMEL license key from a stable user ID. */
function deriveKey(userId: string): string {
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  }

  let seg1 = "";
  for (let i = 0; i < 4; i++) {
    seg1 += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }

  h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (h * 37 + userId.charCodeAt(i) * (i + 3)) >>> 0;
  }

  let seg2 = "";
  for (let i = 0; i < 4; i++) {
    seg2 += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }

  const seg3 = checksumSegment(seg1, seg2);
  return `THEEMEL-${seg1}-${seg2}-${seg3}`;
}

interface SubscriptionState {
  isPro: boolean;
  licenseKey: string | undefined;
  isLoaded: boolean;
  user: ReturnType<typeof useUser>["user"];
}

export function useSubscription(): SubscriptionState {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return { isPro: false, licenseKey: undefined, isLoaded: false, user: null };
  }

  const plan = user ? (user.publicMetadata as { plan?: string }).plan : undefined;
  const isPro = plan === "pro";
  const licenseKey = isPro && user ? deriveKey(user.id) : undefined;

  return { isPro, licenseKey, isLoaded, user: user ?? null };
}
