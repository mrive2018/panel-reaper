export default async function handler(req, res) {
  const clientId = process.env.HUSQVARNA_CLIENT_ID;
  const clientSecret = process.env.HUSQVARNA_CLIENT_SECRET;

  try {
    // 1. Pedir el token usando el nuevo método oficial (client_credentials)
    const authResponse = await fetch('https://api.authentication.husqvarnagroup.dev/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    const authData = await authResponse.json();
    
    if (!authResponse.ok) {
      return res.status(authResponse.status).json({ error: 'Fallo al pedir el token', detalles: authData });
    }

    const token = authData.access_token;

    // 2. Pedir los datos de Reaper con el nuevo token
    const mowerResponse = await fetch('https://api.amc.husqvarna.dev/v1/mowers', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Api-Key': clientId,
        'Content-Type': 'application/vnd.api+json'
      }
    });

    const mowerData = await mowerResponse.json();
    return res.status(200).json(mowerData);

  } catch (error) {
    return res.status(500).json({ error: 'El camarero se ha tropezado: ' + error.message });
  }
}
