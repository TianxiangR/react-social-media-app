const baseUrl = import.meta.env.BASE_URL;

export async function createUser() {
  try {
    const response = await fetch(`${baseUrl}/api/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'test', password: 'test' }),
    });
  }
}