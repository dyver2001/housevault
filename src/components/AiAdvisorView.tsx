import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Copy,
  Check,
  Zap,
  Landmark,
  MessageSquare,
  Receipt
} from 'lucide-react';
import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense
} from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface AiAdvisorViewProps {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  targets: SavingsTarget[];
  expenses: HouseholdExpense[];
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  profile,
  projects,
  debts,
  targets,
  expenses
}) => {
  const sym = profile.currencySymbol;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `### 👋 Welcome to HouseVault AI Strategist

I specialize in dual-income couples where **${profile.wifeName.split(' ')[0]}** provides the steady salary foundation (${sym}${profile.wifeMonthlySalary.toLocaleString()}/mo) and **${profile.husbandName.split(' ')[0]}** brings in irregular freelance cash windfalls.

**How can I assist your family finances today?**
- 💰 **Windfall Split**: Allocate your next commercial or wedding shoot payout.
- 🏦 **Debt Elimination**: Calculate your avalanche/snowball payoff timeline.
- 📱 **Client Invoicing**: Draft polite yet firm payment reminder messages.
- 🏠 **House Vault**: Optimize your path to a home deposit!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    {
      label: '💰 Optimal 35/35/15/15 Windfall Split',
      prompt: 'How should we allocate our next $3,500 freelance shoot payout between bank debt, savings vault, tax reserve, and safe pocket?',
      icon: Zap
    },
    {
      label: '🏦 Avalanche Debt Elimination Plan',
      prompt: 'Review our active bank debts and give us a step-by-step strategy to eliminate the highest APR card first.',
      icon: Landmark
    },
    {
      label: '📱 WhatsApp Client Payment Reminder',
      prompt: 'Draft a friendly, professional WhatsApp reminder for an overdue client invoice without sounding rude.',
      icon: MessageSquare
    },
    {
      label: '🛡️ Fixed Living Bills vs Steady Salary',
      prompt: "Analyze Elena's IT salary vs our fixed household bills. How much monthly surplus can we safely invest?",
      icon: Receipt
    }
  ];

  const handleSendMessage = async (promptToSend: string) => {
    if (!promptToSend.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          profile,
          projects,
          debts,
          targets,
          expenses
        })
      });

      const data = await response.json();
      const botResponse: Message = {
        role: 'assistant',
        content: data.text || 'Unable to generate advice. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Failed to contact advisor: ${err.message}. Please check your connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-7 h-7 text-amber-400" />
            <span>AI Household Financial Strategist</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Grounded in your real household budget numbers, client invoices, and bank debt balances.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemini 2.5 Flash Online</span>
        </span>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="p-3 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/30 text-left transition-all flex items-start space-x-3 cursor-pointer group shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-bold text-stone-200 group-hover:text-white block truncate">
                  {qp.label}
                </span>
                <span className="text-[11px] text-stone-400 block line-clamp-1">
                  {qp.prompt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 min-h-[420px] max-h-[600px] overflow-y-auto flex flex-col justify-between">
        <div className="space-y-5">
          {messages.map((msg, index) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isBot
                      ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-stone-900 border border-stone-700/80 text-stone-200 shadow-md'
                      : 'bg-emerald-600 text-stone-950 font-medium'
                  }`}
                >
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-2 whitespace-pre-line">
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[10px] text-stone-400">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="hover:text-white flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-700/80 text-stone-300 flex items-center space-x-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>HouseVault AI is computing financial strategy...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputPrompt);
          }}
          className="pt-4 border-t border-stone-800 mt-4 flex items-center space-x-2"
        >
          <input
            id="ai-prompt-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about freelance splits, debt payoff, or client follow-ups..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none transition-colors"
          />

          <button
            id="btn-send-ai"
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
