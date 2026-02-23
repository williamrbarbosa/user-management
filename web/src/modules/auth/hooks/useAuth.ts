import { useAppStore } from "@/store";
import { authService, LoginPayload } from "../auth.service";
import { useAuthStore } from "../stores/auth.store";
import { ApiError } from "@/services/api";

export function useAuth() {
  const setSession = useAuthStore((s) => s.setSession);
  const terminateSession = useAuthStore((s) => s.terminateSession);
  const { setToast, setLoader } = useAppStore();

  async function login(payload: LoginPayload): Promise<boolean> {
    try {
      setLoader(true);

      const response = await authService.login(payload);

      setLoader(false);

      if (response && (response.status === 200 || response.status === 204)) {
        const { tokenType, accessToken, sessionId, user } = response.data;
        if (accessToken) {
          const finalToken = `${tokenType} ${accessToken}`;
          setSession(finalToken, sessionId, user);
        }

        return true;
      }
      return false;
    } catch (err) {
      const error = err as ApiError;

      setLoader(false);
      setToast({
        show: true,
        type: "error",
        message: error?.message,
      });

      return false;
    }
  }

  async function logout() {
    try {
      setLoader(true);

      const response = await authService.logout();

      setLoader(false);

      if (
        response &&
        (response.status === 200 ||
          response.status === 204 ||
          response.status === 400)
      ) {
        terminateSession();
        window.location.href = "/login";
      }
    } catch (err) {
      const error = err as ApiError;

      setLoader(false);
      if (error.statusCode === 400) {
        terminateSession();
        window.location.href = "/login";
      } else {
        setToast({
          show: true,
          type: "error",
          message: error?.message,
        });
      }
    }
  }

  return {
    login,
    logout,
  };
}
