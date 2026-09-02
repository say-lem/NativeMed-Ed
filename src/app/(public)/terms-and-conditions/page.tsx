import SubtleText from "@/components/shared/SubtleText";

export const metadata = {
  title: "Terms & Conditions | Native Medical Education",
};

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-[120%] tracking-[-2%] text-black-others mt-4">
      {children}
    </h3>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-xs sm:text-sm md:text-base lg:text-lg leading-[150%] text-subtle-text font-light"
        >
          <span className="mt-2 size-2 rounded-full bg-primary-100 shrink-0" />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsAndConditions() {
  return (
    <>
      <section className="px-4 sm:px-8 md:px-10 lg:px-15 radialBgGradient pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-16 flex items-center justify-center">
        <h1 className="text-center font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2%] leading-[1.2] text-primary-100">
          Terms & Conditions
        </h1>
      </section>

      <section className="px-4 sm:px-8 md:px-10 lg:px-15 py-8 sm:py-10 md:py-14">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          <SubtleText text='Welcome to Native Medical Education. These Terms and Conditions ("Agreement") outline the rules and regulations for using our website ("Website"). By subscribing or accessing our services, you agree to comply with these terms. If you do not agree, please discontinue use of the Website immediately.' />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            1. Membership Access for Our MRCGP SCA Mock Case Bank
          </h2>

          <SubHeading>1.1 Subscription Details</SubHeading>
          <SubtleText text='Access to our MRCGP revision case bank is provided through a monthly subscription of £19.99 (the "Subscription Fee").' />

          <SubHeading>1.2 Personal Membership Use</SubHeading>
          <SubtleText text="Your membership is strictly for individual use. Sharing login credentials or allowing multiple users to access content under one account is prohibited. Each member must have their own subscription." />

          <SubHeading>1.3 Age Requirement</SubHeading>
          <SubtleText text="You must be at least 18 years old (or the legal age of majority in your jurisdiction) to become a member. By subscribing, you confirm you meet this requirement." />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            2. Intellectual Property & Usage Rights
          </h2>

          <SubHeading>2.1 Ownership of Materials</SubHeading>
          <SubtleText text='All revision documents, images, videos, and educational materials ("Content") provided on the Website are the exclusive property of Native Medical Education. All rights are reserved.' />

          <SubHeading>2.2 Permitted Use</SubHeading>
          <SubtleText text="As a member, you receive a limited, personal, non-transferable, and revocable license to access and use the Content for study purposes only. You must not:" />
          <Bullets
            items={[
              "Copy, share, distribute, or reproduce any Content",
              "Modify or create derivative works from the Content",
              "Use the materials for commercial purposes",
            ]}
          />

          <SubHeading>2.3 Copyright Protection</SubHeading>
          <SubtleText text="Any unauthorized use, distribution, or reproduction of our Content will result in legal action. We actively monitor for copyright infringement." />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            3. Payments, Renewals & Cancellations
          </h2>

          <SubHeading>3.1 Extensive Course Booking</SubHeading>
          <SubtleText text="When you enroll in an Extensive Course, your booking includes:" />
          <Bullets
            items={[
              "Access to all course materials for 3 months from the start of your course.",
              "A non-transferable enrollment, meaning you cannot switch to a different course cohort once your course has begun.",
              "If you book a course for January but later decide to attend in February, you will need to pay separately for the February course. Payment for one cohort cannot be carried over to another.",
            ]}
          />

          <SubHeading>Extensive Course Cancellation & Refund Policy</SubHeading>
          <SubtleText text="If you wish to cancel your booking, the following refund policy applies:" />
          <Bullets
            items={[
              "Cancellation 11 days or more before the course start date → You will receive a refund, but a £50 cancellation fee will be deducted.",
              "Cancellation 10 days or fewer before the course start date → No refund will be issued.",
            ]}
          />

          <SubHeading>3.2 1-on-1 Sessions with Dr. Native — Booking & Cancellation Policy</SubHeading>
          <SubtleText text="For 1-on-1 coaching sessions, refunds are subject to the following terms:" />
          <Bullets
            items={[
              "Cancellation 11 days or more before the session date → You will be refunded, minus a £50 cancellation fee.",
              "Cancellation 10 days or fewer before the session date → No refund will be provided.",
            ]}
          />
          <SubtleText text="By booking an Extensive Course or 1-on-1 Session, you acknowledge and agree to these terms. If you have any questions regarding your booking, please contact us before making a payment." />

          <SubHeading>3.3 SCA Question Bank — Monthly Subscription Policy</SubHeading>
          <SubtleText text="By subscribing to our MRCGP SCA Question Bank, you gain access to our extensive collection of practice cases on a monthly subscription basis." />
          <SubtleText text="Please note that all payments are non-refundable. Once your payment has been processed, no refunds will be issued, regardless of usage or cancellation. By subscribing, you acknowledge and agree to these terms." />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            4. Disclaimers & Limitations of Liability
          </h2>

          <SubHeading>4.1 Website Functionality</SubHeading>
          <SubtleText text="We strive for continuous service availability, but we do not guarantee that the Website will be free from disruptions, slowdowns, or technical issues." />

          <SubHeading>4.2 Accuracy of Materials</SubHeading>
          <SubtleText text="While we ensure our revision cases and learning materials align with MRCGP standards, we do not guarantee their absolute accuracy or completeness. You use the Content at your own discretion." />

          <SubHeading>4.3 Liability Limitation</SubHeading>
          <SubtleText text="To the fullest extent permitted by law, Native Medical Education will not be held liable for:" />
          <Bullets
            items={[
              "Loss of profits, data, or revenues due to reliance on Content",
              "Service disruptions or technical malfunctions",
              "Errors, outdated information, or changes in examination formats",
            ]}
          />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            5. Governing Law & Legal Jurisdiction
          </h2>

          <SubHeading>5.1 Applicable Laws</SubHeading>
          <SubtleText text="These Terms are governed by the laws of the United Kingdom. Any disputes shall be handled in accordance with UK legal regulations." />

          <SubHeading>5.2 Dispute Resolution</SubHeading>
          <SubtleText text="Any disputes or legal claims arising from this Agreement shall fall under the exclusive jurisdiction of UK courts." />

          <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl leading-[130%] -tracking-[2%] text-black-others pt-4">
            6. Additional Terms
          </h2>

          <SubHeading>6.1 Entire Agreement</SubHeading>
          <SubtleText text="These Terms represent the entire agreement between you and Native Medical Education, overriding any prior discussions or arrangements." />

          <SubHeading>6.2 Modifications to Terms</SubHeading>
          <SubtleText text="We reserve the right to update or modify these Terms at any time without prior notice. Any changes will take immediate effect upon being posted on the Website. Continued use of the Website indicates acceptance of the new Terms." />

          <SubHeading>6.3 Severability Clause</SubHeading>
          <SubtleText text="If any provision within these Terms is deemed unenforceable or invalid, the remaining provisions will still remain in full effect." />

          <SubHeading>6.4 Feedback & Testimonials</SubHeading>
          <SubtleText text="By submitting feedback, testimonials, or reviews, you grant Native Medical Education the right to publish or use your comments on the Website or promotional materials." />

          <SubtleText text="By accessing or using our Website, you confirm that you have read, understood, and agree to abide by these Terms and Conditions." />
          <SubtleText text="For any questions or queries, please contact us directly." />
        </div>
      </section>
    </>
  );
}
