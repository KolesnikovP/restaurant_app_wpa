import { APP_SCHEME, BASE_URL, GOOGLE_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "@/shared/constants/constants";

export async function GET(request: Request) {
  if(!GOOGLE_CLIENT_ID) {
    return Response.json(
      {error: "GOOGLE_CLIENT_ID is not set"},
      {status: 500}
    )
  }

  const url = new URL(request.url)
  let idpClientId: string;
  const internalClient = url.searchParams.get('client_id')
  // Support both non-standard 'redirectUri' and OAuth-standard 'redirect_uri'
  const redirectUri = url.searchParams.get('redirectUri') || url.searchParams.get('redirect_uri') || undefined

  let platform;

  if(redirectUri && (redirectUri === APP_SCHEME || redirectUri.startsWith(APP_SCHEME))) {
    platform = 'mobile'
  } else if (redirectUri && (redirectUri === BASE_URL || redirectUri.startsWith(String(BASE_URL)))) {
    platform = 'web';
  } else {
    return Response.json({ error: "invalid redirect URI"}, {status: 400})
  }

  // use state to drive redirect back to platform 
  let state = platform + '|' + url.searchParams.get('state') 

  if(internalClient === 'google') {
    idpClientId = GOOGLE_CLIENT_ID
  } else {
     return Response.json({error: 'invalid client'}, {status: 400})
  }

  const params = new URLSearchParams({
    client_id: idpClientId,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: url.searchParams.get('scope') || 'identity',
    state: state,
    prompt: 'select_account'
  })

  return Response.redirect(GOOGLE_AUTH_URL + '?' + params.toString())
}
