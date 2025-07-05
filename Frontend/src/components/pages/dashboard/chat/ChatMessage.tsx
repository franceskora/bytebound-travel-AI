
interface ChatMessageProps {
  isAi: boolean;
  text?: string;
   timestamp: string
  file?: {
    name: string;
    url: string;
    type?: string; 
  };
  audioUrl?: string;

}

export const ChatMessage = ({ isAi, text, file, audioUrl, timestamp }: ChatMessageProps) => {
  const baseClasses = "max-w-xl p-3 rounded-lg";
  const aiClasses = "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none";
  const userClasses = "bg-primary dark:bg-green text-white rounded-br-none";
  const alignmentClass = isAi ? "justify-start" : "justify-end";

  const isImage = file?.type?.startsWith("image/");

  return (
    <div className={`flex ${alignmentClass}`}>
      <div className={`${baseClasses} ${isAi ? aiClasses : userClasses} relative`}>
        {/* Show text above the file preview */}
        {text && <p className="text-sm mb-2">{text}</p>}

        {/* File preview */}
        {file && (
          <div>
            {isImage ? (
              <img
                src={file.url}
                alt={file.name}
                className="max-w-xs rounded"
              />
            ) : (
              <a href={file.url} download={file.name} className="underline text-sm">
                📎 {file.name}
              </a>
            )}
          </div>
        )}

        {/* Audio */}
        {audioUrl && (
          <audio controls src={audioUrl} className="mt-2 w-full" />
        )}
        {/* Timestamp */}
        <span className="block text-xs text-pink-600 dark:text-pink-300 mt-2 text-right">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};