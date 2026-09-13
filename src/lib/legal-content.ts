/**
 * Fallback copy for /terms-and-conditions and /legal-disclaimer — the exact text that used
 * to be hardcoded in those pages, now used only as a seed. Both public pages and the admin
 * editor fall back to this when the backend's stored `content` is still empty ("" — no admin
 * has saved anything yet), so the site never regresses to blank legal pages and the admin
 * editor opens pre-filled with real copy ready to save.
 */

export const DEFAULT_TERMS_AND_CONDITIONS = `Welcome to Native Medical Education. These Terms and Conditions ("Agreement") outline the rules and regulations for using our website ("Website"). By subscribing or accessing our services, you agree to comply with these terms. If you do not agree, please discontinue use of the Website immediately.

## 1. Membership Access for Our MRCGP SCA Mock Case Bank

### 1.1 Subscription Details
Access to our MRCGP revision case bank is provided through a monthly subscription of £19.99 (the "Subscription Fee").

### 1.2 Personal Membership Use
Your membership is strictly for individual use. Sharing login credentials or allowing multiple users to access content under one account is prohibited. Each member must have their own subscription.

### 1.3 Age Requirement
You must be at least 18 years old (or the legal age of majority in your jurisdiction) to become a member. By subscribing, you confirm you meet this requirement.

## 2. Intellectual Property & Usage Rights

### 2.1 Ownership of Materials
All revision documents, images, videos, and educational materials ("Content") provided on the Website are the exclusive property of Native Medical Education. All rights are reserved.

### 2.2 Permitted Use
As a member, you receive a limited, personal, non-transferable, and revocable license to access and use the Content for study purposes only. You must not:

- Copy, share, distribute, or reproduce any Content
- Modify or create derivative works from the Content
- Use the materials for commercial purposes

### 2.3 Copyright Protection
Any unauthorized use, distribution, or reproduction of our Content will result in legal action. We actively monitor for copyright infringement.

## 3. Payments, Renewals & Cancellations

### 3.1 Extensive Course Booking
When you enroll in an Extensive Course, your booking includes:

- Access to all course materials for 3 months from the start of your course.
- A non-transferable enrollment, meaning you cannot switch to a different course cohort once your course has begun.
- If you book a course for January but later decide to attend in February, you will need to pay separately for the February course. Payment for one cohort cannot be carried over to another.

### Extensive Course Cancellation & Refund Policy
If you wish to cancel your booking, the following refund policy applies:

- Cancellation 11 days or more before the course start date → You will receive a refund, but a £50 cancellation fee will be deducted.
- Cancellation 10 days or fewer before the course start date → No refund will be issued.

### 3.2 1-on-1 Sessions with Dr. Native — Booking & Cancellation Policy
For 1-on-1 coaching sessions, refunds are subject to the following terms:

- Cancellation 11 days or more before the session date → You will be refunded, minus a £50 cancellation fee.
- Cancellation 10 days or fewer before the session date → No refund will be provided.

By booking an Extensive Course or 1-on-1 Session, you acknowledge and agree to these terms. If you have any questions regarding your booking, please contact us before making a payment.

### 3.3 SCA Question Bank — Monthly Subscription Policy
By subscribing to our MRCGP SCA Question Bank, you gain access to our extensive collection of practice cases on a monthly subscription basis.

Please note that all payments are non-refundable. Once your payment has been processed, no refunds will be issued, regardless of usage or cancellation. By subscribing, you acknowledge and agree to these terms.

## 4. Disclaimers & Limitations of Liability

### 4.1 Website Functionality
We strive for continuous service availability, but we do not guarantee that the Website will be free from disruptions, slowdowns, or technical issues.

### 4.2 Accuracy of Materials
While we ensure our revision cases and learning materials align with MRCGP standards, we do not guarantee their absolute accuracy or completeness. You use the Content at your own discretion.

### 4.3 Liability Limitation
To the fullest extent permitted by law, Native Medical Education will not be held liable for:

- Loss of profits, data, or revenues due to reliance on Content
- Service disruptions or technical malfunctions
- Errors, outdated information, or changes in examination formats

## 5. Governing Law & Legal Jurisdiction

### 5.1 Applicable Laws
These Terms are governed by the laws of the United Kingdom. Any disputes shall be handled in accordance with UK legal regulations.

### 5.2 Dispute Resolution
Any disputes or legal claims arising from this Agreement shall fall under the exclusive jurisdiction of UK courts.

## 6. Additional Terms

### 6.1 Entire Agreement
These Terms represent the entire agreement between you and Native Medical Education, overriding any prior discussions or arrangements.

### 6.2 Modifications to Terms
We reserve the right to update or modify these Terms at any time without prior notice. Any changes will take immediate effect upon being posted on the Website. Continued use of the Website indicates acceptance of the new Terms.

### 6.3 Severability Clause
If any provision within these Terms is deemed unenforceable or invalid, the remaining provisions will still remain in full effect.

### 6.4 Feedback & Testimonials
By submitting feedback, testimonials, or reviews, you grant Native Medical Education the right to publish or use your comments on the Website or promotional materials.

By accessing or using our Website, you confirm that you have read, understood, and agree to abide by these Terms and Conditions.

For any questions or queries, please contact us directly.`;

export const DEFAULT_LEGAL_DISCLAIMER = `## Disclaimer

The cases presented in our MRCGP SCA practice question bank resource are entirely fictional and created purely for educational purposes. They are products of imagination and do not represent any real-life patients, clinical scenarios, or official examination questions. Any resemblance to actual exam cases, individuals, or medical situations is purely coincidental and unintentional. These cases are designed to illustrate key learning points and should not be interpreted as direct medical advice or a substitute for clinical judgment. Medicine is a dynamic and evolving field, and while every effort has been made to align the content with current best practices, guidelines and clinical approaches may vary based on location, healthcare setting, and individual patient factors.

Healthcare professionals should always use their own clinical judgment and refer to the latest guidelines and recommendations from relevant authorities when making decisions in real-world practice. The authors do not assume responsibility for any consequences resulting from the use of the information provided in this resource.`;
