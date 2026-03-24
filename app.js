/* ============================================
   Oliva Koncept — Pismo Web App
   Zero backend, zero tracking, pdf-lib only
   ============================================ */

// PDF field coordinates — exact baselines from template content stream
const PDF_FIELDS = {
  date:    { x: 410, y: 753.02 },
  name:    { x: 182, y: 717.02 },
  address: { x: 204, y: 693.02 },
  apt:     { x: 151, y: 669.02 },
  kw:      { x: 236, y: 645.02 },
  pesel:   { x: 211, y: 621.02 },
};

let generatedPdfBytes = null;
let currentStep = 1;

// ============================================
// QUIZ DATA — 19 questions, 6 categories
// ============================================
const QUIZ_QUESTIONS = [
  // --- Ochrona przed hałasem ---
  { id: 'Q1', category: 'Ochrona przed hałasem',
    title: 'Lepsza klasa ochrony ekranów akustycznych',
    desc: 'Planowane ekrany mają minimalną klasę A3 (8 dB). Klasa A4 daje dodatkowe 3 dB zapasu ochrony.',
    detailedDesc: '<p>Karta Informacyjna Przedsięwzięcia przewiduje ekrany akustyczne o klasie pochłaniania A3, czyli minimum 8 dB. To najniższa klasa stosowana przy drogach. Klasa A4 oznacza pochłanianie co najmniej 11 dB \u2014 czyli <strong>dodatkowe 3 dB zapasu</strong>.</p><p>Dlaczego to ważne? Każde 3 dB to dwukrotne zmniejszenie energii akustycznej docierającej do mieszkań. Przy prognozowanych przekroczeniach normy o 9 dB w dzień i 11 dB w nocy przy naszym osiedlu, margines bezpieczeństwa klasy A3 jest zbyt mały. Wystarczy niewielki błąd w prognozie ruchu, żeby ekrany okazały się niewystarczające.</p><p>Klasa A4 jest standardem stosowanym przy zabudowie wielorodzinnej w krajach UE. Koszt różnicy między A3 a A4 jest marginalny w skali całej inwestycji (ok. 5-10% ceny ekranów), a zapewnia realne bezpieczeństwo akustyczne.</p><p><strong>Wniosek formalny:</strong> Zastosowanie ekranów o klasie pochłaniania co najmniej A4 (DL\u03B1 \u2265 11 dB) zamiast minimalnej A3.</p>',
    codes: ['AK-10'] },
  { id: 'Q1a', category: 'Ochrona przed hałasem',
    title: 'Analiza ekranów dla wyższych kondygnacji',
    desc: 'Ekrany mogą nie chronić mieszkań na wyższych piętrach. Postulat wymaga dodatkowej analizy.',
    detailedDesc: '<p>Ekrany akustyczne o wysokości 3-6 m (przewidziane w KIP) skutecznie chronią parter i pierwsze piętro. Jednak mieszkańcy wyższych kondygnacji \u2014 drugiego, trzeciego i wyższych pięter \u2014 <strong>nie są chronieni</strong>, ponieważ fala dźwiękowa przechodzi nad ekranem.</p><p>W naszym osiedlu mieszkania są na piętrach od parteru do czwartego. KIP nie zawiera żadnej analizy, jak ekrany będą działać dla wyższych kondygnacji. To oznacza, że połowa mieszkańców może nie mieć żadnej ochrony przed hałasem.</p><p>Wnosimy o przeprowadzenie szczegółowej analizy skuteczności ekranów na każdym piętrze i \u2014 jeśli okaże się, że wyższe piętra nie są chronione \u2014 zaprojektowanie dodatkowych środków ochrony (np. wyższe ekrany, ekrany na budynku, wymiana okien na dźwiękochłonne).</p><p><strong>Wniosek formalny:</strong> Przeprowadzenie analizy skuteczności ekranów dla wyższych kondygnacji budynków wielorodzinnych i zaprojektowanie dodatkowych środków ochrony.</p>',
    codes: ['AK-4'] },
  { id: 'Q2', category: 'Ochrona przed hałasem',
    title: 'Transparentne ekrany (światło i estetyka)',
    desc: 'Nieprzezroczyste ekrany mogą zasłaniać światło na parterze i I piętrze. Panele transparentne to rozwiązują.',
    detailedDesc: '<p>Ekrany akustyczne o wysokości do 6 metrów, jeśli będą nieprzezroczyste, <strong>całkowicie zasłonią światło</strong> w mieszkaniach na parterze i pierwszym piętrze. Przepisy budowlane wymagają minimum 3 godzin nasłonecznienia w dniu równonocy (\u00A7 60 rozporządzenia o warunkach technicznych).</p><p>Nieprzezroczyste ekrany przy zabudowie mieszkaniowej to także problem estetyczny \u2014 tworzą \u201Eefekt tunelu\u201D, obniżają komfort życia i wartość nieruchomości. W wielu krajach UE stosuje się panele transparentne (ze szkła hartowanego lub PMMA) na odcinkach przy zabudowie mieszkalnej.</p><p>Wnosimy o analizę wpływu ekranów na nasłonecznienie lokali i o zastosowanie paneli transparentnych na odcinkach bezpośrednio sąsiadujących z osiedlem, aby zachować przepuszczalność światła i minimalizować negatywny wpływ na estetykę i wartość nieruchomości.</p><p><strong>Wniosek formalny:</strong> Analiza wpływu ekranów na nasłonecznienie + zastosowanie paneli transparentnych przy zabudowie mieszkalnej.</p>',
    codes: ['AK-17'] },
  { id: 'Q3', category: 'Ochrona przed hałasem',
    title: 'Cisza nocą \u2014 hałas pojedynczego autobusu',
    desc: 'Nawet jeden autobus nocą może budzić. Postulat wymaga analizy hałasu maksymalnego LAmax wg WHO.',
    detailedDesc: '<p>KIP analizuje hałas jako średnią godzinową (LAeq). Ale w nocy liczy się nie średnia, a <strong>pojedyncze zdarzenia dźwiękowe</strong> \u2014 jeden przejazd autobusu przegubowego (18 ton) może osiągnąć poziom 75-80 dB(A) i obudzić śpiącego człowieka.</p><p>Światowa Organizacja Zdrowia (WHO) w wytycznych z 2018 r. zaleca, aby pojedyncze zdarzenia nocne nie przekraczały <strong>45 dB LAmax</strong> wewnątrz sypialni. Przy 34 autobusach zaplanowanych na porę nocną (22:00-6:00), to średnio jeden przejazd co 14 minut \u2014 czyli potencjalnie kilkukrotne budzenie w ciągu nocy.</p><p>Wnosimy o wykonanie analizy poziomu maksymalnego hałasu (LAmax) dla pojedynczych przejazdów autobusów w porze nocnej, z odniesieniem do progów zaburzeń snu wg wytycznych WHO. Jeśli progi zostaną przekroczone, konieczne są dodatkowe środki ochrony (ograniczenie kursów nocnych, cicha nawierzchnia, dodatkowa izolacja).</p><p><strong>Wniosek formalny:</strong> Analiza LAmax dla pojedynczych przejazdów nocnych z odniesieniem do wytycznych WHO.</p>',
    codes: ['AK-5'] },
  { id: 'Q4', category: 'Ochrona przed hałasem',
    title: 'Cicha nawierzchnia na buspasie',
    desc: 'Nawierzchnia poroelastyczna lub SMA LA zmniejsza hałas toczenia o 3-5 dB.',
    detailedDesc: '<p>Hałas drogowy składa się z dwóch głównych źródeł: silnika i toczenia opon po nawierzchni. Przy prędkościach powyżej 40 km/h dominuje hałas toczenia. Zastosowanie <strong>cichej nawierzchni</strong> (SMA LA, BBTM, nawierzchnia poroelastyczna) zmniejsza ten hałas o 3-5 dB.</p><p>Obniżenie o 3 dB odpowiada <strong>dwukrotnemu zmniejszeniu natężenia ruchu</strong> \u2014 to tak, jakby na drodze było o połowę mniej pojazdów. To jeden z najtańszych i najskuteczniejszych sposobów redukcji hałasu, stosowany standardowo w Holandii, Danii i Niemczech.</p><p>KIP nie analizuje tej opcji w ogóle. Wnosimy o przedstawienie analizy techniczno-ekonomicznej zastosowania cichej nawierzchni na buspasie i jezdni głównej \u2014 szczególnie na odcinkach przy zabudowie mieszkalnej.</p><p><strong>Wniosek formalny:</strong> Analiza techniczno-ekonomiczna zastosowania nawierzchni o obniżonej emisji hałasu (SMA LA, BBTM, nawierzchnia poroelastyczna).</p>',
    codes: ['AK-11'] },
  { id: 'Q5', category: 'Ochrona przed hałasem',
    title: 'Hałas niskoczęstotliwościowy (20-200 Hz)',
    desc: 'Autobusy generują dudnienie, które przenika przez ściany. KIP w ogóle nie analizuje tego pasma.',
    detailedDesc: '<p>Autobusy \u2014 szczególnie przegubowe o masie 18 ton \u2014 generują <strong>intensywne drgania niskoczęstotliwościowe</strong> w paśmie 20-200 Hz. Ten rodzaj hałasu jest odczuwany jako dudnienie, wibracje i ciśnienie w uszach. Przenika przez ściany i okna, nawet przy zamkniętych oknach z dobrą izolacją.</p><p>KIP w ogóle nie analizuje tego pasma częstotliwości. Standardowe wskaźniki hałasu (LAeq) wykorzystują filtr A, który <strong>zaniża hałas niskich częstotliwości o 10-30 dB</strong>. To oznacza, że pomiar pokazuje normę, ale mieszkańcy i tak odczuwają uciążliwe dudnienie.</p><p>Hałas niskoczęstotliwościowy jest szczególnie uciążliwy w nocy \u2014 rezonuje z elementami budynku (szyby, ściany, stropy) i powoduje zaburzenia snu, bóle głowy i przewlekły stres. Wnosimy o wykonanie analizy widmowej z uwzględnieniem tłumienia przez przegrody budowlane naszych budynków.</p><p><strong>Wniosek formalny:</strong> Analiza widmowa hałasu w paśmie 20-200 Hz, z uwzględnieniem tłumienia przez przegrody budowlane budynków przy trasie.</p>',
    codes: ['AK-7'] },
  { id: 'Q6', category: 'Ochrona przed hałasem',
    title: 'Łączny hałas ze wszystkich źródeł',
    desc: 'KIP analizuje buspas osobno, ale hałas kumuluje się z koleją, al. Grunwaldzką i zoo.',
    detailedDesc: '<p>KIP analizuje hałas z buspasa jako izolowane źródło. Ale nasze osiedle znajduje się w otoczeniu <strong>wielu źródeł hałasu jednocześnie</strong>:</p><p>\u2022 Linia kolejowa nr 250 (pociągi co kilkanaście minut)<br>\u2022 Ruch na al. Grunwaldzkiej<br>\u2022 Ogród Zoologiczny (odgłosy zwierząt, obsługa techniczna)<br>\u2022 Planowany buspas z 308 autobusami dziennie</p><p>Hałas się kumuluje. Dwa źródła o poziomie 60 dB każde dają razem 63 dB \u2014 a trzy źródła to już 65 dB. Norma 65 dB może być przekroczona nie przez sam buspas, ale przez <strong>sumę wszystkich źródeł</strong>. KIP tego nie sprawdza.</p><p>Wnosimy o wykonanie analizy kumulacji hałasu ze wszystkich źródeł w otoczeniu, a także o rozszerzenie analizy izolacyjności akustycznej na wszystkie budynki w strefie oddziaływania (KIP bada tylko jeden punkt receptorowy).</p><p><strong>Wnioski formalne:</strong> Analiza kumulacji hałasu z buspasa z innymi źródłami + rozszerzenie analizy izolacyjności na wszystkie budynki.</p>',
    codes: ['AK-12', 'BU-7'] },

  // --- Ochrona budynków ---
  { id: 'Q7', category: 'Ochrona budynków',
    title: 'Stan zero budynków przed budową',
    desc: 'Dokumentacja fotograficzna spękań i stanu technicznego \u2014 dowód w razie szkód.',
    detailedDesc: '<p>Budowa trwająca 18-24 miesiące, z użyciem ciężkiego sprzętu (koparki, kafary, walce wibracyjne), <strong>może powodować pęknięcia ścian, zarysowania tynków i uszkodzenia fundamentów</strong> budynków w sąsiedztwie.</p><p>Jeśli takie szkody wystąpią, jedynym sposobem udowodnienia, że powstały w wyniku budowy, jest <strong>dokumentacja stanu \u201Ezerowego\u201D</strong> \u2014 czyli szczegółowy przegląd techniczny i fotograficzny budynków PRZED rozpoczęciem robót.</p><p>Bez takiej dokumentacji inwestor będzie twierdził, że pęknięcia istniały wcześniej. Stan zerowy obejmuje: inwentaryzację fotograficzną spękań, pomiar geometrii budynku (czy nie jest przechylony), dokumentację stanu elementów budowlanych.</p><p>To standard w całej UE przy budowach w sąsiedztwie zabudowy mieszkalnej. KIP nie przewiduje takiego przeglądu.</p><p><strong>Wniosek formalny:</strong> Wykonanie przeglądu stanu technicznego (stan \u201Ezerowy\u201D) wszystkich budynków w promieniu 50 m od trasy PRZED rozpoczęciem robót.</p>',
    codes: ['BU-2'] },
  { id: 'Q8', category: 'Ochrona budynków',
    title: 'Analiza wpływu drgań na budynki',
    desc: '80% podłoża to grunty niespoiste \u2014 drgania z budowy mogą powodować osiadanie i pękanie.',
    detailedDesc: '<p>KIP na stronie 27 stwierdza, że <strong>80% podłoża to grunty niespoiste</strong> (piaski, żwiry). Ten typ gruntu jest szczególnie podatny na zagęszczanie wibracyjne \u2014 pod wpływem drgań z budowy ziarna piasku ściślej się układają, grunt się obniża, a budynki nad nim mogą nierównomiernie osiadać.</p><p>Przejazdy autobusów przegubowych (12-18 ton) generują drgania o częstotliwości 10-50 Hz, które przenoszą się przez grunt na fundamenty budynków. Norma PN-B-02170:2016 określa dopuszczalne wartości drgań \u2014 ale KIP <strong>nie zawiera żadnej analizy drgań</strong> dla budynków w sąsiedztwie.</p><p>Wnosimy o trzy powiązane analizy: (1) wpływ drgań z robót budowlanych na budynki wg normy PN-B-02170, (2) wpływ drgań na grunty niespoiste pod kątem upłynnienia i zagęszczania, (3) wpływ drgań z eksploatacji buspasa (przejazdy autobusów) na budynki mieszkalne.</p><p><strong>Wnioski formalne:</strong> Analiza drgań budowlanych + analiza wpływu na grunty niespoiste + analiza drgań eksploatacyjnych.</p>',
    codes: ['AK-8', 'BU-1', 'BU-3'] },
  { id: 'Q9', category: 'Ochrona budynków',
    title: 'Fundusz gwarancyjny 10 mln zł',
    desc: 'Depozyt bankowy na naprawy szkód budowlanych, z niezależnym inspektorem nadzoru.',
    detailedDesc: '<p>Nawet przy najlepszych środkach ostrożności, budowa przy zabudowie mieszkalnej <strong>zawsze niesie ryzyko szkód</strong> \u2014 pęknięć ścian, uszkodzeń instalacji, nierównomiernego osiadania. Kluczowe pytanie: kto za to zapłaci i jak szybko?</p><p>Bez funduszu gwarancyjnego mieszkańcy muszą dochodzić odszkodowań w sądzie \u2014 proces trwa 3-5 lat i kosztuje tysiące złotych. Fundusz gwarancyjny (depozyt bankowy lub polisa OC) oznacza, że <strong>pieniądze na naprawy są dostępne natychmiast</strong>, bez czekania na wyroki sądowe.</p><p>Proponujemy kwotę nie mniejszą niż 10 mln zł \u2014 to ok. 1% wartości całej inwestycji, a wystarczy na naprawę poważnych szkód w kilkudziesięciu budynkach. Funduszem zarządza niezależny inspektor nadzoru, wybrany w uzgodnieniu ze Wspólnotą Mieszkaniową \u2014 nie przez inwestora.</p><p><strong>Wniosek formalny:</strong> Ustanowienie funduszu gwarancyjnego (min. 10 mln zł) na naprawy szkód budowlanych, z niezależnym inspektorem nadzoru.</p>',
    codes: ['BU-12'] },
  { id: 'Q10', category: 'Ochrona budynków',
    title: 'Ochrona przed osuszeniem gruntu',
    desc: 'Pompy odwadniające (50-80 m\u00B3/h) mogą obniżyć poziom wód gruntowych pod fundamentami.',
    detailedDesc: '<p>KIP na stronie 68 wskazuje, że podczas budowy będą stosowane <strong>pompy odwadniające o wydajności 50-80 m\u00B3/h</strong>. To bardzo duża ilość wody \u2014 tyle, ile zużywa ok. 200 gospodarstw domowych dziennie.</p><p>Intensywne odpompowywanie wód gruntowych może obniżyć ich poziom w szerokim promieniu od budowy. Gdy woda gruntowa opadnie pod fundamentami budynku, <strong>grunt pod nimi wysycha i kurczy się</strong>, co prowadzi do nierównomiernego osiadania, pęknięć ścian i uszkodzeń instalacji.</p><p>Problem jest szczególnie poważny na gruntach niespoistych (80% podłoża wg KIP) \u2014 piasek bez wody traci spoistość i \u201Eosiada\u201D pod ciężarem budynku. KIP nie zawiera żadnego modelu hydrogeologicznego, który pokazałby, jak daleko sięgnie depresja wód gruntowych.</p><p><strong>Wniosek formalny:</strong> Opracowanie modelu hydrogeologicznego wpływu odwodnienia wykopów na poziom wód gruntowych i fundamenty budynków w otoczeniu.</p>',
    codes: ['BU-5'] },

  // --- Wartość nieruchomości ---
  { id: 'Q11', category: 'Wartość nieruchomości',
    title: 'Wycena nieruchomości przed budową',
    desc: 'Niezależna wycena + mechanizm kompensacji spadku wartości. 4 podstawy prawne roszczeń.',
    detailedDesc: '<p>Budowa buspasa z ekranami akustycznymi bezpośrednio przy osiedlu <strong>może obniżyć wartość mieszkań</strong>. Badania naukowe wskazują spadek od 5% do 15% w zależności od bliskości i uciążliwości inwestycji drogowej.</p><p>Dla mieszkania o wartości 600 tys. zł, spadek o 10% to <strong>60 tys. zł straty</strong>. Aby móc dochodzić odszkodowania, trzeba udowodnić, jaka była wartość PRZED budową. Dlatego kluczowa jest niezależna wycena biegłego rzeczoznawcy jeszcze przed rozpoczęciem prac.</p><p>Prawo polskie daje właścicielom co najmniej 4 podstawy prawne roszczeń: art. 129 Prawa ochrony środowiska (ograniczenie korzystania z nieruchomości), art. 36 ustawy o planowaniu (zmiana przeznaczenia terenu), art. 435 KC (odpowiedzialność za ruch przedsiębiorstwa), art. 144 KC (immisje ponadprzeciętne).</p><p><strong>Wnioski formalne:</strong> Niezależna wycena nieruchomości przed budową + analiza wpływu inwestycji na wartość + mechanizm kompensacji spadku wartości.</p>',
    codes: ['BU-10', 'BU-13'] },

  // --- Życie podczas budowy ---
  { id: 'Q12', category: 'Życie podczas budowy',
    title: 'Plan dojazdu na czas 18-24 mies. budowy',
    desc: 'Gwarancja dojazdu ratunkowego do 15 min, przystanek tymczasowy \u2264300 m, bezpieczne trasy szkolne.',
    detailedDesc: '<p>Budowa potrwa 18-24 miesiące i będzie się odbywać dosłownie pod oknami osiedla. W tym czasie <strong>ul. Spacerowa będzie częściowo lub całkowicie zamknięta</strong> \u2014 a to jedyna wygodna droga dojazdowa do naszego osiedla.</p><p>Kluczowe zagrożenia: wydłużony czas dojazdu karetek pogotowia i straży pożarnej (norma: max 15 minut), brak przystanku autobusowego w rozsądnej odległości, niebezpieczne trasy dojścia dzieci do szkoły wzdłuż placu budowy, 18 miesięcy hałasu i pyłu z budowy pod oknami.</p><p>Wnosimy o trzy powiązane zobowiązania: (1) szczegółowy plan organizacji ruchu na czas budowy z harmonogramem i mapą objazdów, (2) analizę wpływu na dostępność komunikacyjną (czas dojazdu ratunkowego, dostępność szkół, transport publiczny), (3) dedykowany plan dla osiedla Oliva Koncept gwarantujący dojazd ratunkowy \u226415 min, przystanek tymczasowy \u2264300 m i bezpieczne trasy szkolne.</p><p><strong>Wnioski formalne:</strong> Plan organizacji ruchu na czas budowy + analiza dostępności + plan utrzymania dostępności osiedla.</p>',
    codes: ['DR-4', 'DR-5', 'DR-6'] },

  // --- Pakiet kompensacyjny ---
  { id: 'Q13', category: 'Pakiet kompensacyjny',
    title: 'Pomiar akustyczny + filtry wentylacji',
    desc: 'Indywidualny pomiar hałasu w budynkach osiedla + wymiana filtrów rekuperacji na czas budowy.',
    detailedDesc: '<p>KIP zawiera pomiar hałasu <strong>w tylko jednym punkcie na 5,7 km trasy</strong>. To oznacza, że nie wiemy, jaki jest rzeczywisty poziom hałasu wewnątrz budynków naszego osiedla. Wnosimy o indywidualny pomiar akustyczny bezpośrednio w budynkach osiedla, żeby mieć realny obraz sytuacji.</p><p>Drugi element to <strong>filtry wentylacji rekuperacyjnej</strong>. Nasze budynki mają rekuperację \u2014 system wentylacji z odzyskiem ciepła. W czasie 18-24 miesięcy budowy powietrze będzie pełne pyłu, kurzu i spalin z maszyn budowlanych. Filtry rekuperacji będą się zapychać 2-3 razy szybciej niż normalnie.</p><p>Wymiana filtrów to koszt 200-500 zł rocznie na mieszkanie. Przez czas budowy i 2 lata po niej (czas na stabilizację warunków), inwestor powinien sfinansować wymianę filtrów \u2014 bo to jego działalność powoduje zwiększone zapylenie.</p><p><strong>Wnioski formalne:</strong> Indywidualny pomiar akustyczny w budynkach osiedla + sfinansowanie wymiany filtrów rekuperacji na czas budowy i 2 lata po zakończeniu.</p>',
    codes: ['AK-16(a,b)'] },
  { id: 'Q14', category: 'Pakiet kompensacyjny',
    title: 'Stacja monitoringu hałasu online',
    desc: 'Stała stacja pomiarowa z publicznym dostępem do wyników + dedykowany monitoring osiedla.',
    detailedDesc: '<p>Inwestor deklaruje, że hałas nie przekroczy norm. Ale <strong>jak to sprawdzić?</strong> Jednorazowy pomiar po oddaniu drogi to za mało \u2014 hałas zmienia się w zależności od pory dnia, pogody, natężenia ruchu i stanu nawierzchni.</p><p>Wnosimy o zainstalowanie <strong>stałej stacji monitoringu hałasu i drgań</strong> przy osiedlu, z publicznym dostępem do wyników online \u2014 w czasie rzeczywistym, 24/7. To pozwoli mieszkańcom na bieżąco sprawdzać, czy normy są dotrzymywane, i reagować na przekroczenia.</p><p>Dodatkowo wnosimy o dedykowany, wieloletni program monitoringu porealizacyjnego obejmujący hałas, drgania, wody gruntowe i stabilność budynków. Dane powinny być udostępniane Wspólnocie Mieszkaniowej co kwartał.</p><p>Takie stacje kosztują 50-100 tys. zł \u2014 ułamek budżetu inwestycji wartej setki milionów, a dają mieszkańcom realne narzędzie kontroli.</p><p><strong>Wnioski formalne:</strong> Stała stacja monitoringu hałasu z publicznym dostępem online + dedykowany program monitoringu porealizacyjnego osiedla.</p>',
    codes: ['AK-16(c)', 'AD-11'] },
  { id: 'Q15', category: 'Pakiet kompensacyjny',
    title: 'Pas zieleni izolacyjnej 15 m',
    desc: 'Wielopiętrowy pas drzew, krzewów i pnączy jako bufor akustyczny i filtr powietrza.',
    detailedDesc: '<p>Zieleń nie zastąpi ekranów akustycznych, ale <strong>skutecznie uzupełnia ochronę</strong>. Gęsty pas zieleni o szerokości 15 metrów spełnia kilka funkcji jednocześnie:</p><p>\u2022 <strong>Bufor akustyczny</strong> \u2014 dodatkowe 3-6 dB redukcji hałasu (zieleń tłumi głównie hałas wysoko- i średnioczęstotliwościowy)<br>\u2022 <strong>Filtr powietrza</strong> \u2014 drzewa i krzewy wyłapują pyły, w tym PM2.5 i PM10 z ruchu drogowego<br>\u2022 <strong>Bariera wizualna</strong> \u2014 zasłania ekrany akustyczne i drogę, przywracając estetykę otoczenia<br>\u2022 <strong>Regulacja mikroklimatu</strong> \u2014 obniża temperaturę latem o 2-4\u00B0C (efekt wyspy ciepła przy asfalcie)</p><p>Pas powinien być wielopiętrowy: drzewa (topole, klony, lipy), krzewy (tawuły, berberys) i pnącza. Inwestor powinien zapewnić wieloletnie utrzymanie i pielęgnację.</p><p><strong>Wniosek formalny:</strong> Zaprojektowanie i wykonanie wielopiętrowego pasa zieleni izolacyjnej o szerokości min. 15 m między trasą a osiedlem.</p>',
    codes: ['FL-15'] },
  { id: 'Q16', category: 'Pakiet kompensacyjny',
    title: 'Oświetlenie bez świecenia w okna',
    desc: 'Lampy \u22642700K z pełnym cut-off \u2014 ciepłe światło skierowane na drogę, nie na budynki.',
    detailedDesc: '<p>Oświetlenie drogowe przy buspasie będzie działać przez całą noc, bezpośrednio przy oknach naszych mieszkań. <strong>Źle zaprojektowane oświetlenie to poważna uciążliwość</strong> \u2014 światło wpadające do sypialni zaburza sen i obniża jakość życia.</p><p>Wnosimy o zastosowanie opraw oświetleniowych typu <strong>full cut-off</strong> \u2014 czyli kierujących 100% światła w dół, na drogę, bez rozpraszania na boki i w górę. Dodatkowo temperatura barwowa powinna wynosić max 2700K (ciepłe, żółtawe światło) zamiast standardowych 4000K (zimne, białe).</p><p>Ciepłe światło jest mniej uciążliwe dla oczu i snu, a jednocześnie mniej szkodliwe dla fauny nocnej (nietoperze, owady, ptaki \u2014 zimne światło je dezorientuje i odpycha z siedlisk). To rozwiązanie jest standardem w holenderskich i duńskich projektach drogowych przy zabudowie mieszkaniowej.</p><p><strong>Wniosek formalny:</strong> Zastosowanie opraw \u22642700K z pełną kierunkowością (full cut-off), minimalizujących zanieczyszczenie świetlne w kierunku budynków i siedlisk fauny.</p>',
    codes: ['FA-15'] },
  { id: 'Q17', category: 'Pakiet kompensacyjny',
    title: 'Biuro informacyjne dla mieszkańców',
    desc: 'Stały punkt kontaktu z dostępem do dokumentacji, harmonogramu i danych monitoringowych.',
    detailedDesc: '<p>Budowa potrwa prawie 2 lata, a procedura środowiskowa jeszcze dłużej. W tym czasie mieszkańcy potrzebują <strong>stałego punktu kontaktu</strong>, gdzie mogą:</p><p>\u2022 Zobaczyć aktualną dokumentację i plany<br>\u2022 Sprawdzić harmonogram prac (kiedy będą najgłośniejsze roboty, kiedy zamknięcia dróg)<br>\u2022 Zgłosić problemy (nadmierny hałas, uszkodzenia, zanieczyszczenia)<br>\u2022 Uzyskać dane monitoringowe (poziom hałasu, drgań, wód gruntowych)<br>\u2022 Porozmawiać z przedstawicielem inwestora</p><p>Biuro powinno funkcjonować od dnia wszczęcia postępowania środowiskowego do końca budowy. Może to być punkt stacjonarny lub dyżur w ustalonych godzinach \u2014 ważne, żeby był regularny i dostępny.</p><p>To standard transparentności w dużych inwestycjach infrastrukturalnych. Daje mieszkańcom poczucie, że ich głos jest słyszany i że mają wpływ na przebieg procesu.</p><p><strong>Wniosek formalny:</strong> Powołanie stałego biura informacyjnego dla mieszkańców strefy oddziaływania, ze szczególnym uwzględnieniem osiedla Oliva Koncept.</p>',
    codes: ['PR-8'] },

  // --- Bezpieczeństwo na drodze ---
  { id: 'Q18', category: 'Bezpieczeństwo na drodze',
    title: 'Analiza bezpieczeństwa drogowego (BRD)',
    desc: 'Minimalne parametry drogi (pasy 3.0 m, pobocza 0.5 m) budzą wątpliwości przy autobusach 18 m.',
    detailedDesc: '<p>KIP przewiduje <strong>minimalne parametry geometryczne</strong> drogi: pasy ruchu 3.0 m, buspas 3.0 m, pobocza 0.5-1.25 m. Autobus przegubowy ma szerokość 2.55 m \u2014 to zostawia zaledwie <strong>22.5 cm marginesu z każdej strony</strong> na 3-metrowym buspasie.</p><p>Ul. Spacerowa to droga z łukami, zmienną niweletą i odcinkami leśnymi (ograniczona widoczność). Przy takich warunkach minimalne parametry mogą nie zapewniać bezpieczeństwa \u2014 szczególnie przy spotkaniu autobusu 18 m z samochodem osobowym na sąsiednim pasie.</p><p>Wnosimy o przeprowadzenie pełnej analizy bezpieczeństwa ruchu drogowego (BRD), która wykaże, czy przyjęte parametry są bezpieczne w rzeczywistych warunkach ul. Spacerowej. Jeśli analiza wykaże zagrożenia, inwestor powinien przedstawić warianty projektowe godzące bezpieczeństwo z minimalizacją ingerencji w środowisko.</p><p><strong>Wniosek formalny:</strong> Analiza BRD wykazująca, że minimalne parametry drogi zapewniają bezpieczeństwo przy autobusach 18 m na łukach i odcinkach leśnych ul. Spacerowej.</p>',
    codes: ['DR-1'] },
];

// ============================================
// GAIN CARD DETAILS (landing page)
// ============================================
const GAIN_DETAILS = {
  noise: {
    title: 'Skuteczna ochrona akustyczna',
    body: '<p>Planowany buspas z 308 autobusami dziennie (w tym 34 nocą) wygeneruje hałas znacznie przekraczający normy \u2014 prognozowane przekroczenia to <strong>9 dB w dzień i 11 dB w nocy</strong> przy naszym osiedlu.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Ekrany klasy A4</strong> zamiast minimalnej A3 \u2014 dodatkowe 3 dB ochrony<br>\u2022 <strong>Transparentne panele</strong> przy zabudowie \u2014 żeby ekrany nie zasłaniały światła<br>\u2022 <strong>Analizę wyższych kondygnacji</strong> \u2014 ekrany 3-6 m nie chronią pięter powyżej drugiego<br>\u2022 <strong>Cichą nawierzchnię</strong> \u2014 redukcja hałasu toczenia o 3-5 dB<br>\u2022 <strong>Analizę hałasu nocnego</strong> \u2014 jeden autobus nocą może budzić (LAmax wg WHO)<br>\u2022 <strong>Analizę niskich częstotliwości</strong> \u2014 dudnienie 20-200 Hz przenika przez ściany<br>\u2022 <strong>Kumulację hałasu</strong> \u2014 buspas + kolej + al. Grunwaldzka + zoo<br>\u2022 <strong>Stałą stację monitoringu</strong> \u2014 pomiar hałasu online 24/7</p><p>Łącznie 17 wniosków formalnych w kategorii akustycznej, opartych na normach PN, wytycznych WHO i orzecznictwie TSUE.</p>'
  },
  buildings: {
    title: 'Bezpieczeństwo budynków',
    body: '<p>Budowa buspasa bezpośrednio przy osiedlu, na gruntach niespoistych (80% podłoża wg KIP), z użyciem ciężkiego sprzętu, <strong>niesie realne ryzyko uszkodzeń budynków</strong> \u2014 pęknięć ścian, nierównomiernego osiadania fundamentów, uszkodzeń instalacji.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Stan zerowy budynków</strong> \u2014 dokumentacja fotograficzna PRZED budową (dowód w razie szkód)<br>\u2022 <strong>Analizę drgań</strong> \u2014 wpływ robót budowlanych i przejazdów autobusów na konstrukcję budynków<br>\u2022 <strong>Analizę gruntów</strong> \u2014 ryzyko upłynnienia i zagęszczania wibracyjnego piasków<br>\u2022 <strong>Model hydrogeologiczny</strong> \u2014 wpływ pompowania wód gruntowych (50-80 m\u00B3/h) na fundamenty<br>\u2022 <strong>Analizę osuwiskową</strong> \u2014 KIP sam wskazuje teren jako zagrożony osuwiskami<br>\u2022 <strong>Fundusz gwarancyjny 10 mln zł</strong> \u2014 depozyt bankowy na natychmiastowe naprawy<br>\u2022 <strong>Niezależny inspektor</strong> \u2014 wybrany przez wspólnotę, nie przez inwestora</p><p>Łącznie 13 wniosków formalnych w kategorii ochrony budynków.</p>'
  },
  value: {
    title: 'Ochrona wartości mieszkań',
    body: '<p>Budowa buspasa z ekranami akustycznymi bezpośrednio przy osiedlu <strong>może obniżyć wartość mieszkań o 5-15%</strong>. Dla przeciętnego mieszkania w Oliwie (500-700 tys. zł) to strata <strong>30-100 tys. zł</strong> na rodzinę.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Niezależną wycenę</strong> \u2014 biegły rzeczoznawca wycenia nieruchomości PRZED budową (punkt odniesienia)<br>\u2022 <strong>Analizę wpływu</strong> \u2014 inwestor musi przedstawić, jak budowa wpłynie na wartość nieruchomości<br>\u2022 <strong>Mechanizm kompensacji</strong> \u2014 jeśli wartość spadnie, inwestor musi wyrównać różnicę</p><p>Prawo polskie daje właścicielom co najmniej <strong>4 podstawy prawne</strong> roszczeń odszkodowawczych:</p><p>\u2022 Art. 129 Prawa ochrony środowiska \u2014 ograniczenie korzystania z nieruchomości<br>\u2022 Art. 36 ustawy o planowaniu \u2014 zmiana przeznaczenia terenu<br>\u2022 Art. 435 Kodeksu cywilnego \u2014 odpowiedzialność za ruch przedsiębiorstwa<br>\u2022 Art. 144 Kodeksu cywilnego \u2014 immisje ponadprzeciętne</p><p>Pismo wskazuje te podstawy w uzasadnieniu, co <strong>wzmacnia pozycję prawną</strong> każdego właściciela.</p>'
  },
  green: {
    title: 'Zieleń wokół osiedla',
    body: '<p>Inwestycja zakłada wycinkę <strong>560 drzew</strong> i zniszczenie <strong>3,7 ha siedlisk Natura 2000</strong> (grąd, buczyna, łęg). To poważna ingerencja w ekosystem, który jest integralną częścią Trójmiejskiego Parku Krajobrazowego.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Nasadzenia zastępcze 3:1</strong> \u2014 minimum 1680 nowych drzew gatunków rodzimych<br>\u2022 <strong>Kompensacja siedlisk Natura 2000</strong> \u2014 odtworzenie zniszczonych siedlisk w stosunku co najmniej 1:1<br>\u2022 <strong>Pas zieleni izolacyjnej 15 m</strong> \u2014 wielopiętrowy bufor między drogą a osiedlem<br>\u2022 <strong>Pełna inwentaryzacja dendrologiczna</strong> \u2014 560 drzew z gatunkiem, obwodem i stanem<br>\u2022 <strong>Ochrona pomnika przyrody</strong> \u2014 dąb szypułkowy 40 m od osi inwestycji<br>\u2022 <strong>Inwentaryzacja sezonowa</strong> \u2014 wiosenna (geofity) i jesienna (storczyki)<br>\u2022 <strong>Monitoring 10-letni</strong> \u2014 czy nasadzenia i kompensacje faktycznie się przyjęły</p><p>Łącznie 15 wniosków formalnych w kategorii przyrodniczej.</p>'
  },
  access: {
    title: 'Dostępność w czasie budowy',
    body: '<p>Budowa potrwa <strong>18-24 miesiące</strong>. W tym czasie ul. Spacerowa \u2014 jedyna wygodna droga dojazdowa do osiedla \u2014 będzie częściowo lub całkowicie zamknięta. To oznacza codzienne utrudnienia dla kilkuset rodzin.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Plan organizacji ruchu</strong> \u2014 szczegółowy harmonogram z fazami budowy, mapą objazdów i planem komunikacji zastępczej<br>\u2022 <strong>Dojazd ratunkowy \u226415 min</strong> \u2014 gwarancja, że karetka i straż dotrą na czas<br>\u2022 <strong>Przystanek tymczasowy \u2264300 m</strong> \u2014 ciągłość komunikacji miejskiej<br>\u2022 <strong>Bezpieczne trasy szkolne</strong> \u2014 wyznaczone i oznakowane dojścia do placówek oświatowych<br>\u2022 <strong>Analiza wpływu na zoo i TPK</strong> \u2014 dostępność atrakcji turystycznych<br>\u2022 <strong>Plan dla osób starszych i niepełnosprawnych</strong> \u2014 alternatywne środki mobilności</p><p>Łącznie 6 wniosków formalnych dotyczących organizacji ruchu i dostępności w fazie budowy.</p>'
  },
  voice: {
    title: 'Głos mieszkańców',
    body: '<p>KIP została sporządzona <strong>bez żadnych konsultacji z mieszkańcami</strong> osiedla Oliva Koncept. Nasze osiedle nie pojawia się w analizach, nie ma punktów pomiarowych przy naszych budynkach, nie ma nawet wzmianki o kilkuset rodzinach mieszkających bezpośrednio przy trasie.</p><p>Pismo zawiera wnioski o:</p><p>\u2022 <strong>Pełne konsultacje społeczne</strong> \u2014 spotkanie informacyjne, wyłożenie dokumentacji, możliwość składania uwag (art. 33 ustawy OOŚ, art. 6 Konwencji z Aarhus)<br>\u2022 <strong>Indywidualne zawiadomienia</strong> \u2014 właściciele w strefie 100 m od trasy powinni otrzymać osobne powiadomienie<br>\u2022 <strong>Rozprawę administracyjną</strong> \u2014 otwartą dla społeczeństwa, z udziałem inwestora<br>\u2022 <strong>Biuro informacyjne</strong> \u2014 stały punkt kontaktu z dokumentacją i danymi monitoringowymi<br>\u2022 <strong>Identyfikację grup interesariuszy</strong> \u2014 mieszkańcy, rodzice, osoby starsze, rowerzyści, odwiedzający zoo<br>\u2022 <strong>Udostępnienie dokumentacji elektronicznie</strong> \u2014 PDF z OCR, pliki .shp, dane źródłowe</p><p>To nie jest kwestia \u201Emiłego gestu\u201D \u2014 to <strong>obowiązek prawny</strong> wynikający z Konwencji z Aarhus, dyrektywy EIA i polskiej ustawy o udostępnianiu informacji o środowisku.</p>'
  }
};

// Quiz answers — default all true
const quizAnswers = {};
QUIZ_QUESTIONS.forEach(q => { quizAnswers[q.id] = true; });

// ============================================
// MODAL
// ============================================
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('info-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('info-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function openQuizModal(id) {
  const q = QUIZ_QUESTIONS.find(x => x.id === id);
  if (q && q.detailedDesc) openModal(q.title, q.detailedDesc);
}

function openGainModal(id) {
  const g = GAIN_DETAILS[id];
  if (g) openModal(g.title, g.body);
}

// ============================================
// QUIZ RENDERING
// ============================================
function renderQuiz() {
  const container = document.getElementById('quiz-container');
  let html = '';
  let lastCat = '';

  QUIZ_QUESTIONS.forEach(q => {
    if (q.category !== lastCat) {
      if (lastCat) html += '</div>';
      html += `<div class="quiz-category"><h3 class="quiz-cat-title">${q.category}</h3>`;
      lastCat = q.category;
    }
    html += `
      <div class="quiz-item" data-quiz="${q.id}" id="qi-${q.id}">
        <div class="quiz-text">
          <strong>${q.title}</strong>
          <p>${q.desc}</p>
          <a href="javascript:void(0)" class="more-link" onclick="openQuizModal('${q.id}')">o co chodzi? &rarr;</a>
        </div>
        <div class="quiz-toggle">
          <button class="toggle-btn active" data-value="yes" onclick="quizToggle('${q.id}',true,this)">TAK</button>
          <button class="toggle-btn" data-value="no" onclick="quizToggle('${q.id}',false,this)">NIE</button>
        </div>
      </div>`;
  });
  if (lastCat) html += '</div>';
  container.innerHTML = html;
  updateQuizCount();
}

function quizToggle(id, value, btn) {
  quizAnswers[id] = value;
  const item = document.getElementById('qi-' + id);
  const btns = item.querySelectorAll('.toggle-btn');
  btns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  item.classList.toggle('off', !value);
  updateQuizCount();
}

function quizSelectAll(value) {
  QUIZ_QUESTIONS.forEach(q => {
    quizAnswers[q.id] = value;
    const item = document.getElementById('qi-' + q.id);
    if (!item) return;
    const btns = item.querySelectorAll('.toggle-btn');
    btns.forEach(b => {
      b.classList.remove('active');
      if ((value && b.dataset.value === 'yes') || (!value && b.dataset.value === 'no'))
        b.classList.add('active');
    });
    item.classList.toggle('off', !value);
  });
  updateQuizCount();
}

function updateQuizCount() {
  const count = Object.values(quizAnswers).filter(v => v).length;
  const total = QUIZ_QUESTIONS.length;
  document.getElementById('quiz-count').textContent = `${count} z ${total}`;
}

// ============================================
// QUIZ → PETITUM MAPPING
// ============================================
function getSelectedPetitumItems() {
  const excludedCodes = new Set();
  QUIZ_QUESTIONS.forEach(q => {
    if (!quizAnswers[q.id]) {
      q.codes.forEach(c => excludedCodes.add(c));
    }
  });

  const items = PETITUM_CONFIG.items;
  const result = [];

  for (const item of items) {
    if (item.code === 'AK-16') {
      const text = buildAK16Text();
      if (text) result.push({ code: 'AK-16', text: text });
      continue;
    }
    if (excludedCodes.has(item.code)) continue;
    result.push(item);
  }
  return result;
}

function buildAK16Text() {
  const parts = [];
  if (quizAnswers.Q13) {
    parts.push('(a) przeprowadzenie indywidualnego pomiaru akustycznego w budynkach osiedla (KIP zawiera pomiar tylko w 1 punkcie na 5,7 km trasy)');
    parts.push('(b) sfinansowanie wymiany filtrów wentylacji rekuperacyjnej w okresie budowy i przez 2 lata po jej zakończeniu (zwiększone zapylenie i spaliny z budowy przyspieszają zużycie filtrów istniejącej instalacji)');
  }
  if (quizAnswers.Q14) {
    parts.push('(c) zainstalowanie stałej stacji monitoringu hałasu i drgań z publicznym dostępem do wyników online');
  }
  parts.push('(d) ustanowienie funduszu gwarancyjnego na naprawę ewentualnych szkód budowlanych');

  return 'Objęcie osiedla Oliva Koncept \u2014 jako zabudowy wielorodzinnej bezpośrednio narażonej na skumulowane oddziaływanie akustyczne, wibracyjne i niskoczęstotliwościowe \u2014 pakietem środków kompensacyjnych obejmującym: ' + parts.join(', ') + '.';
}

// ============================================
// STEP NAVIGATION
// ============================================
function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step-' + n);
  if (target) target.classList.add('active');

  document.querySelectorAll('.progress-dot').forEach((dot, i) => {
    dot.classList.remove('done', 'current');
    if (i + 1 < n) dot.classList.add('done');
    else if (i + 1 === n) dot.classList.add('current');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ADDRESS HELPERS
// ============================================
const BASE_STREET = 'ul. Karwieńska 1';
const BASE_ZIP_CITY = '80-328 Gdańsk';

function buildAddress() {
  const building = document.getElementById('field-building').value.trim().toUpperCase();
  const apt = document.getElementById('field-apt').value.trim();
  let addr = BASE_STREET;
  if (building) addr += building;
  if (apt) addr += '/' + apt;
  addr += ', ' + BASE_ZIP_CITY;
  return addr;
}

function updateAddressPreview() {
  document.getElementById('address-preview').textContent = buildAddress();
}

// ============================================
// FORM VALIDATION
// ============================================
function validateForm() {
  const fields = ['name', 'building', 'apt', 'kw'];
  let valid = true;
  fields.forEach(id => {
    const input = document.getElementById('field-' + id);
    if (!input.value.trim()) {
      input.style.borderColor = '#DC2626';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  return valid;
}

// ============================================
// PDF GENERATION
// ============================================
async function generatePDF() {
  if (!validateForm()) return;

  const selectedItems = getSelectedPetitumItems();
  const loadingMsg = document.getElementById('loading-msg');
  if (loadingMsg) {
    loadingMsg.innerHTML = 'Trwa składanie dokumentu z <strong>' + selectedItems.length + '</strong> wnioskami formalnymi.';
  }

  showStep(4);

  const name = document.getElementById('field-name').value.trim();
  const building = document.getElementById('field-building').value.trim().toUpperCase();
  const apt = document.getElementById('field-apt').value.trim();
  const address = buildAddress();
  const kw = document.getElementById('field-kw').value.trim();
  const pesel = document.getElementById('field-pesel').value.trim();

  const today = new Date();
  const dateStr = today.toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  try {
    const allSelected = Object.values(quizAnswers).every(v => v);

    if (allSelected) {
      const templateBytes = await fetch('szablon.pdf').then(r => r.arrayBuffer());
      const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
      pdfDoc.registerFontkit(fontkit);

      const fontBytes = await fetch('LiberationSerif-Regular.ttf').then(r => r.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);

      const page = pdfDoc.getPages()[0];
      fillPersonalData(page, font, { dateStr, name, address, apt, kw, pesel });

      generatedPdfBytes = await pdfDoc.save();

    } else {
      const templateBytes = await fetch('szablon.pdf').then(r => r.arrayBuffer());
      const srcDoc = await PDFLib.PDFDocument.load(templateBytes);

      const finalDoc = await PDFLib.PDFDocument.create();
      finalDoc.registerFontkit(fontkit);

      const fontRegBytes = await fetch('LiberationSerif-Regular.ttf').then(r => r.arrayBuffer());
      const fontBoldBytes = await fetch('LiberationSerif-Bold.ttf').then(r => r.arrayBuffer());
      const fontReg = await finalDoc.embedFont(fontRegBytes);
      const fontBold = await finalDoc.embedFont(fontBoldBytes);

      const petStart = PETITUM_CONFIG.petitumStartPage - 1;
      const closingStart = PETITUM_CONFIG.closingStartPage - 1;
      const totalPages = PETITUM_CONFIG.totalPages;

      const bodyIndices = [];
      for (let i = 0; i < petStart; i++) bodyIndices.push(i);
      const bodyPages = await finalDoc.copyPages(srcDoc, bodyIndices);
      bodyPages.forEach(p => finalDoc.addPage(p));

      await renderPetitumPages(finalDoc, fontReg, fontBold, selectedItems);

      const closingIndices = [];
      for (let i = closingStart; i < totalPages; i++) closingIndices.push(i);
      const closingPages = await finalDoc.copyPages(srcDoc, closingIndices);
      closingPages.forEach(p => finalDoc.addPage(p));

      const firstPage = finalDoc.getPages()[0];
      fillPersonalData(firstPage, fontReg, { dateStr, name, address, apt, kw, pesel });

      addPageNumbers(finalDoc, fontReg);

      generatedPdfBytes = await finalDoc.save();
    }

    await new Promise(r => setTimeout(r, 800));
    showStep(5);

  } catch (err) {
    console.error('PDF generation error:', err);
    alert('Wystąpił błąd podczas generowania PDF. Spróbuj ponownie.');
    showStep(3);
  }
}

// ============================================
// FILL PERSONAL DATA ON PAGE 1
// ============================================
function fillPersonalData(page, font, data) {
  const fontSize = 12;
  function drawField(field, text) {
    if (!text) return;
    const coords = PDF_FIELDS[field];
    page.drawText(text, {
      x: coords.x, y: coords.y,
      size: fontSize, font: font,
      color: PDFLib.rgb(0.1, 0.1, 0.1),
    });
  }
  drawField('date', data.dateStr);
  drawField('name', data.name);
  drawField('address', data.address);
  drawField('apt', data.apt);
  drawField('kw', data.kw);
  if (data.pesel) drawField('pesel', data.pesel);
}

// ============================================
// RENDER PETITUM PAGES (dynamic)
// ============================================
async function renderPetitumPages(pdfDoc, fontReg, fontBold, selectedItems) {
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const ML = 85;
  const MR = 57;
  const MT = 71;
  const MB = 85;
  const MAX_W = PAGE_W - ML - MR;
  const PET_INDENT = 28;
  const FONT_SIZE = 11;
  const LEADING = 16;

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MT;

  page.drawText('8. PETITUM', { x: ML, y, size: 13, font: fontBold, color: PDFLib.rgb(0, 0, 0) });
  y -= 26;
  page.drawText('Wobec powyższego, wnoszę o:', { x: ML, y, size: 12, font: fontBold, color: PDFLib.rgb(0, 0, 0) });
  y -= 22;

  for (let i = 0; i < selectedItems.length; i++) {
    const item = selectedItems[i];
    const num = i + 1;
    const prefix = num + '. ';
    const prefixWidth = fontBold.widthOfTextAtSize(prefix, FONT_SIZE);

    const textLines = wrapText(item.text, fontReg, FONT_SIZE, MAX_W - PET_INDENT - prefixWidth);

    const neededHeight = Math.min(textLines.length, 3) * LEADING + 10;
    if (y - neededHeight < MB) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MT;
    }

    page.drawText(prefix, {
      x: ML + PET_INDENT, y,
      size: FONT_SIZE, font: fontBold, color: PDFLib.rgb(0, 0, 0)
    });

    if (textLines.length > 0) {
      page.drawText(textLines[0], {
        x: ML + PET_INDENT + prefixWidth, y,
        size: FONT_SIZE, font: fontReg, color: PDFLib.rgb(0, 0, 0)
      });
    }
    y -= LEADING;

    for (let j = 1; j < textLines.length; j++) {
      if (y < MB) {
        page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MT;
      }
      page.drawText(textLines[j], {
        x: ML + PET_INDENT + prefixWidth, y,
        size: FONT_SIZE, font: fontReg, color: PDFLib.rgb(0, 0, 0)
      });
      y -= LEADING;
    }

    y -= 6;
  }
}

// ============================================
// WORD WRAP HELPER
// ============================================
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [''];
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    try {
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    } catch (e) {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

// ============================================
// PAGE NUMBERS
// ============================================
function addPageNumbers(pdfDoc, font) {
  const pages = pdfDoc.getPages();

  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const text = 'Strona ' + (i + 1);
    const textWidth = font.widthOfTextAtSize(text, 9);

    page.drawRectangle({
      x: 0, y: 0,
      width: width, height: 40,
      color: PDFLib.rgb(1, 1, 1),
      opacity: 1,
    });

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: 28,
      size: 9,
      font: font,
      color: PDFLib.rgb(0.4, 0.4, 0.4),
    });
  });
}

// ============================================
// METHOD SELECTION
// ============================================
function selectMethod(method) {
  document.querySelectorAll('.method-instructions').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById('method-' + method).style.display = 'block';
  showStep(6);
}

// ============================================
// DOWNLOAD PDF
// ============================================
function downloadPDF() {
  if (!generatedPdfBytes) return;
  const blob = new Blob([generatedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pismo-uwagi-do-KIP-Spacerowa.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================
// EPUAP REDIRECT
// ============================================
function downloadAndOpenEpuap() {
  downloadPDF();
  setTimeout(() => {
    window.open('https://obywatel.gov.pl/wyslij-pismo-ogolne', '_blank');
  }, 1000);
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  showStep(1);
  renderQuiz();

  ['field-building', 'field-apt'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateAddressPreview);
  });

  document.querySelectorAll('#step-3 input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generatePDF();
    });
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
