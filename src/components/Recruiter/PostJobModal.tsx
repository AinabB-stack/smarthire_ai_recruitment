import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, MapPin, Check } from 'lucide-react';
import { Job } from '../../types';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Omit<Job, 'id' | 'createdAt'>) => void;
}

const PRESET_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Python', 'Gemini API',
  'System Design', 'PostgreSQL', 'GraphQL', 'Figma', 'Docker', 'AWS'
];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [skillsInput, setSkillsInput] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddPresetSkill = (skill: string) => {
    const current = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!current.includes(skill)) {
      const updated = [...current, skill].join(', ');
      setSkillsInput(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Job title is required');
      return;
    }
    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setError('Please specify at least one required skill');
      return;
    }
    if (!description.trim()) {
      setError('Job description is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      department: department.trim() || 'General',
      location: location.trim() || 'Remote',
      requiredSkills: skillsArray,
      description: description.trim(),
    });

    // Reset state
    setTitle('');
    setSkillsInput('');
    setDescription('');
    setError('');
    onClose();
  };

  const parsedSkills = skillsInput
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div id="modal-post-job-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div id="modal-post-job" className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Post New Job Opening</h3>
              <p className="text-xs text-slate-500">AI will automatically score incoming candidate applications against these criteria.</p>
            </div>
          </div>
          <button
            id="btn-close-post-job-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Job Title *
            </label>
            <input
              id="input-job-title"
              type="text"
              placeholder="e.g. Senior Full Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Department
              </label>
              <input
                id="input-job-department"
                type="text"
                placeholder="e.g. Engineering / Product"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Location
              </label>
              <input
                id="input-job-location"
                type="text"
                placeholder="e.g. Remote / San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Required Skills (comma separated) *
            </label>
            <input
              id="input-job-skills"
              type="text"
              placeholder="e.g. React, TypeScript, Tailwind CSS, REST APIs"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
            />

            {/* Quick Presets */}
            <div className="mt-2.5">
              <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Quick add popular skill tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddPresetSkill(skill)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1 font-medium"
                  >
                    <span>+</span> {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Active parsed skill chips */}
            {parsedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5 p-2 bg-teal-50/50 rounded-xl border border-teal-100">
                {parsedSkills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-md text-xs bg-teal-100 text-teal-950 font-bold border border-teal-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Job Description *
            </label>
            <textarea
              id="input-job-description"
              rows={4}
              placeholder="Describe key responsibilities, team goals, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-post-job"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-post-job"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Job Opening</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
