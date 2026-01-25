import React, { useEffect, useState } from 'react';

interface TopicData {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  optional?: boolean;
  duration?: string;
  prerequisites?: string[];
  takeaways?: string[];
  codeSnippet?: string;
  videoUrl?: string;
  links?: { title: string; url: string }[];
  references?: { title: string; url: string }[];
}

export function RoadmapDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TopicData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources'>('overview');

  useEffect(() => {
    const handleOpen = (event: CustomEvent<TopicData>) => {
      setData(event.detail);
      setIsOpen(true);
      setActiveTab('overview');
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    window.addEventListener('roadmap:open-drawer', handleOpen as EventListener);
    window.addEventListener('roadmap:close-drawer', handleClose);

    return () => {
      window.removeEventListener('roadmap:open-drawer', handleOpen as EventListener);
      window.removeEventListener('roadmap:close-drawer', handleClose);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const difficultyColors = {
    beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[data.difficulty] || 'bg-gray-100 text-gray-800'}`}>
                {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}
              </span>
              {data.optional && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Optional
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{data.name}</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 mr-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'resources' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{data.description}</p>
              </div>

              {data.duration && (
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-xs font-semibold text-indigo-800 block">Estimated Time</span>
                    <span className="text-sm text-indigo-900">{data.duration}</span>
                  </div>
                </div>
              )}

              {data.codeSnippet && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Code Example</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>{data.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {data.prerequisites && data.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Prerequisites</h3>
                  <ul className="space-y-2">
                    {data.prerequisites.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.takeaways && data.takeaways.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Key Takeaways</h3>
                  <ul className="space-y-3">
                    {data.takeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              {(!data.links?.length && !data.references?.length && !data.videoUrl) ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No resources available for this topic yet.</p>
                </div>
              ) : (
                <>
                  {data.videoUrl && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Video Tutorial</h3>
                      <a 
                        href={data.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 hover:bg-red-100 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        <span className="font-medium">Watch Video Tutorial</span>
                      </a>
                    </div>
                  )}

                  {data.links && data.links.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Recommended Links</h3>
                      <div className="space-y-3">
                        {data.links.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{link.title}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.references && data.references.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">References</h3>
                      <ul className="space-y-2">
                        {data.references.map((ref, idx) => (
                          <li key={idx}>
                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                              {ref.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}