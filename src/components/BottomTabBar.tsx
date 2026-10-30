import React from 'react';
import { MessageSquare, BookMarked, Bookmark, BookOpen } from 'lucide-react';
import { AppTab } from '../types';

interface BottomTabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  recordCount: number;
  savedCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  recordCount,
  savedCount,
}) => {
  const tabs: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'chat', label: '채팅 번역', icon: MessageSquare },
    { id: 'records', label: 'STAR 기록', icon: BookMarked, badge: recordCount },
    { id: 'saved', label: '보관함', icon: Bookmark, badge: savedCount },
    { id: 'guide', label: '가이드', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="모바일 하단 내비게이션"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-1 leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
