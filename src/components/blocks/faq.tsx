import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Getting Started with AI/ML",
    questions: [
      {
        question: "What is the best programming language for machine learning?",
        answer:
          "The most popular and widely supported language is **Python**. It offers a vast ecosystem of libraries like TensorFlow, PyTorch, and Scikit-learn, making it the industry standard for ML development. While R is common for statistical analysis, Python is generally preferred for building and deploying models.",
      },
      {
        question: "Should I learn Deep Learning or traditional Machine Learning first?",
        answer:
          "It's generally recommended to start with **traditional Machine Learning** concepts (e.g., linear regression, decision trees, clustering) as they provide a strong fundamental understanding of model bias, variance, and feature engineering. Deep Learning builds upon these principles but involves more complex structures like neural networks.",
      },
      {
        question: "What hardware is required for ML projects?",
        answer:
          "For learning and small projects, a standard laptop is sufficient. For Deep Learning or working with large datasets, you'll need access to a **GPU (Graphics Processing Unit)**. You can often use cloud platforms (like Google Colab, AWS, or Azure) to access powerful GPUs without needing to purchase expensive hardware.",
      },
    ],
  },
  {
    title: "Tutorials and Code",
    questions: [
      {
        question: "Are your tutorials focused on theory or practical code implementation?",
        answer:
          "Our tutorials are heavily focused on **practical code implementation**. While we cover the necessary theory, the primary goal is to provide step-by-step code examples using Python and popular libraries, allowing you to build and run working models quickly.",
      },
      {
        question: "What libraries and frameworks do you cover?",
        answer:
          "We primarily focus on the major frameworks: **TensorFlow** and **PyTorch** for deep learning, and **Scikit-learn** for traditional machine learning. We also cover essential data handling libraries like Pandas and NumPy, and visualization tools like Matplotlib and Seaborn.",
      },
      {
        question: "How often is the tutorial content updated?",
        answer:
          "We regularly update our content to reflect the latest stable versions of Python, major ML libraries, and best coding practices. Machine learning is a fast-moving field, and we strive to keep our tutorials current.",
      },
    ],
  },
  {
    title: "Subscription and Access",
    questions: [
      {
        question: "Do I need a subscription to access the tutorials?",
        answer:
          "This depends on your site model. (Placeholder Answer: Most of our introductory tutorials and foundational guides are **free**. Premium, in-depth courses, and specialized project guides may require a paid subscription for full access.)",
      },
      {
        question: "What is your refund policy for paid courses?",
        answer:
          "We offer a full, no-questions-asked refund within 30 days of purchase if you are not satisfied with the quality of the content. Our goal is for you to gain valuable skills.",
      },
      {
        question: "Can I download the code examples?",
        answer:
          "Yes. All code examples, project notebooks, and datasets related to the tutorials are available for download, usually through a linked GitHub repository or direct download links within the lesson.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              If you can't find what you're looking for,{" "}
              <a href="/contact" className="underline underline-offset-4">
                get in touch
              </a>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};