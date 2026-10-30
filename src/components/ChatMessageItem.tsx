import React from 'react';
import { User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { STARCard } from './STARCard';

interface ChatMessageItemProps {
  message: ChatMessage;
  savedIds: string[];
  onSaveTranslation: (messageId: string) => void;
  onRefinePrompt: (promptText: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  savedIds,
  onSaveTranslation,
  onRefinePrompt,
}) => {
  const isUser = message.role === 'user';
  const isSaved = savedIds.includes(message.id);

  if (isUser) {
    return (
      <div className="flex justify-end gap-2.5 max-w-4xl mx-auto my-3">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant response
  return (
    <div className="flex gap-2.5 max-w-4xl mx-auto my-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 max-w-[92%] sm:max-w-[88%] space-y-2">
        {message.translation ? (
          <STARCard
            data={message.translation}
            originalText={message.content}
            isSaved={isSaved}
            onSave={() => onSaveTranslation(message.id)}
            onRefinePrompt={onRefinePrompt}
          />
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        <span className="text-[10px] text-slate-400 block px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
