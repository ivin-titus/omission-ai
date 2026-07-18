# Guide: Going Live with Clerk & Vercel (Production)

You successfully set up Clerk in **Development** mode. Development mode is great for localhost, but it will NOT work when you deploy your site to Vercel for the judges. Development mode uses "Test Keys" (they start with `pk_test_`).

For production, you need "Live Keys" (they start with `pk_live_`). Here is the step-by-step guide to deploying this correctly.

---

## Phase 1: Deploy to Vercel First
You need to deploy to Vercel *before* finalizing Clerk, because Clerk needs to know what your live URL is!

1. Go to [vercel.com](https://vercel.com/) and sign in.
2. Click **Add New > Project**.
3. Import your `omission-ai` GitHub repository.
4. **Environment Variables:** For now, just paste in your Database URL and AI Keys. (Leave the Clerk keys empty or put the test ones in temporarily just so the build doesn't crash).
5. Click **Deploy**.
6. Once deployed, Vercel will give you a live domain (e.g., `https://omission-ai.vercel.app`). **Copy this URL.**

---

## Phase 2: Switch Clerk to Production
Now we tell Clerk about your live Vercel URL.

1. Go back to your [Clerk Dashboard](https://dashboard.clerk.com/).
2. Look at the top right of the dashboard. You will see a toggle switch that says **Development | Production**.
3. Toggle it to **Production**. 
4. Clerk will ask you to set up your production instance. It will ask for your **Application Homepage** or **Domain**.
5. Paste the Vercel URL you copied in Phase 1 (e.g., `omission-ai.vercel.app`).
6. Complete the setup. Clerk will now generate **Live Keys**.
   * Note: Clerk might ask you to verify DNS records. For a hackathon, Vercel subdomains usually bypass strict domain verification, but follow Clerk's on-screen instructions if it asks you to add CNAME records in Vercel.

---

## Phase 3: Add Live Keys to Vercel
1. Copy your new **Live Keys** from Clerk. They should look like:
   * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`
   * `CLERK_SECRET_KEY=sk_live_...`
2. Go back to your Vercel Dashboard for `omission-ai`.
3. Go to **Settings > Environment Variables**.
4. Add the Live Keys.
5. **CRITICAL STEP:** After adding environment variables in Vercel, you must redeploy! Go to the **Deployments** tab in Vercel, click the three dots on your latest deployment, and click **Redeploy**.

---

## Summary Checklist for the Demo
* When you run `pnpm dev` locally, your `.env.local` should have the `pk_test_` keys.
* When the judges look at your Vercel URL, Vercel is using the `pk_live_` keys securely in the cloud.
* Authentication will now work flawlessly on the live internet!
