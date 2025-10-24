import { useMutation } from "@tanstack/react-query";
import { postGoogleIdToken, type MobileAuthResponse } from "./mobileAuth";

export function useMobileGoogleAuth() {
  return useMutation<MobileAuthResponse, Error, string>({
    mutationKey: ["mobile-google-auth"],
    mutationFn: (idToken: string) => postGoogleIdToken(idToken),
  });
}

