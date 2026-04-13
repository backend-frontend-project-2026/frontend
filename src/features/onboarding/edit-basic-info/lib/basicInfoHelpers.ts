export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Не удалось прочитать файл.'));
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл.'));
    };

    reader.readAsDataURL(file);
  });
}

export function revokeObjectUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
