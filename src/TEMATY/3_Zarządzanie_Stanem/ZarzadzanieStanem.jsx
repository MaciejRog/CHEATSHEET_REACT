import { useState } from "react";

function ZarzadzanieStanem() {
  return (
    <div>
      <ZarzadzanieStanemInput />
      <ZarzadzanieStanemStruktura />
      <ZarzadzanieStanemWspoldzielenieStanu />
      <ZarzadzanieStanemZachowywanieIResetowanie />
    </div>
  );
}

export default ZarzadzanieStanem;

// #################################
// #### 1) STATE - reagowanie na INPUTY
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemInput() {
  // REACT zapewnia DEKLARATYWNE (declarative) MANIPULOWANIE UI
  /*
  IMPERAKTYWNE  -> dokładne instrukcje do zarządzanie UI, bazując na tym co się dzieje
                  // jak jazda samochodem -> skeć w lewo, prawo i inne instrukcje w danej chwili (nie wiedząc gdzie jedziemy)
                  // imperaktywne -> bo zarządzamy każdym elementem UI z osobna poprzez komendy
  DEKLARATYWNY  -> określamy co chcemy zobaczyć lub ukryć bezpośrednio (a jak to zrobić określa wewnętrznie react)
                  // jak TAXI, gdzie chcemy dojechać i sam nas wiezie
  
  */
  /*
  DEKLARATYWNE PISANIE KODY:
  1) IDENTYFIKACJA KOMPONENTÓW
  2) OKREŚLENIE CO ZMIENIA STAN (co moze go zmieniać) 
      - interakcja użytkownika (kliknięcie, wpisanie z klawiatury)
      - interakcja komputera (np: timeout, odpowiedź z API)
  3) ODZWIERCIEDLENIE STANU jako 'useState'
  4) USUNIĘCIE zbędnych danych stanu
  5) DODANIE event handlersów

 */

  return <></>;
}

// #################################
// #### 2) STRUKTURA STANU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemStruktura() {
  /*
  ZASADY STRUKTURY STANU:
  1) GRUPUJ ZALEŻNE STANY
    - jeśli zawsze aktualizuję 2 stany w tym samym czasie to lepiej je połączyć w 1 
    - np: wspólny stan dla formularza
    - np: położenie X,Y elementów / kursora itp...
  2) UNIKAJ SPRZECZNOŚCI STANU
    - unikać sytuacji gdy stany mogą mieć sprzeczne wartości
  3) UNIKAJ NADMIAROWEGO STANU
    - to co można wyliczyć z obecnego STATE lub PROP nie powinno być jako stan tylko zwykła zmienna
    UWAGA !!!
          Kompoenent({color}){
            // GDY zmieni się prop 'color' wartość stanu się nie nadpisze!!! użyteczne tylko dla inicjalizacji stanu wartością 
            const [stan, setStan] = useState(color);
          }
  4) UNIKAJ DUPLIKATÓW
    - cięzko sychnronizować duplikaty więc lepiej ich nie mieć
  5) UNIKAJ BARDZO ZAGNIEŻDŻONYCH STRUKTUR DANYCH
    - bardzo ciężki update (najlepsze są płaskie stuktury)
  */
  return <></>;
}

// #################################
// #### 3) DZIELENIE STANU MIĘDZY KOMPONENTAMI
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemWspoldzielenieStanu() {
  /*  
  KOMPONENTY KONTROLOWANE -> są zależne od wartosci dostarczonych ich przez props (rodzic ma na nie wpływ)

  KOMPONENTY NIEKTOROLOWANE -> posiadają stan lokalny (są nie zależne od danych z rodzica -> props na nie nie wpływają)

  często w przrodzie występuje zmieszanie tych zależności
  1 ŹRÓDŁO PRAWDY -> zawsze jest komponet, który posiada i zarządza stan, który odziałuje na inne komponenty

  */
  // aby 2 komponenty współdzieliły stan należy go przenieść do ich najbliższego wspólnego potomka i przekazać jako prop
  // zapieg ten to 'LIFTING STATE UP' - podnoszenie stanu w górę
  const [stan, setStan] = useState(0);
  return (
    <>
      {/* ten chce mieć dostęp do stanu */}
      <ZarzadzanieStanemWspoldzielenieStanuChild1
        stan={stan}
        setStan={setStan}
      />
      {/* ten nie chce, ale jego dziecko 'ZarzadzanieStanemWspoldzielenieStanuChild3' już tak więc też go przekazujemy
        aby wykonać tzw... prop drilling [przekazanie stanu/props dalej przez komponent, który ich nie potrzebuje ]
      */}
      <ZarzadzanieStanemWspoldzielenieStanuChild2
        stan={stan}
        setStan={setStan}
      />
      {/* 
        Aby obejść prop-drilling można wykorzystać mechanizm 'props.children'
      */}
      <ZarzadzanieStanemWspoldzielenieStanuChild4>
        <ZarzadzanieStanemWspoldzielenieStanuChild5
          stan={stan}
          setStan={setStan}
        />
      </ZarzadzanieStanemWspoldzielenieStanuChild4>
    </>
  );
}

function ZarzadzanieStanemWspoldzielenieStanuChild1({ stan, setStan }) {
  return (
    <span
      onClick={() => {
        setStan(1);
      }}
    >
      DZIECKO 1 {stan}
    </span>
  );
}

function ZarzadzanieStanemWspoldzielenieStanuChild2(props) {
  return (
    <>
      <ZarzadzanieStanemWspoldzielenieStanuChild3 {...props} />
    </>
  );
}

function ZarzadzanieStanemWspoldzielenieStanuChild3({ stan, setStan }) {
  return (
    <span
      onClick={() => {
        setStan(3);
      }}
    >
      DZIECKO 3 {stan}
    </span>
  );
}

function ZarzadzanieStanemWspoldzielenieStanuChild4({ children }) {
  return <>{children}</>;
}

function ZarzadzanieStanemWspoldzielenieStanuChild5({ stan, setStan }) {
  return (
    <span
      onClick={() => {
        setStan(5);
      }}
    >
      DZIECKO 5 {stan}
    </span>
  );
}

// #################################
// #### 4) PRZECHOWYWANIE i RESETOWANIE STANU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemZachowywanieIResetowanie() {
  /*
  PRZECHOWYWANIE STANU MIĘDZY RERENDERAMI
  #####

  Stan jest izolowany między komponentami -> 2 instancje komponentu mogą mieć różne wartości tego samego stanu
  REACT wie o tym który stan należy do którego komponentu poprzez jego pozycje w DRZEWIE UI (UI TREE)

  stan jest trzymany wewnątrz reacta i jest dostarczany na podstawie zależności do danego komponentu
  REACT trzyma stan komponentu tak długo jak jest w DRZEWIE UI na tym samym miejscu 
    - przy znieknięciu (usunięciu) z drzewa (STAN JEST NISZCZONY - wraz ze stanami dzieci (PODRZEWO))
    - dodaniu do drzewa (STAN JEST DODAWANY OD ZERA - wraz ze stanami dzieci (PODRZEWO))
    - zmianie pozycji w drzewie  (STAN JEST NISZCZONY I DODAWANY OD ZERA dla danej pozycji - wraz ze stanami dzieci (PODRZEWO))
    - czyli wyrenderowanie TEGO SAMEGO KOMPONENTU (z innymi PROPS) W TYM SAMYM MIEJSCU (zachowa ustawiony STAN i nie zmienione PROPSY)

  WIĘC LICZY SIĘ UMIEJSCOWIENIE w DRZEWIE UI, (uwaga nie musi być tożsame z pozycją w JSX, choć w 99% jest - kolejność elementów i zagnieżdzeń)
        <div> -> renderuje najpier <p> potem <span> (a nie na odwrót to się liczy) 
        [ABY ZACHOWAĆ STAN między RERENDERS STRUKTURA MUSI BYĆ NIE_ZMIENIONA ]
        jeżeli zamiast <p> będzie nagle <section> to wykonają się te mechanizmy usunięcie i dodania 


  UWAGA !!! Nigdy nie definiować komponentów w sobie -> za każdym razem tworzy nową funckję komponentu, przez co w tym samym miejscu UI TREE
            jest renderowany inny NOWY komponent, nawet mimo iż zwraca identyczne tagi to i tak STAN będzie zresetowany
            function K1(){

              function K2(){      // !!!! NIGDY TAK NIE ROBIĆ 
                return <>
                  <p>K2</>
                </>
              }

              return <>
                <p>K1</>
                <K2 />
              </>
            }

  
  RESETOWANIE STANU MIĘDZY RERENDERAMI
  #####
  1) zmiana pozycji komponentu w DRZEWIE UI
    np: zamiast {warunek ? <Komp atr="A"/> : <Komp atr="B"/> }
    to: =>      {warunekA && <Komp atr="A"/>}{warunekB && <Komp atr="B"/> }   // zwracają 'null' gdy nie spełnione co zmienia DRZEWO UI
  2) zmiana atrybutu 'key' komponentu
    Domyslnie REACT używa kolejności wystąpienie dzieci w rodzicu aby nadać 'KLUCZE POZYCJI' dla komponentów (1,2,3, ...)
    Ale atrybut 'key' pozwala nam samego nadać wartośc dla tego 'KLUCZA'
    UWAGA !!! key (NIE JEST GLOBALNE), jest LOKALNE dla każdego RODZICA z osobna 
            // -> więc mozna mieć taką samą wartość key w róznych komponentach

    jeżeli KEY -> nie zmieni się między rerenderami to komponent też nie
    jeśli się zmieni -> to komponent jest traktowany jak nowy i stary jest niszczony co resetuje STAN
                {warunek ? <Komp key="A" atr="A"/> : <Komp key="B" atr="B"/> }

  */
  return <></>;
}

// #################################
// #### 5)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 6)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 7)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
