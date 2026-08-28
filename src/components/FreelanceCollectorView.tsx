import React, { useState } from 'react';
import {
  Coins,
  Plus,
  DollarSign,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Copy,
  Check,
  Send,
  Sparkles,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { FreelanceProject, HouseholdProfile, ProjectStatus } from '../types';

interface FreelanceCollectorViewProps {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  onOpenCollectModal: (project: FreelanceProject) => void;
  onOpenNewProject: () => void;
  onEditProject: (project: FreelanceProject) => void;
  onDeleteProject: (projectId: string) => void;
}

export const FreelanceCollectorView: React.FC<FreelanceCollectorViewProps> = ({
  profile,
  projects,
  onOpenCollectModal,
  onOpenNewProject,
  onEditProject,
  onDeleteProject
}) => {
  const sym = profile.currencySymbol;
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedScriptProject, setSelectedScriptProject] = useState<FreelanceProject | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const totalCollected = projects.reduce((acc, p) => acc + p.depositReceived, 0);
  const totalUncollected = projects
    .filter((p) => p.status !== 'COLLECTED' && p.totalFee - p.depositReceived > 0)
    .reduce((acc, p) => acc + (p.totalFee - p.depositReceived), 0);
  const overdueProjects = projects.filter((p) => p.status === 'OVERDUE');

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'UNCOLLECTED') return p.status !== 'COLLECTED' && (p.totalFee - p.depositReceived) > 0;
    return p.status === filterStatus;
  });

  const handleCopyScript = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'OVERDUE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      case 'INVOICED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Invoiced (Awaiting)</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Shooting / Editing</span>
          </span>
        );
      case 'PENDING_DEPOSIT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Pending Deposit
          </span>
        );
      case 'COLLECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Collected ✅</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center space-x-2">
            <Coins className="w-7 h-7 text-amber-400" />
            <span>Freelance Cash Collector</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Track commercial gigs, send WhatsApp follow-ups, and split lump-sum payments upon collection.
          </p>
        </div>

        <button
          id="btn-add-new-project"
          onClick={onOpenNewProject}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Freelance Gig</span>
        </button>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Uncollected Inflow</span>
          <div className="text-2xl font-black font-display text-amber-400 mt-1">
            {sym}{totalUncollected.toLocaleString()}
          </div>
          <span className="text-xs text-stone-400">Waiting for client payment</span>
        </div>

        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Collected Revenue</span>
          <div className="text-2xl font-black font-display text-emerald-400 mt-1">
            {sym}{totalCollected.toLocaleString()}
          </div>
          <span className="text-xs text-stone-400">Deposited into family accounts</span>
        </div>

        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Overdue Alerts</span>
          <div className="text-2xl font-black font-display text-rose-400 mt-1">
            {overdueProjects.length} {overdueProjects.length === 1 ? 'Gig' : 'Gigs'}
          </div>
          <span className="text-xs text-stone-400">Action & reminder needed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto py-1 space-x-2 border-b border-stone-800">
        {[
          { id: 'ALL', label: 'All Gigs' },
          { id: 'UNCOLLECTED', label: 'Uncollected Only' },
          { id: 'OVERDUE', label: 'Overdue ⚠️' },
          { id: 'INVOICED', label: 'Invoiced' },
          { id: 'IN_PROGRESS', label: 'In Progress' },
          { id: 'COLLECTED', label: 'Collected ✅' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-stone-700 text-white border border-stone-600'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const remaining = Math.max(0, project.totalFee - project.depositReceived);
          const isCollected = project.status === 'COLLECTED' || remaining <= 0;
          const isOverdue = project.status === 'OVERDUE';

          return (
            <div
              key={project.id}
              className={`p-5 rounded-2xl border transition-all ${
                isOverdue
                  ? 'bg-rose-950/15 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : isCollected
                  ? 'bg-stone-850/60 border-stone-800/80 opacity-80'
                  : 'bg-stone-850 border-stone-700/70 shadow-md'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">{project.clientName}</h3>
                    {getStatusBadge(project.status)}
                    <span className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                      {project.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-stone-200">{project.projectTitle}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
                    {project.invoiceNumber && (
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>Inv: {project.invoiceNumber}</span>
                      </span>
                    )}
                    {project.dueDate && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>Due: {project.dueDate}</span>
                      </span>
                    )}
                    {project.clientPhone && (
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{project.clientPhone}</span>
                      </span>
                    )}
                    {project.clientEmail && (
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-stone-500" />
                        <span>{project.clientEmail}</span>
                      </span>
                    )}
                  </div>

                  {project.notes && (
                    <p className="text-xs text-stone-400 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 italic">
                      "{project.notes}"
                    </p>
                  )}
                </div>

                {/* Right Actions & Amount */}
                <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-800">
                  <div className="text-left lg:text-right">
                    <div className="text-xl sm:text-2xl font-black font-display text-white">
                      {sym}{remaining.toLocaleString()}
                      <span className="text-xs text-stone-400 font-normal ml-1">remaining</span>
                    </div>
                    <div className="text-xs text-stone-400">
                      Total Fee: {sym}{project.totalFee.toLocaleString()} • Deposit: {sym}{project.depositReceived.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Follow-up script trigger */}
                    {!isCollected && (
                      <button
                        onClick={() => setSelectedScriptProject(project)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Generate reminder message"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Follow-up Script</span>
                      </button>
                    )}

                    {/* Collect button */}
                    {!isCollected ? (
                      <button
                        id={`btn-collect-${project.id}`}
                        onClick={() => onOpenCollectModal(project)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Collect & Split</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Settled</span>
                      </span>
                    )}

                    {/* Edit & Delete */}
                    <button
                      onClick={() => onEditProject(project)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center bg-stone-850 rounded-2xl border border-stone-800 space-y-3">
            <Coins className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-300">No gigs in this category</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Create a new client project or switch filters above to view your full production catalog.
            </p>
          </div>
        )}
      </div>

      {/* Script Generator Modal */}
      {selectedScriptProject && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Client Follow-up Script</h3>
                  <p className="text-xs text-stone-400">
                    Ready-to-send payment reminder for {selectedScriptProject.clientName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScriptProject(null)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* WhatsApp Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Send className="w-3 h-3" />
                  <span>WhatsApp / SMS Message</span>
                </span>
                <button
                  onClick={() =>
                    handleCopyScript(
                      `Hi ${selectedScriptProject.clientName}! Hope you're having a great week. We're finalizing our monthly production books and wanted to check in on Invoice ${selectedScriptProject.invoiceNumber || 'INV-2026'} for ${sym}${(selectedScriptProject.totalFee - selectedScriptProject.depositReceived).toLocaleString()}. Could you let me know if the transfer was initiated or if you need our bank routing details resent? Thanks so much!`,
                      'whatsapp'
                    )
                  }
                  className="text-xs text-stone-300 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-stone-800 border border-stone-700"
                >
                  {copiedType === 'whatsapp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed">
                "Hi {selectedScriptProject.clientName}! Hope you're having a great week. We're finalizing our monthly production books and wanted to check in on Invoice <strong>{selectedScriptProject.invoiceNumber || 'INV-2026'}</strong> for <strong>{sym}{(selectedScriptProject.totalFee - selectedScriptProject.depositReceived).toLocaleString()}</strong>. Could you let me know if the transfer was initiated or if you need our bank routing details resent? Thanks so much!"
              </div>
            </div>

            {/* Formal Email Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>Formal Accounts Email</span>
                </span>
                <button
                  onClick={() =>
                    handleCopyScript(
                      `Subject: Follow-up: Invoice ${selectedScriptProject.invoiceNumber || 'INV-2026'} - ${selectedScriptProject.projectTitle}\n\nHi ${selectedScriptProject.clientName},\n\nHope this email finds you well.\n\nThis is a brief follow-up regarding the outstanding balance for ${selectedScriptProject.projectTitle} (Invoice ${selectedScriptProject.invoiceNumber || 'INV-2026'}) in the amount of ${sym}${(selectedScriptProject.totalFee - selectedScriptProject.depositReceived).toLocaleString()}.\n\nPlease let us know when we can expect the remittance advice or if you require any additional vendor forms.\n\nBest regards,\n${profile.husbandName}`,
                      'email'
                    )
                  }
                  className="text-xs text-stone-300 hover:text-white flex items-center space-x-1 px-2 py-1 rounded bg-stone-800 border border-stone-700"
                >
                  {copiedType === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'email' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed font-mono whitespace-pre-line text-[11px]">
                Subject: Follow-up: Invoice {selectedScriptProject.invoiceNumber || 'INV-2026'} - {selectedScriptProject.projectTitle}
                {'\n\n'}
                Hi {selectedScriptProject.clientName},{'\n'}
                This is a brief follow-up regarding the balance for {selectedScriptProject.projectTitle} in the amount of {sym}{(selectedScriptProject.totalFee - selectedScriptProject.depositReceived).toLocaleString()}.{'\n'}
                Please let us know when we can expect the remittance advice.
              </div>
            </div>

            <button
              onClick={() => setSelectedScriptProject(null)}
              className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
