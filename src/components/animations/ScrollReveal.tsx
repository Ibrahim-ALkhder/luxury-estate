import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export default function ScrollReveal({ children, className, direction = 'up', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from: any = { opacity: 0 };
    if (direction === 'up') from.y = 50;
    else if (direction === 'down') from.y = -50;
    else if (direction === 'left') from.x = 30;
    else if (direction === 'right') from.x = -30;

    gsap.fromTo(el, from, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, [direction, delay]);

  return <div ref={ref} className={className}>{children}</div>;
}