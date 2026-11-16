# React + Vite

## Deployment configuration

The frontend uses `VITE_API_BASE_URL` as its backend URL. Set it in the frontend
host's build environment to the deployed API URL (for example,
`https://image-prompt-management-backend.onrender.com`) and rebuild/redeploy.
If it is unset, the frontend uses that URL by default.

The backend allows `https://braynexai.netlify.app` by default. To allow
additional frontend domains, set `FRONTEND_ORIGINS` in the backend host's
environment to the origins, including the scheme and no trailing slash (for
example, `https://your-app.example.com`). For multiple domains, separate the
origins with commas, then redeploy the backend.

Local development origins `http://localhost:5173` and `http://localhost:3000`
remain allowed. Google Drive requests use the same configured backend URL.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
