/**
 * Central GSAP setup.
 *
 * Registering plugins in one place keeps tree-shaking predictable and means
 * every component imports the *same* configured gsap instance.
 *
 * NOTE: ScrollTrigger, ScrollToPlugin, Observer, MotionPathPlugin and the
 * Flip plugin all ship with the free GSAP package (`gsap/dist/...`).
 * No Club GreenSock membership is required for anything used in this project.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Observer, MotionPathPlugin, Flip);

// Slightly snappier global defaults that feel premium rather than sluggish.
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger, Observer, MotionPathPlugin, Flip };
