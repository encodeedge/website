const contributors = [
  {
    name: "Dr. Evelyn Reed",
    company: "ML Research Scientist",
    affiliation: "DeepMind",
    image: "/investors/1.webp", // Keeping original path
  },
  {
    name: "Kiran Sharma",
    company: "Sr. Data Scientist",
    affiliation: "Google AI",
    image: "/investors/2.webp", // Keeping original path
  },
  {
    name: "Alex Nguyen",
    company: "TensorFlow Contributor",
    affiliation: "Open Source Advocate",
    image: "/investors/3.webp", // Keeping original path
  },
  {
    name: "Sarah Chen",
    company: "ML Engineering Lead",
    affiliation: "NVIDIA",
    image: "/investors/4.webp", // Keeping original path
  },
  {
    name: "Marcus Jones",
    company: "Python Core Developer",
    affiliation: "University of Tech",
    image: "/investors/5.webp", // Keeping original path
  },
];

export function Investors() {
  return (
    <section className="container max-w-5xl py-12">
      <h2 className="text-foreground text-4xl font-medium tracking-wide">
        Our Featured Contributors & Advisors 💡
      </h2>
      <p className="text-muted-foreground mt-2 max-w-4xl">
        Insights and guidance from leaders in the AI/ML community, open-source contributors, and research scientists.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {contributors.map((contributor) => (
          <div key={contributor.name} className="">
            <img
              src={contributor.image}
              alt={contributor.name}
              width={120}
              height={120}
              className="object-cover rounded-full" // Added rounded-full for a professional look
            />
            <h3 className="mt-3 font-semibold">{contributor.name}</h3>
            {/* The primary role/title */}
            <p className="text-primary text-sm">{contributor.company}</p>
            {/* The affiliation/company */}
            <p className="text-muted-foreground text-sm">{contributor.affiliation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}