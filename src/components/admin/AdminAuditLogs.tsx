import React from 'react';
import { ShieldCheck, Clock, FileText, CheckCircle2, User } from 'lucide-react';
import { AuditLog } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface AdminAuditLogsProps {
  logs: AuditLog[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs }) => {
  return (
    <div className="space-y-5">
      <div className="bg-[#131622] p-5 rounded-2xl border border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Security & Administrative Audit Logs</h3>
        </div>
        <p className="text-xs text-slate-400">
          Immutable audit trail tracking all inventory modifications, price changes, customer status transitions, and owner logins.
        </p>
      </div>

      <div className="bg-[#131622] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1017] border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-3">Actor</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Entity Type</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#181c2b] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3 h-3 text-amber-400" />
                      {log.actor_name}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-amber-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] text-slate-400 font-semibold">
                    {log.entity_type}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
