import type { Lang } from '@/i18n/types';

export interface Testimonial {
  text: Record<Lang, string>;
  author: string;
  role: string;
  avatar: string;
  url: string;
}

export const testimonials: Testimonial[] = [
  {
    text: {
      es: 'He tenido la oportunidad de trabajar con Aitor y he de decir que es una persona comprometida con aprender y resolver los problemas que se le ponen por delante. Siempre está dispuesto a escuchar para tener una visión más completa y resolver el problema en equipo. Es un gran profesional que ha sabido adaptarse al desarrollo de software viniendo de un mundo totalmente distinto.',
      en: 'I had the opportunity to work with Aitor and I have to say he is someone truly committed to learning and solving the problems in front of him. He is always willing to listen to get a fuller picture and tackle the problem as a team. He is a great professional who has managed to adapt to software development coming from a completely different world.',
    },
    author: 'Aitor Santana',
    role: 'Software Developer · Lean Mind',
    avatar: '/images/testimonials/aitor-santana.webp',
    url: 'https://www.linkedin.com/in/aitorscinfo/',
  },
  {
    text: {
      es: 'Conozco a Aitor desde que compartimos aprendizaje en el CFGS. Desde entonces hemos cimentado nuestra amistad debatiendo sobre patrones de diseño, descubriendo nuevos frameworks o proponiendo nuevas formas de resolver problemas en el ámbito del desarrollo. El criterio de Aitor, basado en su experiencia, es de un alto valor. He visto su crecimiento y estoy orgulloso de lo que ha conseguido desde la humildad y el respeto a los demás. Ha construido una carrera preguntando cuando no sabía, compartiendo lo aprendido y celebrando los éxitos de los equipos de los que ha formado parte.',
      en: "I've known Aitor since we studied together in the CFGS. Since then we've built our friendship debating design patterns, discovering new frameworks, and finding new ways to solve problems in software development. Aitor's judgement, grounded in experience, is genuinely valuable. I've watched him grow and I'm proud of what he has achieved through humility and respect for others. He has built a career by asking when he didn't know, sharing what he learned, and celebrating the wins of every team he has been part of.",
    },
    author: 'Luis S. Ruiz',
    role: 'Software Developer · ITECH Global Solutions',
    avatar: '/images/testimonials/luis-s-ruiz.webp',
    url: 'https://www.linkedin.com/in/luis-s-ruiz/',
  },
  {
    text: {
      es: 'Una persona hecha a sí misma, alguien resiliente, capaz de enfrentarse a una situación nueva y salir fortalecido, alguien que afronta lo desconocido con ilusión y curiosidad, sumando a su mochila de saberes todas las experiencias y conocimientos de cada empresa que afronta. Una persona dialogante con la que te da gusto interactuar, alguien que escucha y reflexiona, alguien que apoya y resuelve. El compañero que te gusta tener contigo en la trinchera. Sin duda, un amigo.',
      en: 'A self-made person, someone resilient, capable of facing a new situation and coming out stronger. Someone who embraces the unknown with excitement and curiosity, adding to their backpack of knowledge all the experiences from every company they work with. A person easy to talk to, someone who listens and reflects, who supports and solves. The teammate you want by your side in the trenches. Without a doubt, a friend.',
    },
    author: 'Fran Correa',
    role: 'Head of Employee Engagement · Lean Mind',
    avatar: '/images/testimonials/francisco-correa.webp',
    url: 'https://www.linkedin.com/in/francisco-correa-82a142234/',
  },
  {
    text: {
      es: 'Aitor es de esas personas que hacen mejor cualquier equipo. Inteligente, metódico y honesto, no se queda en la superficie, se preocupa por entender bien los problemas para resolverlos con criterio y calidad. Además, combina algo muy valioso: rigor técnico, calma y una enorme calidad humana. Siempre está dispuesto a ayudar, sabe decir lo que piensa cuando hace falta y lo hace con respeto, serenidad y compostura. Me encantó trabajar con él y me lo llevaría a cualquier equipo sin dudarlo.',
      en: 'Aitor is one of those people who makes any team better. Intelligent, methodical and honest, he never stays on the surface — he takes care to truly understand problems in order to solve them with judgement and quality. On top of that, he combines something truly valuable: technical rigour, composure, and an enormous human quality. He is always willing to help, knows how to speak his mind when needed, and does so with respect, calm, and poise. I loved working with him and would bring him to any team without hesitation.',
    },
    author: 'Mánu Fosela',
    role: 'Head of Engineering · Global Hybrid Orthodontics',
    avatar: '/images/testimonials/manu-fosela.webp',
    url: 'https://www.linkedin.com/in/manufosela/',
  },
  {
    text: {
      es: 'Aitor es una persona que destaca por su constancia, curiosidad y compromiso con el trabajo bien hecho. Tiene un interés genuino por seguir aprendiendo, algo que se refleja claramente en cómo aplica ese conocimiento en su día a día cuando escribe código siguiendo buenas prácticas y patrones. No se queda en lo superficial y le gusta trabajar con criterio; el TDD es su guía. Además, es una persona muy colaborativa: comparte lo que aprende, ayuda al equipo y contribuye a mantener un entorno de trabajo equilibrado y enfocado. Sin duda, aporta desde el primer momento, tanto por su forma de trabajar como por su conocimiento, y es muy fácil colaborar con él en el día a día.',
      en: 'Aitor stands out for his consistency, curiosity, and commitment to doing things right. He has a genuine interest in continuous learning, something clearly reflected in how he applies that knowledge day to day — writing code that follows good practices and patterns. He goes beyond the surface and likes to work with real judgement; TDD is his guide. He is also highly collaborative: he shares what he learns, helps the team, and contributes to a balanced, focused work environment. He brings value from day one, both in how he works and in what he knows, and collaborating with him is genuinely easy.',
    },
    author: 'Luis Rodríguez',
    role: 'Software Developer · Lean Mind',
    avatar: '/images/testimonials/luis-rodriguez.webp',
    url: 'https://www.linkedin.com/in/luis-gabriel-rodr%C3%ADguez-alejos-8ba69237/',
  },
  {
    text: {
      es: 'Conocí a Aitor en 2° DAW y desde el principio destacó por ser una persona muy aplicada y con un interés real por el desarrollo web. Se notaba que no solo venía con lo aprendido en la FP, sino con muchas ganas de seguir creciendo y aprendiendo por su cuenta. Aunque no he trabajado con él en empresa, siempre fue un gran compañero: dispuesto a ayudar, compartir conocimientos y aprender de cualquier situación. Además, siempre es un placer quedar a tomar un café y debatir sobre nuevas tecnologías y los proyectos en los que andamos trabajando.',
      en: 'I met Aitor in the 2nd year of DAW and from the very beginning he stood out as someone truly dedicated, with a real passion for web development. You could tell he was not just bringing what he had learned in the vocational programme, but a genuine drive to keep growing and learning on his own. Even though we have not worked together professionally, he was always a great classmate: willing to help, share knowledge, and learn from any situation. On top of that, it is always a pleasure to meet for a coffee and discuss new technologies and the projects we are working on.',
    },
    author: 'Raquel V.',
    role: 'Frontend Developer · Laberit Sistemas',
    avatar: '/images/testimonials/raquel-vidal.webp',
    url: 'https://www.linkedin.com/in/raquel-vidal-ramirez-0771b4241/',
  },
  {
    text: {
      es: '¡Compartir equipo de desarrollo con Aitor es jugar en modo fácil! Me he sentido increíblemente cómodo a su lado gracias a su inmensa flexibilidad y su talento para aprender rapidísimo. Destaco muchísimo su forma de relacionarse: tiene una comunicación y un feedback asertivos que te impulsan a ser mejor profesional, siempre desde el cariño y la sensibilidad. Es un compañero comprometido al 100%, que siempre está dispuesto a darte su acompañamiento.',
      en: 'Sharing a development team with Aitor is like playing on easy mode! I felt incredibly comfortable alongside him thanks to his tremendous flexibility and his talent for learning incredibly fast. What stands out most is the way he connects with people: his assertive communication and feedback push you to become a better professional, always with warmth and sensitivity. He is a 100% committed teammate who is always ready to support you.',
    },
    author: 'Ricardo García',
    role: 'Software Developer · Lean Mind',
    avatar: '/images/testimonials/ricardo-garcia.webp',
    url: 'https://www.linkedin.com/in/ricardo-garc%C3%ADa-dorta-815844165/',
  },
];
