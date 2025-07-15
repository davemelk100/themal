import { adminSessionStorage } from "./storage";

interface AdminSession {
  isAuthenticated: boolean;
  authTime: string;
}

export const checkAdminAuth = (): boolean => {
  try {
    const session = adminSessionStorage.getSession() as AdminSession | null;

    if (!session || !session.isAuthenticated || !session.authTime) {
      return false;
    }

    // Check if authentication is still valid (24 hour session)
    const currentTime = Date.now();
    const authTimestamp = parseInt(session.authTime);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (currentTime - authTimestamp > sessionDuration) {
      // Session expired, clear authentication
      logoutAdmin();
      return false;
    }

    // Refresh session timestamp if it's still valid (extends session on activity)
    if (currentTime - authTimestamp < sessionDuration) {
      const updatedSession: AdminSession = {
        isAuthenticated: session.isAuthenticated,
        authTime: currentTime.toString(),
      };
      adminSessionStorage.setSession(updatedSession);
    }

    return true;
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return false;
  }
};

export const logoutAdmin = (): void => {
  try {
    adminSessionStorage.clearSession();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getSessionInfo = (): {
  isActive: boolean;
  expiresAt: Date | null;
  timeRemaining: string;
} => {
  try {
    const session = adminSessionStorage.getSession() as AdminSession | null;

    if (!session || !session.isAuthenticated || !session.authTime) {
      return {
        isActive: false,
        expiresAt: null,
        timeRemaining: "Not logged in",
      };
    }

    const currentTime = Date.now();
    const authTimestamp = parseInt(session.authTime);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const expiresAt = new Date(authTimestamp + sessionDuration);
    const timeRemaining = expiresAt.getTime() - currentTime;

    if (timeRemaining <= 0) {
      return {
        isActive: false,
        expiresAt: null,
        timeRemaining: "Session expired",
      };
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      isActive: true,
      expiresAt,
      timeRemaining: `${hours}h ${minutes}m remaining`,
    };
  } catch (error) {
    console.error("Error getting session info:", error);
    return { isActive: false, expiresAt: null, timeRemaining: "Error" };
  }
};
