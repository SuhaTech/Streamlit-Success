import React from 'react';

const PROFILE_FIELDS = [
  { key: 'name', label: 'Name', weight: 10 },
  { key: 'email', label: 'Email', weight: 5 },
  { key: 'contact', label: 'Phone', weight: 10 },
  { key: 'department', label: 'Department', weight: 10 },
  { key: 'branch', label: 'Branch', weight: 5 },
  { key: 'enrollmentNo', label: 'Enrollment No', weight: 10 },
  { key: 'cgpa', label: 'CGPA', weight: 10 },
  { key: 'skills', label: 'Skills', weight: 15 },
  { key: 'resumeText', label: 'Resume', weight: 15 },
  { key: 'github', label: 'GitHub', weight: 5 },
  { key: 'linkedin', label: 'LinkedIn', weight: 5 },
];

const ProfileMeter = ({ profile = {} }) => {
  let totalWeight = 0;
  let completedWeight = 0;
  const missing = [];

  PROFILE_FIELDS.forEach(f => {
    totalWeight += f.weight;
    const val = profile[f.key];
    if (val && String(val).trim().length > 0) {
      completedWeight += f.weight;
    } else {
      missing.push(f.label);
    }
  });

  const percentage = Math.round((completedWeight / totalWeight) * 100);

  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-700';
    if (percentage >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 text-sm">Profile Completeness</h4>
        <span className={`text-lg font-bold ${getTextColor()}`}>{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }} />
      </div>

      {/* Missing fields */}
      {missing.length > 0 && percentage < 100 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Missing fields:</p>
          <div className="flex flex-wrap gap-1">
            {missing.map(m => (
              <span key={m} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs">{m}</span>
            ))}
          </div>
        </div>
      )}

      {percentage === 100 && (
        <p className="text-xs text-green-600 font-medium mt-1">
          Your profile is complete! You'll get better AI recommendations.
        </p>
      )}
    </div>
  );
};

export default ProfileMeter;
