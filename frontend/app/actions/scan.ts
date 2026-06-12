'use server';

export async function scanMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Scan Action Error:', error);
    return { error: error.message || 'Failed to connect to scanner backend' };
  }
}
