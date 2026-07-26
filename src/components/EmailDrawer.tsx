'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Mail, X, Check, Bell, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

export const EmailDrawer: React.FC = () => {
  const { emails, isEmailDrawerOpen, setIsEmailDrawerOpen, markEmailRead } = useApp();

  if (!isEmailDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Simulated Email Inbox</h3>
                <p className="text-[10px] text-slate-400 font-mono">FR-6 & FR-8 Transactional Alerts</p>
              </div>
            </div>

            <button
              onClick={() => setIsEmailDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Email Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {emails.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-xs">
                No email notifications generated yet. Request a booking or create a listing to trigger transactional emails!
              </div>
            ) : (
              emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => markEmailRead(email.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    !email.read
                      ? 'bg-slate-950/90 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-emerald-400 font-semibold uppercase">
                      To: {email.recipientEmail} ({email.recipientRole})
                    </span>
                    <span>{new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{email.subject}</h4>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-sans">
                    {email.body}
                  </p>

                  {!email.read && (
                    <div className="flex justify-end">
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Click to mark read
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-400">
            Fieldstay Transactional Email Engine (SendGrid Mocking)
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
