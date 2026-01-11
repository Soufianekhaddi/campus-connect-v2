React-based email templates (react-email)

This project prefers Resend for SMTP sending. If you want to author email templates with `react-email` you can:

1. Create components under `server/emails/` using `react` and `@react-email/components`.
2. Build/render them to HTML at runtime or pre-render them during a build step using `@react-email/render` or `react-dom/server`.

Example (development workflow):

- Create `VerificationEmail.jsx` as a React component.
- Use `@babel/register` or an esbuild script to transpile JSX at runtime, or pre-render to HTML and store the file.

Because adding a JSX build step in this minimal server is extra work, current server sends a simple HTML string. If you want, I can add a small build step to compile `react-email` templates and render them before sending.
