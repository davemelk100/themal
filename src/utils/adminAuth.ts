export const checkAdminAuth = (): boolean => {
  try {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    const authTime = localStorage.getItem("adminAuthTime");

    if (!isAuthenticated || !authTime) {
      return false;
    }

    // Check if authentication is still valid (24 hour session)
    const currentTime = Date.now();
    const authTimestamp = parseInt(authTime);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (currentTime - authTimestamp > sessionDuration) {
      // Session expired, clear authentication
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("adminAuthTime");
      return false;
    }

    // Refresh session timestamp if it's still valid (extends session on activity)
    if (currentTime - authTimestamp < sessionDuration) {
      localStorage.setItem("adminAuthTime", currentTime.toString());
    }

    return true;
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return false;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem("adminAuthenticated");
  localStorage.removeItem("adminAuthTime");
};

export const getSessionInfo = (): {
  isActive: boolean;
  expiresAt: Date | null;
  timeRemaining: string;
} => {
  try {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    const authTime = localStorage.getItem("adminAuthTime");

    if (!isAuthenticated || !authTime) {
      return {
        isActive: false,
        expiresAt: null,
        timeRemaining: "Not logged in",
      };
    }

    const currentTime = Date.now();
    const authTimestamp = parseInt(authTime);
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
