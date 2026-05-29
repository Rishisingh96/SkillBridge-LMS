import {
  Code2,
  Globe,
  Smartphone,
  Brain,
  Megaphone,
} from "lucide-react";

export const blogCategories = {
  "Programming Language": {
    icon: Code2,

    sections: [
      {
        title: "Popular Languages",

        items: [
          {
            name: "JavaScript",
            slug: "javascript",
          },

          {
            name: "Python",
            slug: "python",
          },

          {
            name: "Java",
            slug: "java",
          },
        ],
      },
    ],
  },

  "Web Development": {
    icon: Globe,

    sections: [
      {
        title: "Frontend Framework",

        items: [
          {
            name: "React JS",
            slug: "react-js",
          },

          {
            name: "Angular",
            slug: "angular",
          },

          {
            name: "Vue JS",
            slug: "vue-js",
          },
        ],
      },

      {
        title: "Backend Framework",

        items: [
          {
            name: "Node JS",
            slug: "node-js",
          },

          {
            name: "Django",
            slug: "django",
          },

          {
            name: "Spring Boot",
            slug: "spring-boot",
          },
        ],
      },
    ],
  },

  "Android Development": {
    icon: Smartphone,

    sections: [],
  },

  "Digital Marketing": {
    icon: Megaphone,

    sections: [],
  },

  "AI/ML": {
    icon: Brain,

    sections: [],
  },
};