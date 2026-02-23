import React from 'react';
import { MapPin, Clock, DollarSign, Star, Briefcase, Building2, ArrowRight } from 'lucide-react';

const TYPE_COLORS = {
  internship: 'bg-blue-100 text-blue-700',
  fulltime: 'bg-green-100 text-green-700',
  parttime: 'bg-purple-100 text-purple-700',
};

const JobCard = ({ job, matchScore, onApply, onView, showApply = true }) => {
  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
            {matchScore > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                matchScore >= 75 ? 'bg-green-100 text-green-700' :
                matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Star size={10} /> {matchScore}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Building2 size={14} />{job.company}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-500'}`}>
              {job.type}
            </span>
          </div>
        </div>
        {job.status && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {isExpired ? 'expired' : job.status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        {job.location && (
          <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
        )}
        {job.duration && (
          <span className="flex items-center gap-1"><Clock size={14} />{job.duration}</span>
        )}
        {job.stipend && (
          <span className="flex items-center gap-1"><DollarSign size={14} />{job.stipend}</span>
        )}
        {job.domain && (
          <span className="flex items-center gap-1"><Briefcase size={14} />{job.domain}</span>
        )}
      </div>

      {/* Skills */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.requiredSkills.slice(0, 8).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 8 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">+{job.requiredSkills.length - 8} more</span>
          )}
        </div>
      )}

      {/* Description preview */}
      {job.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
      )}

      {/* Deadline */}
      {job.deadline && (
        <p className={`text-xs mb-3 ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
          Deadline: {new Date(job.deadline).toLocaleDateString()}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onView && (
          <button onClick={() => onView(job)} className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            View Details
          </button>
        )}
        {showApply && onApply && !isExpired && job.status === 'open' && (
          <button onClick={() => onApply(job)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1">
            Apply <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
