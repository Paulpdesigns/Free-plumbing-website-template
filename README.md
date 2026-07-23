# Plumbing website demo

A two page plumbing business site built with plain HTML, CSS, and JavaScript. No build step, no dependencies. Ready to deploy straight to GitHub Pages.

## What is included

- `index.html`, the homepage with hero, services, trust section, portfolio teaser, technician profiles, the custom quote checker, process steps, testimonial, and a contact form
- `portfolio.html`, a filterable gallery of completed jobs
- `css/style.css`, all styling and animations
- `js/main.js`, scroll reveal animations, the stat counters, the quote calculator logic, portfolio filtering, and the contact form behavior

All photos are pulled from Unsplash under the Unsplash License, which is free for commercial use. If you want the site to load faster and work without an internet connection to Unsplash, download the images and point the `src` and `background-image` attributes at your own `images` folder instead.

## Deploying to GitHub Pages

1. Create a new repository on GitHub, for example `anchor-plumbing`.
2. Upload every file in this folder to the repository, keeping the same folder structure, so `css` and `js` stay as subfolders.
3. In the repository, open Settings, then Pages.
4. Under Build and deployment, set Source to Deploy from a branch, choose the `main` branch and the root folder, then save.
5. Wait a minute or two, then your site will be live at `https://yourusername.github.io/anchor-plumbing/`.

If you plan to use a custom domain later, add a `CNAME` file at the root with the domain name in it, and point your domain's DNS at GitHub Pages.

## Customizing

- Business name, phone number, and copy live directly in `index.html` and `portfolio.html`.
- Colors, fonts, and spacing are all defined as CSS custom properties at the top of `css/style.css` under the `:root` selector, so changing the whole palette only needs edits in one place.
- The quote checker's pricing logic lives in `js/main.js` inside the `baseRates` and `sizeMultipliers` objects. Update the numbers there to match your own rate sheet.
- The contact form does not send email on its own since this is a static site. To make it functional, connect it to a form service such as Formspree or Netlify Forms, or wire the `submit` handler in `js/main.js` to your own backend.
