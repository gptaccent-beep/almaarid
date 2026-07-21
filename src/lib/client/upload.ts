export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as {url?: string};
  if (!data.url) {
    throw new Error('Upload response did not include a URL.');
  }

  return data.url;
}
