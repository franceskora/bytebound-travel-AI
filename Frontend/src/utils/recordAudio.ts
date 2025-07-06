export const recordAudio = (): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      recorder.start();

      // Example: auto-stop after 5s — or you can stop manually
      setTimeout(() => {
        recorder.stop();
      }, 5000);
    } catch (err) {
      reject(err);
    }
  });
};
