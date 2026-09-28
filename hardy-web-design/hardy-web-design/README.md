# Hardy Web Design

Next.js + Tailwind + TypeScript site. For now it hosts the client questionnaire at `/questionnaire`
(the home page redirects there). When a client submits, the answers are turned into a PDF and emailed to you.

## Email setup (one time)

Submissions are sent with [Resend](https://resend.com) (free for up to 3,000 emails a month).

1. Sign up at resend.com with the email address you want the PDFs sent to.
2. Create an API key at resend.com/api-keys.
3. In Vercel: Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY` = your key
   - `NOTIFY_EMAIL` = the same email you signed up to Resend with
4. Redeploy (Deployments → ⋯ → Redeploy) so the new variables take effect.

Until you verify your own domain in Resend, emails come from `onboarding@resend.dev` and can only be
delivered to your Resend account's email. After verifying a domain, add `FROM_EMAIL`, for example
`Hardy Web Design <hello@yourdomain.com>`.

## Editing the questions

All questions live in `lib/questions.ts`. The form and the PDF both read from that list, so a change there
updates both.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

## Adding the portfolio later

Replace the redirect in `app/page.tsx` with a real home page, and add routes such as `app/work/page.tsx`.
