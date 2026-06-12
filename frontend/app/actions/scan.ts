'use server';

export async function scanMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || `Scan failed (status ${response.status})`;
      return { error: message };
    }

    if (data.error) {
      return { error: data.error };
    }

    return data;
  } catch (error: any) {
    console.error('Scan Action Error:', error);
    if (error instanceof SyntaxError) {
      return { error: 'Scanner backend returned an unreadable response.' };
    }
    return { error: 'Could not reach the scanner. Check your connection and try again.' };
  }
}
