import { Youtube, Linkedin, Twitter } from "lucide-react";

import { DashedLine } from "../dashed-line";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
  {
    title: "Corporate office",
    content: (
      <p className="text-muted-foreground mt-3">
        Lane no 6, SantNagar
        <br />
        Pune, Maharashtra 411047
      </p>
    ),
  },
  {
    title: "Email us",
    content: (
      <div className="mt-3">
        <div>
          <p className="">Support</p>
          <a
            href="mailto:support@encodeedge.com"
            className="text-muted-foreground hover:text-foreground"
          >
            support@encodeedge.com
          </a>
        </div>
        <div className="mt-1">
          <p className="">Submit An Article</p>
          <a
            href="mailto:info@encodeedge.com"
            className="text-muted-foreground hover:text-foreground"
          >
            info@encodeedge.com
          </a>
        </div>
      </div>
    ),
  },
  {
    title: "Follow us",
    content: (
      <div className="mt-3 flex gap-6 lg:gap-10">
        <a href="https://www.youtube.com/@encodeedge" className="text-muted-foreground hover:text-foreground">
          <Youtube className="size-5" />
        </a>
        <a href="https://x.com/encodeedge" className="text-muted-foreground hover:text-foreground">
          <Twitter className="size-5" />
        </a>
        <a href="https://www.linkedin.com/company/encodeedge" className="text-muted-foreground hover:text-foreground">
          <Linkedin className="size-5" />
        </a>
      </div>
    ),
  },
];

export const Contact = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-2xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Contact us
        </h1>
        <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
          Hopefully this form gets through our spam filters.
        </p>

        <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
          {contactInfo.map((info, index) => (
            <div key={index}>
              <h2 className="font-medium">{info.title}</h2>
              {info.content}
            </div>
          ))}
        </div>

        <DashedLine className="my-12" />

        {/* Inquiry Form */}
        <div className="mx-auto">
          <h2 className="text-lg font-semibold">Inquiries</h2>
          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input placeholder="First and last name" />
            </div>
            <div className="space-y-2">
              <Label>Work email address</Label>
              <Input placeholder="me@company.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>
                Company name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input placeholder="Company name" />
            </div>
            <div className="space-y-2">
              <Label>
                Number of employees{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input placeholder="e.g. 10-50" />
            </div>
            <div className="space-y-2">
              <Label>Your message</Label>
              <Textarea
                placeholder="Write your message"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button size="lg" type="submit" className="">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
