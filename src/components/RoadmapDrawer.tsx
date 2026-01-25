import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';

export function RoadmapDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const handleOpen = (e: CustomEvent) => {
      setData(e.detail);
      setIsOpen(true);
    };

    window.addEventListener('roadmap:open-drawer' as any, handleOpen);
    return () => window.removeEventListener('roadmap:open-drawer' as any, handleOpen);
  }, []);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="sm:max-w-lg p-4">
        <div className="h-full overflow-y-auto">
          {data && (
            <>
              <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
              <p className="text-lg mb-4">{data.description}</p>
              <div className={`badge mb-6 inline-block px-3 py-1 rounded-full text-white capitalize ${
                data.difficulty === 'beginner' ? 'bg-[#10b981]' :
                data.difficulty === 'intermediate' ? 'bg-[#3b82f6]' :
                'bg-[#8b5cf6]'
              }`}>
                {data.difficulty}
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-6">Links</h3>
              {data.links?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {data.links.map((link: any, i: number) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No links available.</p>}

              <h3 className="text-xl font-semibold mb-2 mt-6">References</h3>
              {data.references?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {data.references.map((ref: any, i: number) => (
                    <li key={i}>
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No references available.</p>}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}