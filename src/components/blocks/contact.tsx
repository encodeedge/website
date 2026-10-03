import React, { useState } from "react";
import { Youtube, Linkedin, Twitter, CheckCircle2 } from "lucide-react";

import { DashedLine } from "../dashed-line";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackContactFormSubmit, trackGenerateLead } from "@/lib/analytics";

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
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    employees: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackContactFormSubmit("inquiries_block");
    trackGenerateLead("contact_inquiry", 10);
    setSubmitted(true);
  };

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

          {submitted ? (
            <div className="mt-8 p-6 rounded-2xl border border-green-500/30 bg-green-50/50 dark:bg-green-950/20 text-center space-y-3">
              <CheckCircle2 className="size-10 text-green-600 dark:text-green-400 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">Message Received!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Thank you for reaching out. We have received your inquiry and our team will get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-2"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  required
                  placeholder="First and last name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Work email address</Label>
                <Input
                  required
                  placeholder="me@company.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Company name{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Number of employees{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  placeholder="e.g. 10-50"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Your message</Label>
                <Textarea
                  required
                  placeholder="Write your message"
                  className="min-h-[120px] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button size="lg" type="submit" className="">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
