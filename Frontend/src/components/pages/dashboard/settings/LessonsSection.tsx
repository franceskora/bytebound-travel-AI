import { useState } from 'react';

interface Lesson {
  id: number;
  topic: string;
  progress: number; // %
}

export const LessonsSection = () => {
  const [lessons] = useState<Lesson[]>([
    { id: 1, topic: 'Ordering at a Café', progress: 80 },
    { id: 2, topic: 'Asking for Directions', progress: 45 }
  ]);

  return (
    <div className="px-4 pb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Track your language lessons and progress.
      </p>
      <ul className="space-y-3">
        {lessons.map(lesson => (
          <li
            key={lesson.id}
            className="p-3 rounded-md border dark:bg-gray-700"
          >
            <p className="font-semibold">{lesson.topic}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-primary dark:bg-green h-2.5 rounded-full"
                style={{ width: `${lesson.progress}%` }}
              />
            </div>
            <p className="text-xs mt-1">{lesson.progress}% complete</p>
          </li>
        ))}
      </ul>
    </div>
  );
};