import clientPromise from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('rplace');
    const pixels = await db.collection('pixels').find({}).toArray();
    return new Response(JSON.stringify(pixels), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to fetch pixels' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
