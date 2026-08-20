# Kereskedelem és marketing – mintatanterv folyamatábra

Neumann János Egyetem, Gazdaságtudományi Kar · alapképzési szak, nappali tagozat
Érvényes: 2024. szeptember 1-től

**Élő verzió:** https://dinyakristof100.github.io/NJE_KM_2024_MINTATANTERV/

`index.html` – egyetlen önálló fájl, inline CSS + vanilla JS, külső függőség nélkül.
Asztali nézet (>720px): 7 félév oszlopokban, SVG Bézier-vonalak az előfeltételekhez.
Mobil nézet (≤720px): félév-választó legördülő + előzmény tárgyak szekció.

## Adatellenőrzés

Az adatok forrása a hivatalos mintatanterv PDF; a `mintatanterv.txt` ennek a
`pdftotext -layout -enc UTF-8` kimenete. Az ellenőrzés összeveti az `index.html`
`DATA`/`EDGES` tömbjeit a PDF szövegével (55 tárgy értékelés/kredit/EA/GY értéke,
félévenkénti összegek, 21 előfeltétel-él érvényessége):

```
node verify.js
```
