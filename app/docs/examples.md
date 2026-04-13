# HP-12C Calculator Examples / HP-12C Taschenrechner Beispiele

**🇬🇧 [English Version](#english-version) | 🇩🇪 [Deutsche Version](#deutsche-version)**

---

# Deutsche Version

Dieser Leitfaden bietet schrittweise Beispiele zur Verwendung des HP-12C Taschenrechners, von grundlegender Arithmetik bis zu fortgeschrittenen Finanzberechnungen.

## Inhaltsverzeichnis
- [Grundrechenarten](#grundrechenarten)
- [Mathematische Funktionen](#mathematische-funktionen)
- [Prozentberechnungen](#prozentberechnungen)
- [Speicheroperationen](#speicheroperationen)
- [Zeitwert des Geldes (TVM)](#zeitwert-des-geldes-tvm)
- [Cashflow-Analyse (NPV/IRR)](#cashflow-analyse-npvirr)
- [Amortisation](#amortisation)
- [Abschreibung](#abschreibung)
- [Datumsberechnungen](#datumsberechnungen)
- [Praxisnahe Szenarien](#praxisnahe-szenarien)

---

## Grundrechenarten

### Beispiel 1: Einfache Addition
**Aufgabe**: 125 + 375 = ?

**Tasteneingabe**:
```
125 ENTER 375 +
```

**Anzeige**: `500.00`

**Erklärung**: Bei RPN (Umgekehrte Polnische Notation) geben Sie zuerst beide Zahlen ein, getrennt durch ENTER, und dann die Operation.

---

### Beispiel 2: Subtraktion
**Aufgabe**: 1.250 - 450 = ?

**Tasteneingabe**:
```
1250 ENTER 450 -
```

**Anzeige**: `800.00`

---

### Beispiel 3: Multiplikation
**Aufgabe**: 24 × 15 = ?

**Tasteneingabe**:
```
24 ENTER 15 ×
```

**Anzeige**: `360.00`

---

### Beispiel 4: Division
**Aufgabe**: 2.500 ÷ 25 = ?

**Tasteneingabe**:
```
2500 ENTER 25 ÷
```

**Anzeige**: `100.00`

---

### Beispiel 5: Kettenberechnung
**Aufgabe**: (45 + 55) × 2 - 20 = ?

**Tasteneingabe**:
```
45 ENTER 55 +        → 100
2 ×                  → 200
20 -                 → 180
```

**Anzeige**: `180.00`

**Erklärung**: Bei RPN lösen Sie von links nach rechts auf natürliche Weise, keine Klammern nötig!

---

### Beispiel 6: Komplexer Ausdruck
**Aufgabe**: (12 + 8) ÷ (5 - 1) = ?

**Tasteneingabe**:
```
12 ENTER 8 +         → 20
5 ENTER 1 -          → 4
÷                    → 5
```

**Anzeige**: `5.00`

---

## Mathematische Funktionen

### Beispiel 7: Quadratwurzel
**Aufgabe**: √144 = ?

**Tasteneingabe**:
```
144 g √x
```

**Anzeige**: `12.00`

---

### Beispiel 8: Quadrat
**Aufgabe**: 13² = ?

**Tasteneingabe**:
```
13 g x²
```

**Anzeige**: `169.00`

---

### Beispiel 9: Kehrwert
**Aufgabe**: 1/8 = ?

**Tasteneingabe**:
```
8 1/x
```

**Anzeige**: `0.125`

---

### Beispiel 10: Potenzfunktion
**Aufgabe**: 2⁸ = ?

**Tasteneingabe**:
```
2 ENTER 8 yˣ
```

**Anzeige**: `256.00`

---

## Prozentberechnungen

### Beispiel 11: Einfacher Prozentsatz
**Aufgabe**: Was sind 15% von 200?

**Tasteneingabe**:
```
200 ENTER 15 %
```

**Anzeige**: `30.00`

**Erklärung**: Der ursprüngliche Wert (200) bleibt im Y-Register.

---

### Beispiel 12: Prozent addieren
**Aufgabe**: Was ist 200 plus 15%?

**Tasteneingabe**:
```
200 ENTER 15 %       → 30
+                    → 230
```

**Anzeige**: `230.00`

---

### Beispiel 13: Prozent subtrahieren (Rabatt)
**Aufgabe**: Was kostet ein Artikel für 500€ nach 20% Rabatt?

**Tasteneingabe**:
```
500 ENTER 20 %       → 100
-                    → 400
```

**Anzeige**: `400.00` (Preis nach Rabatt)

---

### Beispiel 14: Prozentuale Veränderung
**Aufgabe**: Der Umsatz stieg von 50.000€ auf 65.000€. Wie hoch ist die prozentuale Steigerung?

**Tasteneingabe**:
```
50000 ENTER 65000 Δ%
```

**Anzeige**: `30.00` (30% Steigerung)

---

### Beispiel 15: Umgekehrter Prozentsatz
**Aufgabe**: Wenn 120€ 80% einer Zahl sind, wie hoch ist die Gesamtzahl?

**Tasteneingabe**:
```
120 ENTER 80 %T
```

**Anzeige**: `150.00`

**Erklärung**: %T berechnet die Gesamtsumme, wenn ein Prozentteil gegeben ist.

---

## Speicheroperationen

### Beispiel 16: Speichern und Abrufen
**Aufgabe**: Berechne (5 × 8) + (12 × 3), speichere Zwischenergebnisse

**Tasteneingabe**:
```
5 ENTER 8 ×          → 40
STO 1                (in R1 speichern)
12 ENTER 3 ×         → 36
RCL 1                (aus R1 abrufen)
+                    → 76
```

**Anzeige**: `76.00`

---

### Beispiel 17: Register-Arithmetik
**Aufgabe**: Speichere 100 in Register 5, addiere dann 50 dazu

**Tasteneingabe**:
```
100 STO 5            (100 in R5 speichern)
50 STO+ 5            (50 zu R5 addieren)
RCL 5                (R5 abrufen)
```

**Anzeige**: `150.00`

---

## Zeitwert des Geldes (TVM)

> ⭐ **NEU - Phase 5 Complete!** Alle TVM-Funktionen sind jetzt vollständig implementiert und funktionsfähig!

### Beispiel 18: Kreditrate ✅ Implementiert
**Aufgabe**: Sie kaufen ein Haus für 350.000€ mit 30-jähriger Hypothek zu 6,5% Jahreszins. Wie hoch ist die monatliche Rate?

**Tasteneingabe**:
```
360 n                (30 Jahre × 12 Monate)
6.5 ENTER 12 ÷ i     (6,5% ÷ 12 = 0,542% pro Monat)
350000 PV            (Darlehensbetrag)
0 FV                 (am Ende vollständig abbezahlt)
PMT                  (Rate berechnen)
```

**Anzeige**: `-2,212.75`

**Antwort**: Monatliche Rate beträgt 2.212,75€ (negativ = Geldabfluss)

---

### Beispiel 19: Sparziel ✅ Implementiert
**Aufgabe**: Wie viel muss ich monatlich sparen, um in 5 Jahren 50.000€ zu haben bei 4% Jahreszins?

**Tasteneingabe**:
```
60 n                 (5 Jahre × 12 Monate)
4 ENTER 12 ÷ i       (4% ÷ 12 monatlich)
0 PV                 (von Null starten)
50000 FV             (Zielbetrag)
PMT                  (Rate berechnen)
```

**Anzeige**: `-754.22`

**Antwort**: Sparen Sie 754,22€ pro Monat

---

### Beispiel 20: Anlagerendite ✅ Implementiert
**Aufgabe**: Sie investieren 10.000€ und es wächst auf 15.000€ in 3 Jahren. Was war Ihre jährliche Rendite?

**Tasteneingabe**:
```
3 n                  (3 Jahre)
10000 CHS PV         (Anfangsinvestition, negativ)
15000 FV             (Endwert)
0 PMT                (keine zusätzlichen Zahlungen)
i                    (Zinssatz berechnen)
```

**Anzeige**: `14.47`

**Antwort**: 14,47% jährliche Rendite

---

### Beispiel 21: Verdopplungszeit
**Aufgabe**: Bei 8% Jahreszins, wie lange dauert es, bis 1.000€ zu 2.000€ werden?

**Tasteneingabe**:
```
8 i                  (8% jährlich)
1000 CHS PV          (Anfangsbetrag, negativ)
2000 FV              (doppelter Betrag)
0 PMT                (keine Zahlungen)
n                    (Perioden berechnen)
```

**Anzeige**: `9.01`

**Antwort**: Etwa 9 Jahre bis zur Verdopplung

---

## Cashflow-Analyse (NPV/IRR)

### Beispiel 22: Einfacher Kapitalwert (NPV)
**Aufgabe**: Projekt kostet 10.000€ initial und bringt 4.000€/Jahr für 4 Jahre. NPV bei 10% Abzinsungssatz?

**Tasteneingabe**:
```
f CLX                (Finanzregister löschen)
10000 CHS g CF₀      (Anfangsinvestition, negativ)
4000 g CFⱼ           (jährlicher Cashflow)
4 g Nⱼ               (4 Jahre)
10 i                 (Abzinsungssatz)
f NPV                (NPV berechnen)
```

**Anzeige**: `2,679.46`

**Antwort**: NPV = 2.679,46€ (positiv, also gute Investition!)

---

### Beispiel 23: Ungleiche Cashflows NPV
**Aufgabe**: Investition kostet 50.000€. Rückflüsse: Jahr 1: 15.000€, Jahr 2: 20.000€, Jahr 3: 25.000€, Jahr 4: 12.000€. NPV bei 12%?

**Tasteneingabe**:
```
f CLX                (Finanzregister löschen)
50000 CHS g CF₀      (Anfangsinvestition)
15000 g CFⱼ          (Jahr 1)
20000 g CFⱼ          (Jahr 2)
25000 g CFⱼ          (Jahr 3)
12000 g CFⱼ          (Jahr 4)
12 i                 (Abzinsungssatz)
f NPV                (NPV berechnen)
```

**Anzeige**: `4,036.75`

**Antwort**: NPV = 4.036,75€

---

### Beispiel 24: IRR-Berechnung
**Aufgabe**: Gleiches Projekt wie Beispiel 23. Was ist der IRR?

**Tasteneingabe**:
```
(Cashflows bereits von Beispiel 23 eingegeben)
f IRR                (IRR berechnen)
```

**Anzeige**: `18.45`

**Antwort**: IRR = 18,45% (höher als 12% Abzinsungssatz, also gute Investition)

---

## Amortisation

### Beispiel 25: Erste Ratenzahlung aufschlüsseln
**Aufgabe**: Bei einer 200.000€ Hypothek zu 6% für 30 Jahre, wie viel ist Kapital vs. Zinsen in der ersten Rate?

**Tasteneingabe**:
```
360 n
6 ENTER 12 ÷ i
200000 PV
0 FV
PMT                  → -1,199.10 (monatliche Rate)

1 f AMORT            (Periode 1 amortisieren)
x↔y                  → -1,000.00 (Zinsen)
RCL PV              → 199,800.90 (Restschuld)
```

**Ergebnisse**:
- Monatliche Rate: 1.199,10€
- Erste Rate Zinsen: 1.000,00€
- Erste Rate Kapital: 199,10€
- Verbleibende Schuld: 199.800,90€

---

### Beispiel 26: Amortisation erstes Jahr
**Aufgabe**: Für dieselbe Hypothek, Gesamtzinsen und Kapital im ersten Jahr (12 Zahlungen)?

**Tasteneingabe**:
```
(TVM bereits von Beispiel 25 eingegeben)
1 ENTER 12 f AMORT   (Perioden 1-12)
x↔y                  → -11,933.00 (Gesamtzinsen)
g LST x              → -2,456.20 (Gesamtkapital)
RCL PV              → 197,543.80 (Saldo nach 1 Jahr)
```

**Ergebnisse**:
- Gesamtzahlungen Jahr 1: 14.389,20€
- Gezahlte Zinsen: 11.933,00€
- Gezahltes Kapital: 2.456,20€
- Verbleibende Schuld: 197.543,80€

---

## Abschreibung

### Beispiel 27: Lineare Abschreibung
**Aufgabe**: Ausrüstung kostet 50.000€, Restwert 5.000€, Nutzungsdauer 10 Jahre. Jährliche Abschreibung?

**Tasteneingabe**:
```
50000 ENTER          (Kosten)
5000 -               → 45,000 (abschreibbarer Betrag)
10 ÷                 → 4,500
```

**Anzeige**: `4,500.00`

**Antwort**: 4.500€ Abschreibung pro Jahr

Oder mit eingebauter Funktion:
```
10 n                 (Nutzungsdauer)
50000 ENTER          (Kosten)
5000 -               (Restwert)
f SL                 (lineare Abschreibung)
```

---

### Beispiel 28: Degressive Abschreibung
**Aufgabe**: Gleiche Ausrüstung, 200% degressive Abschreibung (doppelt degressiv), Abschreibung Jahr 1?

**Tasteneingabe**:
```
10 n                 (Nutzungsdauer)
50000 ENTER          (Kosten)
1 f DB               (degressive Abschreibung, Jahr 1)
```

**Anzeige**: `10,000.00`

**Antwort**: 10.000€ erstes Jahr (20% von 50.000€)

---

## Datumsberechnungen

### Beispiel 29: Tage zwischen Daten
**Aufgabe**: Wie viele Tage vom 15. Januar 2024 bis 20. März 2024?

**Tasteneingabe**:
```
1.152024 ENTER       (15. Jan 2024 im Format M.TTJJJJ)
3.202024 g ΔDYS      (20. März 2024)
```

**Anzeige**: `65.00`

**Antwort**: 65 Tage (tatsächliche Tage)

---

### Beispiel 30: Zukünftiges Datum
**Aufgabe**: Welches Datum ist 90 Tage nach dem 1. Juni 2024?

**Tasteneingabe**:
```
6.012024 ENTER       (1. Juni 2024)
90 g DATE            (90 Tage addieren)
```

**Anzeige**: `8.302024`

**Antwort**: 30. August 2024

---

## Praxisnahe Szenarien

### Beispiel 31: Autoleasing-Entscheidung
**Aufgabe**: Ein Auto für 35.000€ leasen für 36 Monate bei 450€/Monat mit 3.000€ Anzahlung, oder kaufen mit 4% Kredit für 60 Monate. Was ist besser?

**Leasing effektive Kosten**:
```
36 n
3000 PV              (Anzahlung)
450 CHS PMT          (monatliche Zahlung)
35000 FV             (Restwert)
i                    → 1,52% monatlich = 18,24% jährlich
```

**Kauf Kreditrate**:
```
60 n
4 ENTER 12 ÷ i
35000 PV
0 FV
PMT                  → -645,30 monatlich
```

**Analyse**:
- Leasing: Niedrigere Monatsrate (450€ vs. 645€), aber 18,24% impliziter Zinssatz
- Kauf: Höhere Monatsrate, aber Sie besitzen das Auto und 4% Zinssatz ist besser
- Wenn Sie Autos langfristig behalten, ist Kaufen besser

---

### Beispiel 32: Umschuldungsentscheidung
**Aufgabe**: Sie haben noch 25 Jahre auf 6% Hypothek mit 250.000€ Saldo. Umschuldung auf 5% für 20 Jahre kostet 3.000€. Sollten Sie?

**Aktueller Kredit**:
```
300 n                (25 Jahre)
6 ENTER 12 ÷ i
250000 PV
PMT                  → -1,610.54
```

**Neuer Kredit** (inkl. Abschlusskosten):
```
240 n                (20 Jahre)
5 ENTER 12 ÷ i
253000 PV            (Saldo + Kosten)
PMT                  → -1,672.54
```

**Ersparnis**: 1.610,54€ - 1.672,54€ = -62,00€ teurer!

**Antwort**: Nicht umschulden. Die kürzere Laufzeit überwiegt die Zinsersparnis.

---

### Beispiel 33: Bildungssparplan
**Aufgabe**: Studium kostet 30.000€/Jahr. Kind ist 5 Jahre alt, Studium mit 18 (in 13 Jahren). Annahme 3% Inflation und 6% Anlagerendite, wie viel monatlich sparen?

**Schritt 1**: Zukünftige Kosten in 13 Jahren
```
13 n
3 i                  (Inflation)
30000 CHS PV
FV                   → 43,906.37 (Kosten Jahr 1)
```

**Schritt 2**: Benötigte monatliche Sparrate
```
156 n                (13 Jahre × 12)
6 ENTER 12 ÷ i      (monatliche Rendite)
0 PV
175625 FV            (4×43.906€, annähernd 4 Jahre)
PMT                  → -818.65
```

**Antwort**: Sparen Sie etwa 819€/Monat

---

### Beispiel 34: Unternehmensbewertung
**Aufgabe**: Unternehmen erwirtschaftet 100.000€/Jahr Gewinn. Gewinn wächst 5%/Jahr. Was ist sein Wert mit 10-Jahres-Projektion bei 15% Abzinsungssatz?

**Tasteneingabe**:
```
f CLX
0 g CF₀              (keine Anfangsinvestition)
100000 g CFⱼ         (Jahr 1: 100.000€)
1 g Nⱼ
105000 g CFⱼ         (Jahr 2: 105.000€)
1 g Nⱼ
110250 g CFⱼ         (Jahr 3: 110.250€)
1 g Nⱼ
... (fortsetzen für 10 Jahre)
15 i
f NPV
```

**Anzeige**: ~772.173

**Antwort**: Unternehmen wert ca. 772.000€

---

## Tipps für komplexe Berechnungen

### Tipp 1: Komplexe Berechnungen aufteilen
Versuchen Sie nicht, alles auf einmal zu machen. Berechnen Sie schrittweise und speichern Sie Zwischenergebnisse in Speicherregistern.

### Tipp 2: Überprüfen Sie Ihre Arbeit
Für wichtige Berechnungen arbeiten Sie rückwärts:
- Rate berechnet? Überprüfen Sie, ob sie den Kredit tilgt.
- NPV berechnet? Prüfen Sie, ob Ihre Cashflows korrekt summiert sind.

### Tipp 3: Verwenden Sie Papier für Cashflows
Für komplexe NPV/IRR mit vielen Cashflows, schreiben Sie diese zuerst auf, um Eingabefehler zu vermeiden.

### Tipp 4: Verstehen Sie die Vorzeichenkonvention
- Geld, das Sie zahlen (Investitionen, Kreditbetrag, Zahlungen) = negativ
- Geld, das Sie erhalten (Renditen, Krediterlös, Einkommen) = positiv

### Tipp 5: Einheiten prüfen
- Ist der Zinssatz jährlich oder monatlich?
- Ist die Periode in Monaten oder Jahren?
- n und i müssen auf dieselbe Zeitperiode abgestimmt sein!

---

## Schnellreferenz: Häufige Berechnungen

| Zu finden | Eingeben | Dann lösen für |
|-----------|----------|----------------|
| Kreditrate | n, i, PV, FV=0 | PMT |
| Kreditsaldo | n, i, PMT, FV=0 | PV |
| Anlagewachstum | n, i, PV, PMT | FV |
| Rendite | n, PV, PMT, FV | i |
| Zeit bis Ziel | i, PV, PMT, FV | n |
| Projektwert | CF₀, CFⱼ, i | NPV |
| Projektrendite | CF₀, CFⱼ | IRR |

---

**Mehr Hilfe benötigt?**
- Siehe [`quick-start-guide.md`](./quick-start-guide.md) für RPN-Grundlagen
- Siehe [`technical-spec.md`](./technical-spec.md) für detaillierte Formeln
- Siehe [`user-guide.md`](./user-guide.md) für vollständige Funktionsreferenz

---
---
---

# English Version

This guide provides step-by-step examples for using the HP-12C calculator, from basic arithmetic to advanced financial calculations.

## Table of Contents
- [Basic Arithmetic](#basic-arithmetic)
- [Mathematical Functions](#mathematical-functions)
- [Percentage Calculations](#percentage-calculations)
- [Memory Operations](#memory-operations)
- [Time Value of Money (TVM)](#time-value-of-money-tvm)
- [Cash Flow Analysis (NPV/IRR)](#cash-flow-analysis-npvirr)
- [Amortization](#amortization)
- [Depreciation](#depreciation)
- [Date Calculations](#date-calculations)
- [Real-World Scenarios](#real-world-scenarios)

---

## Basic Arithmetic

### Example 1: Simple Addition
**Problem**: 125 + 375 = ?

**Keystrokes**:
```
125 ENTER 375 +
```

**Display**: `500.00`

**Explanation**: In RPN (Reverse Polish Notation), you enter both numbers first, separated by ENTER, then the operation.

---

### Example 2: Subtraction
**Problem**: 1,250 - 450 = ?

**Keystrokes**:
```
1250 ENTER 450 -
```

**Display**: `800.00`

---

### Example 3: Multiplication
**Problem**: 24 × 15 = ?

**Keystrokes**:
```
24 ENTER 15 ×
```

**Display**: `360.00`

---

### Example 4: Division
**Problem**: 2,500 ÷ 25 = ?

**Keystrokes**:
```
2500 ENTER 25 ÷
```

**Display**: `100.00`

---

### Example 5: Chain Calculation
**Problem**: (45 + 55) × 2 - 20 = ?

**Keystrokes**:
```
45 ENTER 55 +        → 100
2 ×                  → 200
20 -                 → 180
```

**Display**: `180.00`

**Explanation**: In RPN, you solve from left to right naturally, no parentheses needed!

---

### Example 6: Complex Expression
**Problem**: (12 + 8) ÷ (5 - 1) = ?

**Keystrokes**:
```
12 ENTER 8 +         → 20
5 ENTER 1 -          → 4
÷                    → 5
```

**Display**: `5.00`

---

## Mathematical Functions

### Example 7: Square Root
**Problem**: √144 = ?

**Keystrokes**:
```
144 g √x
```

**Display**: `12.00`

---

### Example 8: Square
**Problem**: 13² = ?

**Keystrokes**:
```
13 g x²
```

**Display**: `169.00`

---

### Example 9: Reciprocal
**Problem**: 1/8 = ?

**Keystrokes**:
```
8 1/x
```

**Display**: `0.125`

---

### Example 10: Power Function
**Problem**: 2⁸ = ?

**Keystrokes**:
```
2 ENTER 8 yˣ
```

**Display**: `256.00`

---

## Percentage Calculations

### Example 11: Simple Percentage
**Problem**: What is 15% of 200?

**Keystrokes**:
```
200 ENTER 15 %
```

**Display**: `30.00`

**Explanation**: The original value (200) remains in Y register.

---

### Example 12: Add Percentage
**Problem**: What is 200 plus 15%?

**Keystrokes**:
```
200 ENTER 15 %       → 30
+                    → 230
```

**Display**: `230.00`

---

### Example 13: Subtract Percentage (Discount)
**Problem**: What is $500 minus a 20% discount?

**Keystrokes**:
```
500 ENTER 20 %       → 100
-                    → 400
```

**Display**: `400.00` (discounted price)

---

### Example 14: Percentage Change
**Problem**: Sales increased from $50,000 to $65,000. What's the percentage increase?

**Keystrokes**:
```
50000 ENTER 65000 Δ%
```

**Display**: `30.00` (30% increase)

---

### Example 15: Reverse Percentage
**Problem**: If $120 is 80% of a number, what's the full number?

**Keystrokes**:
```
120 ENTER 80 %T
```

**Display**: `150.00`

**Explanation**: %T calculates the total when given a percentage part.

---

## Memory Operations

### Example 16: Store and Recall
**Problem**: Calculate (5 × 8) + (12 × 3), storing intermediate results

**Keystrokes**:
```
5 ENTER 8 ×          → 40
STO 1                (store in R1)
12 ENTER 3 ×         → 36
RCL 1                (recall from R1)
+                    → 76
```

**Display**: `76.00`

---

### Example 17: Register Arithmetic
**Problem**: Store 100 in register 5, then add 50 to it

**Keystrokes**:
```
100 STO 5            (store 100 in R5)
50 STO+ 5            (add 50 to R5)
RCL 5                (recall R5)
```

**Display**: `150.00`

---

## Time Value of Money (TVM)

> ⭐ **NEW - Phase 5 Complete!** All TVM functions are now fully implemented and functional!

### Example 18: Loan Payment ✅ Implemented
**Problem**: You're buying a house for $350,000 with a 30-year mortgage at 6.5% annual interest. What's your monthly payment?

**Keystrokes**:
```
360 n                (30 years × 12 months)
6.5 ENTER 12 ÷ i     (6.5% ÷ 12 = 0.542% per month)
350000 PV            (loan amount)
0 FV                 (fully paid off at end)
PMT                  (calculate payment)
```

**Display**: `-2,212.75`

**Answer**: Monthly payment is $2,212.75 (negative = cash outflow)

---

### Example 19: Savings Goal ✅ Implemented
**Problem**: How much do I need to save monthly to have $50,000 in 5 years at 4% annual interest?

**Keystrokes**:
```
60 n                 (5 years × 12 months)
4 ENTER 12 ÷ i       (4% ÷ 12 monthly)
0 PV                 (starting from zero)
50000 FV             (target amount)
PMT                  (calculate payment)
```

**Display**: `-754.22`

**Answer**: Save $754.22 per month

---

### Example 20: Investment Return ✅ Implemented
**Problem**: You invest $10,000 and it grows to $15,000 in 3 years. What was your annual return rate?

**Keystrokes**:
```
3 n                  (3 years)
10000 CHS PV         (initial investment, negative)
15000 FV             (final value)
0 PMT                (no additional payments)
i                    (calculate interest rate)
```

**Display**: `14.47`

**Answer**: 14.47% annual return

---

### Example 21: How Long to Double?
**Problem**: At 8% annual interest, how long until $1,000 becomes $2,000?

**Keystrokes**:
```
8 i                  (8% annual)
1000 CHS PV          (initial amount, negative)
2000 FV              (double the amount)
0 PMT                (no payments)
n                    (calculate periods)
```

**Display**: `9.01`

**Answer**: About 9 years to double your money

---

## Cash Flow Analysis (NPV/IRR)

### Example 22: Simple NPV
**Problem**: Project costs $10,000 initially and returns $4,000/year for 4 years. NPV at 10% discount rate?

**Keystrokes**:
```
f CLX                (clear financial registers)
10000 CHS g CF₀      (initial investment, negative)
4000 g CFⱼ           (annual cash flow)
4 g Nⱼ               (4 years)
10 i                 (discount rate)
f NPV                (calculate NPV)
```

**Display**: `2,679.46`

**Answer**: NPV = $2,679.46 (positive, so good investment!)

---

### Example 23: Uneven Cash Flows NPV
**Problem**: Investment costs $50,000. Returns are: Year 1: $15,000, Year 2: $20,000, Year 3: $25,000, Year 4: $12,000. NPV at 12%?

**Keystrokes**:
```
f CLX                (clear financial registers)
50000 CHS g CF₀      (initial investment)
15000 g CFⱼ          (year 1)
20000 g CFⱼ          (year 2)
25000 g CFⱼ          (year 3)
12000 g CFⱼ          (year 4)
12 i                 (discount rate)
f NPV                (calculate NPV)
```

**Display**: `4,036.75`

**Answer**: NPV = $4,036.75

---

### Example 24: IRR Calculation
**Problem**: Same project as Example 23. What's the IRR?

**Keystrokes**:
```
(Cash flows already entered from Example 23)
f IRR                (calculate IRR)
```

**Display**: `18.45`

**Answer**: IRR = 18.45% (higher than 12% discount rate, so good investment)

---

## Amortization

### Example 25: First Payment Breakdown
**Problem**: For a $200,000 mortgage at 6% for 30 years, how much is principal vs. interest in first payment?

**Keystrokes**:
```
360 n
6 ENTER 12 ÷ i
200000 PV
0 FV
PMT                  → -1,199.10 (monthly payment)

1 f AMORT            (amortize period 1)
x↔y                  → -1,000.00 (interest)
RCL PV              → 199,800.90 (remaining balance)
```

**Results**:
- Monthly payment: $1,199.10
- First payment interest: $1,000.00
- First payment principal: $199.10
- Remaining balance: $199,800.90

---

### Example 26: First Year Amortization
**Problem**: For the same mortgage, total interest and principal in first year (12 payments)?

**Keystrokes**:
```
(TVM already entered from Example 25)
1 ENTER 12 f AMORT   (periods 1-12)
x↔y                  → -11,933.00 (total interest)
g LST x              → -2,456.20 (total principal)
RCL PV              → 197,543.80 (balance after 1 year)
```

**Results**:
- Total payments year 1: $14,389.20
- Interest paid: $11,933.00
- Principal paid: $2,456.20
- Remaining balance: $197,543.80

---

## Depreciation

### Example 27: Straight Line Depreciation
**Problem**: Equipment costs $50,000, salvage value $5,000, life 10 years. Annual depreciation?

**Keystrokes**:
```
50000 ENTER          (cost)
5000 -               → 45,000 (depreciable amount)
10 ÷                 → 4,500
```

**Display**: `4,500.00`

**Answer**: $4,500 depreciation per year

Or using built-in function:
```
10 n                 (life)
50000 ENTER          (cost)
5000 -               (salvage)
f SL                 (straight line)
```

---

### Example 28: Declining Balance
**Problem**: Same equipment, 200% declining balance (double declining), year 1 depreciation?

**Keystrokes**:
```
10 n                 (life)
50000 ENTER          (cost)
1 f DB               (declining balance, year 1)
```

**Display**: `10,000.00`

**Answer**: $10,000 first year (20% of $50,000)

---

## Date Calculations

### Example 29: Days Between Dates
**Problem**: How many days from January 15, 2024 to March 20, 2024?

**Keystrokes**:
```
1.152024 ENTER       (Jan 15, 2024 in M.DDYYYY format)
3.202024 g ΔDYS      (Mar 20, 2024)
```

**Display**: `65.00`

**Answer**: 65 days (actual days)

---

### Example 30: Future Date
**Problem**: What date is 90 days after June 1, 2024?

**Keystrokes**:
```
6.012024 ENTER       (June 1, 2024)
90 g DATE            (add 90 days)
```

**Display**: `8.302024`

**Answer**: August 30, 2024

---

## Real-World Scenarios

### Example 31: Car Lease Decision
**Problem**: Lease a $35,000 car for 36 months at $450/month with $3,000 down, or buy with 4% loan for 60 months. Which is better?

**Lease effective cost**:
```
36 n
3000 PV              (down payment)
450 CHS PMT          (monthly payment)
35000 FV             (residual value)
i                    → 1.52% monthly = 18.24% annual
```

**Purchase loan payment**:
```
60 n
4 ENTER 12 ÷ i
35000 PV
0 FV
PMT                  → -645.30 monthly
```

**Analysis**:
- Lease: Lower monthly ($450 vs $645), but 18.24% implicit rate
- Purchase: Higher monthly, but you own the car and 4% rate is better
- If you keep cars long-term, buying is better

---

### Example 32: Refinance Decision
**Problem**: You have 25 years left on 6% mortgage with $250,000 balance. Refinance to 5% for 20 years costs $3,000. Should you?

**Current loan**:
```
300 n                (25 years)
6 ENTER 12 ÷ i
250000 PV
PMT                  → -1,610.54
```

**New loan** (including closing costs):
```
240 n                (20 years)
5 ENTER 12 ÷ i
253000 PV            (balance + costs)
PMT                  → -1,672.54
```

**Savings**: $1,610.54 - $1,672.54 = -$62.00 more expensive!

**Answer**: Don't refinance. The shorter term outweighs the rate savings.

---

### Example 33: Educational Savings Plan
**Problem**: College costs $30,000/year. Child is 5 years old, college at 18 (13 years). Assuming 3% inflation and 6% investment return, how much to save monthly?

**Step 1**: Future cost in 13 years
```
13 n
3 i                  (inflation)
30000 CHS PV
FV                   → 43,906.37 (year 1 cost)
```

**Step 2**: Monthly savings needed
```
156 n                (13 years × 12)
6 ENTER 12 ÷ i      (monthly return)
0 PV
175625 FV            (4×$43,906, approximating 4 years)
PMT                  → -818.65
```

**Answer**: Save about $819/month

---

### Example 34: Business Valuation
**Problem**: Business generates $100,000/year profit. Profit grows 5%/year. What's its value using 10-year projection at 15% discount rate?

**Keystrokes**:
```
f CLX
0 g CF₀              (no initial investment)
100000 g CFⱼ         (year 1: $100,000)
1 g Nⱼ
105000 g CFⱼ         (year 2: $105,000)
1 g Nⱼ
110250 g CFⱼ         (year 3: $110,250)
1 g Nⱼ
... (continue for 10 years)
15 i
f NPV
```

**Display**: ~$772,173

**Answer**: Business worth approximately $772,000

---

## Tips for Complex Problems

### Tip 1: Break Down Complex Calculations
Don't try to do everything at once. Calculate step-by-step and store intermediate results in memory registers.

### Tip 2: Verify Your Work
For important calculations, work backwards:
- Calculated a payment? Verify it pays off the loan.
- Calculated NPV? Check your cash flows sum correctly.

### Tip 3: Use Paper for Cash Flows
For complex NPV/IRR with many cash flows, write them down first to avoid entry errors.

### Tip 4: Understand the Sign Convention
- Money you pay out (investments, loan principal, payments) = negative
- Money you receive (returns, loan proceeds, income) = positive

### Tip 5: Check Units
- Is interest rate annual or monthly?
- Is period in months or years?
- Match n and i to same time period!

---

## Quick Reference: Common Calculations

| Need to Find | Enter | Then Solve For |
|--------------|-------|----------------|
| Loan payment | n, i, PV, FV=0 | PMT |
| Loan payoff | n, i, PMT, FV=0 | PV |
| Investment growth | n, i, PV, PMT | FV |
| Return rate | n, PV, PMT, FV | i |
| Time to goal | i, PV, PMT, FV | n |
| Project value | CF₀, CFⱼ, i | NPV |
| Project return | CF₀, CFⱼ | IRR |

---

**Need more help?**
- See [`quick-start-guide.md`](./quick-start-guide.md) for RPN basics
- See [`technical-spec.md`](./technical-spec.md) for detailed formulas
- See [`user-guide.md`](./user-guide.md) for complete function reference
