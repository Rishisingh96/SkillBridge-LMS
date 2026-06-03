import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How do I access my purchased courses?",
    answer:
      "Once you enroll, courses are instantly available inside your student dashboard and can be accessed anytime.",
  },
  {
    question: "Do courses include certificates?",
    answer:
      "Yes. After completing course requirements, you can download your verified certificate directly from your dashboard.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely. Most courses are self-paced, allowing you to learn whenever it is convenient for you.",
  },
  {
    question: "Do I get lifetime access?",
    answer:
      "Yes. Purchased courses come with lifetime access unless otherwise specified.",
  },
  {
    question: "Can I watch courses on mobile devices?",
    answer:
      "Yes. The platform is fully responsive and works seamlessly across mobile, tablet, and desktop devices.",
  },
  {
    question: "Do you provide mentor support?",
    answer:
      "Yes. Students can interact with instructors through discussions, live sessions, and support channels.",
  },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggleFaq = (index) => {
    setActive(active === index ? null : index);
  };

  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".faq-header",
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".faq-header",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Stagger animation for FAQ items
    gsap.fromTo(
      ".faq-item",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".faq-item",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 bg-slate-50 dark:bg-gray-900">

      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}

        <div className="faq-header text-center mb-16">

          <div className="inline-flex px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium mb-5">
            ❓ Frequently Asked Questions
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Got Questions?
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know before starting
            your learning journey with SkillBridge.
          </p>

        </div>

        {/* FAQ Items */}

        <div className="space-y-5">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="
              faq-item
              bg-white dark:bg-gray-800
              rounded-2xl
              border border-gray-200 dark:border-gray-700
              shadow-sm
              overflow-hidden
              "
            >

              <button
                onClick={() => toggleFaq(index)}
                className="
                w-full
                flex
                justify-between
                items-center
                text-left
                px-6
                py-5
                "
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {faq.question}
                </h3>

                <ChevronDown
                  className={`
                    transition-transform duration-300
                    ${
                      active === index
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ${
                    active === index
                      ? "max-h-40"
                      : "max-h-0"
                  }
                `}
              >
                <p className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-7">
                  {faq.answer}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default FAQ;