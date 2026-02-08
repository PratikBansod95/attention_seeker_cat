# Attention Seeker Cat

A simple, mobile-first web app that plays videos based on touch interactions.

## Project Structure

```
/
├── public/
│   └── assets/        <-- Place your media files here
│       ├── Image1.jpg
│       ├── video1.mp4
│       └── video2.mp4
├── src/               (Vite defaults involve src, but we use root for simplicity)
├── index.html         <-- Main entry point
├── style.css          <-- Styles
├── main.js            <-- Logic
├── package.json       <-- Dependencies
└── vite.config.js     <-- Build config
```

## Setup Instructions

1.  **Install Dependencies**:
    Run `npm install` in your terminal.

2.  **Add Your Assets**:
    Place your media files in the `public/assets` folder with the following exact names (ensure extensions match or update `index.html`):
    -   `Image1.jpg` (The initial full-screen image)
    -   `video1.mp4` (The video that plays while holding touch)
    -   `video2.mp4` (The video that loops when not touching)

    *Note: If your files use different extensions (e.g. `.png`, `.webm`), please update the `src` attributes in `index.html` accordingly.*

3.  **Run Locally**:
    Run `npm run dev` to start the local development server.
    Open the provided URL on your mobile device (on the same network) or use browser developer tools (Toggle Device Toolbar) to simulate touch events.

## Deployment on Vercel

1.  Push this code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Vercel will automatically detect the Vite framework settings.
4.  Click **Deploy**.

## Behavior

-   **Load**: Shows `Image1`.
-   **Touch & Hold**: Hides image, plays `video1`.
-   **Release**: Stops `video1`, plays `video2` (loop).
-   **Touch Again**: Switches back to `video1`.
