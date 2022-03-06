'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
// use '#' for id's and '.' for classes
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button Scrolling
// Implementing Smooth Scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// // use '#' for id's and '.' for classes
// const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());

  // getBoundingClientReact is basically relative to visible viewport
  // console.log('Current scrolll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport:',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  section1.scrollIntoView({ behavior: 'smooth' });
  // Scrolling
  // window
  // .scrollTo
  // s1coords.left + window.pageXOffset, //current position + current scroll
  // s1coords.top + window.pageYOffset
  // ();

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, //current position + current scroll
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  // const clicked = e.target.parentElement;
  const clicked = e.target.closest('.operations__tab');
  // Guard Clause
  if (!clicked) return;
  // Remove active classes on both the 'operations__tab' and 'operations__content'
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Active tab
  clicked.classList.add('operations__tab--active');
  // Activate tab content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// The element that was clicked is indeed stored in our variable 'clicked'

// Menu fade animation
// 'mouseenter' does not bubble whereas 'mouseover' does
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing "argument" into an handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// This callback function here will get called each time that the observed element(target element here = 'section1') is intersecting the root element at the threshold that we defined

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2], //threshols is the %age that we want to have visible in our root(viewport, in this case). ---->> 0% means that our callback will trigger each time that the targer element moves completely out of the view and also as soon as it enters the view
// };
// This root is the element that the target is intersecting
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section2);
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  // We are using this to get the first element (entry) out of entries. It is the same as writing entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
// Sections Reveal
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

const slider = function () {
  // Slider Component
  const slides = document.querySelectorAll('.slide');
  // const slider = document.querySelector('.slider');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;

  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.transform = 'visible';

  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  // 0%, 100%, 200%, 300% : first slide should be at 0%, second slide should be at 100%, and so on and so forth

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers/functions
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
// -100%, 0%, 100%, 200%
// Previous Slide
/*
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Selecting Elements
// console.log(document);
// console.log(document.documentElement);
// const headerEl = document.querySelector('.header');
// console.log(headerEl);
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);
// const id = document.getElementById('section--1');
// console.log(id);
// const className = document.getElementsByClassName('btn');
// console.log(className);
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creating and inserting elements
// const d1 = document.querySelector('#one');
// d1.insertAdjacentHTML('afterbegin', '<div class="two">two</div>');
// console.log(d1);

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it! </button>';

// prepend() basically adds the element as the first child of the adjoined element & we can also add it as the last child. By experiment, the order of heirarchy also matters here.
// headerEl.prepend(message);
// headerEl.append(message);
// console.log(message);
// headerEl.append(message.cloneNode(true));
// headerEl.before(message);
// headerEl.after(message);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Deleting Elements
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
// message.remove();
// message.parentElement.removeChild(message);
// });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// console.log(message.style.display);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// console.log(getComputedStyle(message).fontSize);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 43 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'blue');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.id);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo of Bankist website';

//Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.nav__link--btn');
// console.log(link.getAttribute('href'));
// console.log(link.href);

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('c');
// logo.classList.remove('c', 'k');
// logo.classList.toggle('a');
// logo.classList.contains('a');    //not includes
// Don't use
// logo.className = 'wasey'

// Implementing Smooth Scrolling
// const btnScrollTo = document.querySelector('.btn--scroll-to');
//  use '#' for id's and '.' for classes
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect());

// getBoundingClientReact is basically relative to visible viewport
// console.log('Current scrolll (X/Y)', window.pageXOffset, window.pageYOffset);

// console.log(
//   'height/width viewport:',
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );

// Scrolling
// window
// .scrollTo
// s1coords.left + window.pageXOffset, //current position + current scroll
// s1coords.top + window.pageYOffset
// ();

// window.scrollTo({
//   left: s1coords.left + window.pageXOffset, //current position + current scroll
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth',
// });
//   section1.scrollIntoView({ behavior: 'smooth' });
// });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Events and Event Listeners
// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEventListener: Good job! You experienced the "mouseenter" event ');
// };
// h1.addEventListener('mouseenter', alertH1);
// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 2000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Good job! You are reading the heading ');
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event Propagation: BUBBLING and CAPTURING
// rgb(255,255,255)
// rgb(0,0,0)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// randomColor(0, 255);
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// console.log('LINK:', e.target, e.currentTarget);
// console.log(e.currentTarget === this);

// And the target is essentially where the event originated.So where the event first happened.
// Stop Propagation
//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER:', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV:', e.target, e.currentTarget);
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM Traversing
// const h1 = document.querySelector('h1');

// Going downwards: selecting child elements
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'orange';
// h1.lastElementChild.style.color = '#f1245d';

// Going upwards: selecting parent elements
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';
// 'closest' being the opposite of 'querySelector'
// 'querySelector' finds children, no matter how deep in the DOM tree,while 'closest' method finds parents, no matter how deep in the DOM tree.

// Going sideways: siblings
// We can only access direct siblings, so the previous and the next one
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
*/
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM content loaded!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page content loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
