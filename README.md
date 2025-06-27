# 🗳️ Registracija za glasanje iz inostranstva

Ovo je alat koji omogućava građanima Srbije koji žive u inostranstvu da se brzo,
jednostavno i ispravno registruju za glasanje na izborima.  
Naš cilj je da olakšamo proces registracije i omogućimo većem broju ljudi da
iskoristi svoje biračko pravo, bez komplikacija, štampanja i zbunjujućih
procedura.

---

## ✨ O projektu

Ovaj projekat je inspirisan idejom koju je pokrenuo **Bogdan Đukić** 2017.
godine ([originalni kod](https://github.com/bdjukic/glasajDijasporo)).  
Nakon toga je rad nastavljen 2020. godine od strane **L. Vlažića**
([nastavak projekta](https://github.com/lvazic/glasanje)).  
Mi smo uzeli te osnove i modernizovali alat koristeći nove web tehnologije – sa
akcentom na brzinu, bezbednost i jednostavnost korišćenja.

---

## ❌ Kako je izgledao stari proces registracije?

1. Pronađi stranicu ambasade putem sajta Ministarstva spoljnih poslova
2. Nađeš uputstva za skidanje formulara za registraciju
3. Pronađeš mejl adresu na sajtu ambasade
4. Skineš formular (često lošeg kvaliteta)
5. Odštampaš formular
6. Ručno ga popuniš
7. Skenerom ili telefonom napraviš digitalnu kopiju
8. Pošalješ formular i sken pasoša na ambasadu putem mejla

⚠️ Problem: proces je dug, komplikovan, često obeshrabrujući – i mnogi zato
nikada ne pošalju prijavu.

---

## ✅ Novi proces uz pomoć ovog alata

1. Poseti [hocudaglasam.com](https://hocudaglasam.com)
2. Unesi sve tražene podatke (ime, JMBG, adresa u inostranstvu itd.)
3. Digitalno se potpiši
4. Dobijeni PDF sa automatski popunjenim formularom i tvojim podacima
5. Uz to priloži i sliku pasoša
6. Pošalji oba dokumenta na mejl adresu ambasade koju dobiješ na sajtu, u
   zavisnosti od zemlje prebivališta

🎯 Rezultat: brz, tačan i jednostavan proces bez štampanja, skeniranja ili
gubljenja vremena.

---

## 🔐 Privatnost i sigurnost

### Da li čuvate moje podatke?

**Ne.** Podaci se obrađuju isključivo na vašem uređaju, u pregledaču
(browseru).  
Čim zatvorite sajt ili preuzmete generisani dokument, svi uneti podaci
nestaju.  
Kod je potpuno transparentan i može se proveriti na GitHub-u.

### Kako mogu da budem siguran/na?

Sajt je napravljen po principima
[otvorenog koda](https://sr.wikipedia.org/wiki/Otvoren_kod), što znači da svako
može pregledati kako funkcioniše.  
Kod je javan i nalazi se na GitHub-u, pa ne postoji "tajni" deo koji bi mogao
zloupotrebiti podatke.  
Više o otvorenom kodu na
[Wikipedia (EN)](https://en.wikipedia.org/wiki/Open_source).

---

## ❓ Često postavljana pitanja

### Šta ako u mojoj zemlji nema ambasade ili konzulata?

Prema Zakonu o izboru narodnih poslanika
([član 52.](http://www.pravno-informacioni-sistem.rs/SlGlasnikPortal/eli/rep/sgrs/skupstina/zakon/2000/35/1/reg)),
biračko mesto u inostranstvu može biti otvoreno ako postoji najmanje **100
registrovanih birača** u toj zemlji ili gradu.  
Ako se dovoljno građana prijavi, ambasada/konzulat u saradnji sa RIK-om ima
obavezu da organizuje uslove za glasanje.

---

## 🧞 Tehnički detalji

Sledeće komande su namenjene programerima koji žele da rade na ovom projektu
lokalno:

| Komanda                   | Opis                                               |
| ------------------------- | -------------------------------------------------- |
| `npm install`             | Instalira projektne zavisnosti                     |
| `npm run dev`             | Pokreće razvojni server na `http://localhost:4321` |
| `npm run build`           | Pravi build sajta u `./dist/` direktorijumu        |
| `npm run preview`         | Pregled gotovog build-a pre produkcije             |
| `npm run astro ...`       | Pokreće razne Astro CLI komande                    |
| `npm run astro -- --help` | Prikazuje pomoć za rad sa Astro CLI                |

---

## 🛠️ Tehnologije koje koristimo

- **[Astro Framework](https://astro.build/)** – brz i moderan frontend framework
- **[React](https://reactjs.org/)** – za dinamičke komponente korisničkog
  interfejsa
- **[Node.js](https://nodejs.org/)** – JavaScript server okruženje koje pokreće
  aplikaciju

---

## 📚 Resursi

- [Dokumentacija za Astro](https://docs.astro.build)
- [React dokumentacija](https://reactjs.org/docs/getting-started.html)
- [Node.js dokumentacija](https://nodejs.org/en)

---

## 📄 Licenca

Ovaj projekat je objavljen pod [GPL licencom](./LICENSE), što znači da ga možete
slobodno koristiti, menjati i distribuirati uz poštovanje odredbi licence.

---

## ❤️ Hvala

Hvala svim članovima dijaspore koji ne odustaju od svog prava da glasaju – ovaj
alat je za vas.
