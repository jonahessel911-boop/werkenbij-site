# Werken bij Batterijconcept

Vacature-site voor Batterijconcept — live op **werkenbij.batterijconcept.nl**.

De consumentenwebsite staat apart op [batterijconcept.nl](https://www.batterijconcept.nl/).

## Lokaal

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Koppel domein `werkenbij.batterijconcept.nl` aan dit project. Pushes naar `main` deployen automatisch.

```bash
npm run build
npx vercel --prod
```

## Pagina’s

- `/` — vacatures (home)
- `/sales-vacature` — ZZP sales vacature check
- `/appointment-vacature` — appointment setter vacature check

Oude consumentenroutes (`/producten`, `/service`, enz.) redirecten naar batterijconcept.nl.
