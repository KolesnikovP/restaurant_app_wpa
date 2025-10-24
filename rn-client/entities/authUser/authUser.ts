export type TAuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_veirfied?: string;
  provider?: string;
  exp?: number;
  cookieExpiration?: number;  // track web cookie expiration 
}
