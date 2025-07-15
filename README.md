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
8. Pošalješ formular i skeniran/slikan pasoš ili ličnu kartu na ambasadu putem mejla

⚠️ Problem: proces je dug, komplikovan, često obeshrabrujući – i mnogi zato
nikada ne pošalju prijavu.

---

## ✅ Novi proces uz pomoć ovog alata

1. Poseti [dijasporaglasa.org](https://effortless-alfajores-9be653.netlify.app/)
2. Unesi sve tražene podatke (ime, JMBG, adresa u inostranstvu itd.)
3. Digitalno se potpiši
4. Na tvom računaru ćeš dobiti popunjen formular sa tvojim podacima
5. Uz to priloži sliku pasoša ili lične karte
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

---

## 🗂️ Priručnik: kako izgleda ceo proces glasanja iz dijaspore

Ovo su detalji celokupnog procesa, od provere dokumenata do dana izbora.

### 📌 Pre raspisivanja izbora

#### Biračko pravo

Glasačko pravo imaju svi državljani Republike Srbije sa važećim pasošem ili ličnom kartom.  
Ako ti je pasoš istekao, zahtev za novi dokument možeš podneti u najbližem diplomatsko-konzularnom predstavništvu (DKP).

🔗 [Informacije o putnim ispravama – mfa.gov.rs](https://www.mfa.gov.rs/gradjani/usluge/putne-isprave)

#### Provera upisa u birački spisak

Proveri da li si upisan/a u Jedinstveni birački spisak:

🔗 [upit.birackispisak.gov.rs](https://upit.birackispisak.gov.rs)

Ako nisi upisan/a, zahtev se podnosi nakon raspisivanja izbora.

#### Provera da li postoji ambasada u tvojoj zemlji

🔗 [Spisak ambasada i konzulata Srbije](https://www.mfa.gov.rs/lat/predstavnistva/predstavnistva-srbije-u-svetu/ambasade)

---

### ❓ Šta ako u tvojoj zemlji **nema ambasade** ili **konzulata**?

Ako ne postoji diplomatsko-konzularno predstavništvo Srbije u tvojoj zemlji:

1. **Možeš otputovati do najbližeg DKP-a**, npr. ako si na Islandu, najbliže su Kopenhagen ili Oslo.
2. **Možeš glasati u Srbiji**, ali moraš biti upisan u birački spisak i imati važeći dokument.

> ⚠️ Da bi se otvorilo biračko mesto u ambasadi/konzulatu, mora se prijaviti **najmanje 100 birača**. Ako ih nema dovoljno, to biračko mesto neće biti otvoreno.

---

### 🗳️ Nakon raspisivanja izbora

- **Zahtev za upis u birački spisak** se podnosi u DKP-u do 5 dana pre zatvaranja spiska.
- **Zahtev za glasanje u inostranstvu** se podnosi bez obzira da li ste ranije glasali.
- **Zahtev za potvrdu prijema** – preporučuje se slanje mejla DKP-u da potvrde da su primili tvoju prijavu.
- **Redovno proveravaj status** putem kontakta sa DKP-om (mejl, telefon, lično).
- **Biračko mesto** u inostranstvu se formira za 100–2500 birača (ili više/niže uz dozvolu RIK-a).

📄 Obrasci:  
🔗 [RIK formulari – eupropisi.com](https://www.eupropisi.com/dokumenti/SG_091_2023_002.docx)

---

### 🗓️ Na dan izbora

#### Prijavljivanje nepravilnosti

Prijavljuju se sledeće situacije:

- Propaganda na biračkom mestu
- Glasanje bez dokumentacije
- Uticaj članova biračkog odbora
- Problemi sa glasačkim listićima
- Prisutna policija bez osnova

✅ Nepravilnosti se prijavljuju biračkom odboru i unose u zapisnik.  
🕒 Rok za prijavu: do 24h nakon nepravilnosti.

🔗 [CeSID vodič o zaštiti biračkog prava (PDF)](https://www.cesid.rs/wp-content/uploads/2021/06/Vodi%C4%8D-za-za%C5%A1titu-izbornog-prava.pdf)

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
