export default async function handler(req, res) {
  // 1. El camarero coge tus llaves secretas de Vercel
  const clientId = process.env.HUSQVARNA_CLIENT_ID;
  const clientSecret = process.env.HUSQVARNA_CLIENT_SECRET;
  const username = process.env.HUSQVARNA_USERNAME;
  const password = process.env.HUSQVARNA_PASSWORD;

  try {
    // 2. Llama a la oficina central de Husqvarna para pedir permiso (Token)
    const authResponse = await fetch('https://api.amc.husqvarna.dev/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password
      })
    });

    const authData = await authResponse.json();
    const token = authData.access_token;

    // 3. Con el permiso en la mano, le pide los datos de "Reaper"
    const mowerResponse = await fetch('https://api.amc.husqvarna.dev/v1/mowers', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Sign-In-Provider': 'Husqvarna',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    const mowerData = await mowerResponse.json();
    
    // 4. Te devuelve los datos reales y frescos a la pantalla
    return res.status(200).json(mowerData);

  } catch (error) {
    return res.status(500).json({ error: 'El camarero se ha tropezado: ' + error.message });
  }
}
