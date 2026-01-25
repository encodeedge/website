import React from "react";

const Roadmaps = ({ roadmaps }: { roadmaps: any[] }) => {
  return (
    <>
      <section className="container flex max-w-5xl flex-col-reverse gap-8 md:gap-14 lg:flex-row lg:items-end">
        <div className="container">
          <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((roadmap) => (
              <a 
                key={roadmap.id}
                href={`/roadmaps/${roadmap.id}/`}
                className="rounded-xl border hover:shadow-lg transition-shadow duration-300 block"
              >
                <div className="p-2">
                  <div className="px-3 pt-2 pb-4">
                    <h2 className="mb-1 font-semibold">{roadmap.data.title}</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {roadmap.data.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { Roadmaps };