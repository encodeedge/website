import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const FAQItem = ({
  question,
  answer,
  value = "",
}: {
  question: string;
  answer: string;
  value?: string;
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        <div>{answer}</div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQItem;
