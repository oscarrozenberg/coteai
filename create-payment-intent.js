// api/create-payment-intent.js
// Backend Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // REMPLACE par ta vraie clé secrète Stripe (commence par sk_live_ ou sk_test_)
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const { amount, email, vehicule } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,          // en centimes : 499 = 4,99€
      currency: 'eur',
      receipt_email: email,
      metadata: {
        marque: vehicule?.marque || '',
        modele: vehicule?.modele || '',
        annee: vehicule?.annee || '',
        km: vehicule?.km || '',
        etat: vehicule?.etat || '',
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
