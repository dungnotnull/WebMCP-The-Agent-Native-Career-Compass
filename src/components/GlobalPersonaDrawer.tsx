import React, { useState } from 'react';
import { UserIntakeProfile, Language } from '../types';
import { User as UserIcon, X, Save, Database } from 'lucide-react';
import { IntakeForm } from './IntakeForm';
import { t } from '../utils/i18n';

interface GlobalPersonaDrawerProps {
  intake: UserIntakeProfile;
  setIntake: React.Dispatch<React.SetStateAction<UserIntakeProfile>>;
  language: Language;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function GlobalPersonaDrawer({
  intake,
  setIntake,
  language,
  isOpen,
  setIsOpen
}: GlobalPersonaDrawerProps) {

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/3 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-l-xl shadow-lg z-40 transition-all flex items-center gap-2 backdrop-blur-md bg-opacity-90 border border-amber-400 cursor-pointer"
        title={t(language, 'Hồ sơ Persona', 'Persona Profile')}
      >
        <UserIcon className="w-5 h-5" />
        <span className="hidden md:inline font-semibold">{t(language, 'Hồ sơ Persona', 'Persona Profile')}</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[650px] bg-white/95 backdrop-blur-md shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-white/40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <UserIcon className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold font-sans">
                {t(language, 'Hồ sơ Persona Xuyên Suốt', 'Global Persona Profile')}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-amber-100 mt-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <Database className="w-3.5 h-3.5 text-emerald-300" />
                  {t(language, 'Lưu trữ nội bộ (Local Storage)', 'Local Storage')}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-amber-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-amber-200">
          <IntakeForm
            intake={intake}
            setIntake={setIntake}
            language={language}
            isLoading={false}
            onSubmit={() => setIsOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

