Verkkokauppa:Ostoskorit & Tuotteet – Selainohjelmoinnin kurssin harjoitustyö

Tämä on harjoitustyö, joka on tehty osana SeAMKin selainohjelmoinnin kurssia.  
Sivusto hyödyntää FakeStore API:a tuotteiden ja ostoskorien tietojen näyttämiseen.

Sivustolla on neljä eri HTML-sivua:

- index.html – etusivu, josta pääsee selaamaan tuotteita ja ostoskoreja  
- products.html – näyttää kaikki tuotteet, joita voi hakea nimellä  
- carts.html – hakee ostoskorien sisällöt API:sta ja näyttää tuotteet  
- about.html – tietoa projektista, validointi ja palautelomake  

Kaikki sivut käyttävät yhteistä style.css-tiedostoa sekä main.js ja api.js -tiedostoja.

Sovellus hyödyntää FakeStore API:a, joka tarjoaa testidataa tuotteista ja ostoskoreista.  
API:ta on käytetty fetch- ja jQuery-funktioiden avulla.  
Osa toiminnoista hyödyntää myös LocalStoragea (esimerkiksi suosikit ja ostoskori).

Julkaistu sivusto (GitHub Pages):  
https://anttipeltokangas.github.io/Verkkokauppa-harjoitustyo/

Julkaisu SeAMKin palvelimella:  
https://dos.seamk.fi/~epedu+k2302533/  

Kun yritin julkaista sivuston WinSCP:n kautta, tuli ilmoitus, että dos.seamk.fi-palvelin ei ole käytössä.  
Siksi julkaisu on tehty GitHub Pagesin kautta, ja sivusto toimii siellä täysin normaalisti.

Sivuston HTML ja CSS on validoitu W3C:n työkaluilla:

- https://validator.w3.org/
- https://jigsaw.w3.org/css-validator/

Videolla näytän:
- Sivuston toiminnan ja käyttöliittymän  
- API:n käytön ja tietojen esittämisen  
- Suosikkien ja ostoskorin toteutuksen LocalStoragella  
- Kehityksen aikana tulleet haasteet ja niiden ratkaisut  
- Oman arvion työstä ja arvosanaehdotuksen  

 2025 Antti Peltokangas – SeAMK / Selainohjelmointi
