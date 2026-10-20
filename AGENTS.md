<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Portfolio pages reuse the original static site: shared header/footer and per-page markup live in src/content/portfolio-body.ts, rendered via PortfolioShell; styles and behaviour script in public/portfolio/. Site links are plain anchors so each page is a full load and the script runs once (keeps the migrated design faithful).
- Contact queries are stored in contact_submissions via a server function using the admin client; the table has no anon/authenticated access.
