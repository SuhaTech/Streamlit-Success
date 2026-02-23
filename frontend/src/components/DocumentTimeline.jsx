import React from 'react';
import { CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'mentor', label: 'Mentor' },
  { key: 'hod', label: 'HOD' },
  { key: 'issued', label: 'Issued' },
];

const STATUS_MAP = {
  pending: 0,
  mentor_approved: 1,
  hod_approved: 2,
  issued: 3,
  rejected: -1,
};

const DocumentTimeline = ({ document }) => {
  const status = document.overallStatus || 'pending';
  const currentStep = STATUS_MAP[status] ?? 0;
  const isRejected = status === 'rejected';

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-800">{document.documentType}</h4>
          <p className="text-sm text-gray-500">
            Requested: {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isRejected ? (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
            <XCircle size={12} /> Rejected
          </span>
        ) : status === 'issued' ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Issued
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} /> In Progress
          </span>
        )}
      </div>

      {/* Timeline bar */}
      <div className="flex items-center gap-0 mb-4">
        {STEPS.map((step, i) => {
          const isCompleted = !isRejected && currentStep >= i;
          const isCurrent = !isRejected && currentStep === i;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isRejected ?
                    'bg-red-100 text-red-500' :
                  isCompleted ?
                    'bg-green-500 text-white' :
                  isCurrent ?
                    'bg-indigo-500 text-white animate-pulse' :
                    'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted && !isCurrent ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <p className={`text-xs mt-1 font-medium ${
                  isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 rounded ${
                  !isRejected && currentStep > i ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Approval details */}
      <div className="space-y-2 text-xs">
        {document.mentorApproval?.status && (
          <ApprovalRow
            role="Mentor"
            status={document.mentorApproval.status}
            note={document.mentorApproval.note}
            date={document.mentorApproval.at}
          />
        )}
        {document.hodApproval?.status && (
          <ApprovalRow
            role="HOD"
            status={document.hodApproval.status}
            note={document.hodApproval.note}
            date={document.hodApproval.at}
          />
        )}
        {document.deanApproval?.status && (
          <ApprovalRow
            role="Dean"
            status={document.deanApproval.status}
            note={document.deanApproval.note}
            date={document.deanApproval.at}
          />
        )}
      </div>

      {/* Download link if issued */}
      {document.generatedDocUrl && status === 'issued' && (
        <a href={document.generatedDocUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          <FileText size={14} /> Download Document
        </a>
      )}
    </div>
  );
};

const ApprovalRow = ({ role, status, note, date }) => (
  <div className={`flex items-start gap-2 p-2 rounded ${
    status === 'approved' ? 'bg-green-50' : status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'
  }`}>
    <span className={`font-medium ${
      status === 'approved' ? 'text-green-700' : status === 'rejected' ? 'text-red-700' : 'text-gray-500'
    }`}>
      {role}:
    </span>
    <span className="capitalize">{status}</span>
    {note && <span className="text-gray-500">— {note}</span>}
    {date && <span className="text-gray-400 ml-auto">{new Date(date).toLocaleDateString()}</span>}
  </div>
);

export default DocumentTimeline;
