import { createContext, useContext, useReducer, useState } from "react";

function ZarzadzanieStanem() {
  return (
    <div>
      <ZarzadzanieStanemInput />
      <ZarzadzanieStanemStruktura />
      <ZarzadzanieStanemWspoldzielenieStanu />
      <ZarzadzanieStanemZachowywanieIResetowanie />
      <ZarzadzanieStanemReducer />
      <ZarzadzanieStanemContext />
      <ZarzadzanieStanemSkalowanie />
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
// #### 5) REDUCER -> zaawansowane zarządzanie stanem
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const initValues = {
  name: "ABC",
  age: 19,
};

// Lubię TYPY AKCJI zdefiniować jako 'enum'
const ACTIONS = {
  SET_NAME: "SET_NAME",
  SET_AGE: "SET_AGE",
};

// funkcja do zarządzania stanem
// przyjmuje state => poprzednia wartość stanu
//          action => obecna akcja (type, payload)
function reducer(state, action) {
  // bazujemy na wyżej zdefiniowanych akcjach (a dokładniej ich typach)
  // UWAGA! Wszystkie operacje muszą byc 'PURE' -> nie zawierać SIDE_EFFECTÓW (fetchy, timerów, operacji na DOM itp...)
  switch (
    action.type // <-- można używać if/else (ale konwencją jest 'switch')
  ) {
    case ACTIONS.SET_NAME:
      // Reducer musi zwrócić NOWY obiekt, tablice (nie wolno nam ich MUTOWAĆ !!!!)
      return {
        ...state,
        // Akcje mogą przekazywać (PAYLOAD - ŁADUNEK), ale nie jest to WYMAGANE
        name: action.payload,
      };
    case ACTIONS.SET_AGE:
      return {
        ...state,
        age: action.payload,
      };
    // jeśli typ akcji jest nieznany do obsługujemy go tutaj
    default:
      console.error("Unknown action");
      // throw new Error("Unknown action");   <-- konwencją jest zwracanie błędu przy nieznanej akcji
      return state;
  }
}

function ZarzadzanieStanemReducer() {
  // useReducer - tworzy stan (tak samo jak 'useState')
  // ZMIANA stanu -> wywołuje RERENDER
  // POZWALA NA WYODRĘBIENIE LOGI ZARZĄDZANIA SKOMPLIKOWANYM STANEM w 1 MIEJSCE (bardzo użyteczne)
  /*    stan -> wartość stanu
        dispatch -> funkcja do wywołania AKCJI (ACTION), która zmieni wartość stanu [IMMUTABLE - niezmienna, 1 i ta sama instancja / referencja]
        reducer -> funkcja do zarządzania stanem  (najlepiej deklarować poza komponentem -> dbamy o PURE KOMPONENT)
        initValues -> wartość początkowa dla naszego STANU (najlepiej deklarować poza komponentem -> dbamy o PURE KOMPONENT)
  */
  // useReducer -> nie może MUTOWAĆ stanu (należy zwracać kopier)
  // możemy użyć bibliteki 'Immer' oraz 'useImmerReducer' -> by mutować stan (wewnętrznie odbędą się nie mutujące zmiany)
  const [stan, dispatch] = useReducer(reducer, initValues);

  function handleClickAgeChange() {
    /*  
    DISPATCHOWANIE -> AKTUALIZOWANIE WARTOŚCI STANU
    DISPATCHUJĄC AKCJĘ musimy ją przekazać 
    AKCJA to obiekt JS, o strukturze 
        type => Unikalna nazwa rodzaj akcji 
        payload => (OPCJONALNY, może nie byc wymagany) wartość którą przekażemy do rodzaju akcji [proste wartości oraz struktury np: obiekt]
                  [nazwa 'payload' to konwencja z REDUXA, pola w AKCJI MOGĄ NAZYWAĆ SIĘ JAK CHCEMY i być ich tyle ile chcemy]
    */
    dispatch({
      type: ACTIONS.SET_AGE,
      payload: 29,
    });
  }

  function handleClickNameChange() {
    dispatch({
      type: ACTIONS.SET_NAME,
      payload: "Aga",
    });
  }

  return (
    <>
      <span onClick={handleClickAgeChange}>AGE = {stan.age}</span>
      <span onClick={handleClickNameChange}>NAME = {stan.name}</span>
    </>
  );

  /*  
  #########
  ##        useReducer            vs           useState
      sporo kodu do napisania               MAŁO KODU DO NAPISANIA (!)
      czytelna logika zmian (!)             przy wielu stanach logika jest mało czytelna
      łatwy do debugowania (!)              przy skomplikowanych updatach trudny do debugowania
      łatwy do testowania (!)               ///
    
  Ale i tak wszystko zależy od preferencji (przy małych stanach zdecydowania useState, przy dużych zdecydowanie useReducer)
  najlepiej je mieszać zależnie od potrzeb :)
  */
}

// #################################
// #### 6) CONTEXT (przekazywanie danych w głąb) - PROP DRILLING SALVATION
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
  UWAGA - czytelniejsze jest przekazywanie props
  WIĘC zawsze zaczynajmy od PROPS -> potem przechodźmy na CONTEXT (łatwiejszy kod w utrzymaniu)

  ZALECANE STOSOWANIE:
    - THEME (kolory w apcje np: dark mode | light mode) [Provider opakowujący App Component]
    - zalogowany USER [tutaj lepszy redux]
    - routing
    - SKOMPLIKOWANY STAN [odpowiednik REDUXA]
*/

// tworzenie kontekstu (może przyjąć dowolną wartość -> i tak zostanie nadpisana)
const TestContext = createContext("Ala ma Kota");

function ZarzadzanieStanemContext() {
  /*
  KONTEXT (CONTEXT) => mechanizm, który pozwala na dostęp do DANYCH (stanu) do dowolnie zagnieżdzonego komponentu (childs i ich childs itd...)
                       BEZ KONIECZNOŚCI PRZEKAZYWANIA ICH poprzez PROPS!!!!
                       ELIMINUJE PROP DRILLING problem (czyli problem z przekazywaniem props do komponentu, który ich nie potrzebuje
                       tylko po to by przekazać je dalej do swoich dzieci lub wnuków lub głębiej, które go potrzebują)
  */
  return (
    // Aby zarządzać wartościami kontekstu musimy opakować komponenty, które mają z niego korzystać w 'Provider' -> NazwaContext.Provider
    // oraz przekazać wartośc (Wartość jest dowolna, może być obiektem z np: STANEM z useState, SETTEREM STANU)
    //  UWAGA - Provider'y mogą być zagnieżdżone w sobie i zmieniać wartośc kontekstu do odczytu
    //          'useContext' odczyta wartośc z najbliższego Providera
    <TestContext.Provider value="Jednak to Aga ma psa">
      <ZarzadzanieStanemContextChild />
      <ZarzadzanieStanemContextZagniezdzenie />
    </TestContext.Provider>
  );
}

function ZarzadzanieStanemContextChild() {
  // czytamy z kontekstu poprzez HOOK 'useContext' podając NazwęContextu
  // zmiana tej wartości spowoduje RERENDER!!
  const test = useContext(TestContext);
  return <p>Kontekst value = {test}</p>;
}

/*
SUPER MECHANIZM DLA ZAGNIEZDZEŃ !!!
*/

const TestContext2 = createContext(1);

function ZarzadzanieStanemContextZagniezdzenie() {
  return (
    <TestContext2.Provider value={1}>
      <ZarzadzanieStanemContextZagniezdzenieChild>
        <ZarzadzanieStanemContextZagniezdzenieChild>
          <ZarzadzanieStanemContextZagniezdzenieChild />
        </ZarzadzanieStanemContextZagniezdzenieChild>
      </ZarzadzanieStanemContextZagniezdzenieChild>
    </TestContext2.Provider>
  );
}
//                                            UWAGA !!! co ciekawe mechanizm {children} pozwala walczyć z PROP DILLINGIEM
//                                            zapobiega przerenderowaniu tego komponentu gdy props się zmienią
//                                            przerenedowuje natomiast ten komponent z 'children' który otrzumuje props i tylko jego !! :)
function ZarzadzanieStanemContextZagniezdzenieChild({ children }) {
  // odczytujemy obecny poziom Zagnieżdżenia
  const level = useContext(TestContext2);
  return (
    <div>
      <p
        style={{
          // coraz głębiej zagnieżdzony 'p' będzie przechodził z kolor 'CZARNEGO' na "BIAŁY"
          color: `rgb(${(255 * level) / 4}, ${(255 * level) / 4} ,${
            (255 * level) / 4
          } )`,
        }}
      >
        POZIOM {level}
      </p>
      {/* Dla zagnieżdżonych komponentów przekazujemy powiększony o 1 poziom zagnieżdżenia */}
      <TestContext2.Provider value={level + 1}>
        {children}
      </TestContext2.Provider>
    </div>
  );
}

// #################################
// #### 7) SKALOWANIE przy POMOCY 'REDUCER' i 'CONTEXT'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
Połączenie technik opisanych powyżej w SUPER WYGODNY mechanizm zarządzania SKOMPLIKOWANYM STANEM 
 
*/

// wartość bazowa dla contextu oraz stanu zwróconego przez REDUCERA
const initSkalowanieContextValue = { imie: "Aga" };
// CONTEXT, który będziemy wykorzystywać - z domyślna wartości tego co wyżej
const SkalowanieContext = createContext(initSkalowanieContextValue);
// UWAGA!!! NOWOŚĆ - tworzymy CUSTOM HOOK (własny hook)
// nazwa musi być od 'use' np: 'useMojaFunkcja' 'useMojHook' 'useNumber' itp...
// bardzo podobne do KOMPONENTU z 1 różnicą NIE ZWRACAMY JSX, a jakiś STAN np: number, Object itp...
const useSkalowanieContext = () => {
  const wartosc = useContext(SkalowanieContext);
  if (wartosc === undefined) {
    throw new Error("use Skalowanie context | Unknown value");
  }
  return wartosc;
};
// Akcje dla Reducera
const SKALOWANIE_CONTEXT_ACTIONS = {
  SET_IMIE: "SET_IMIE",
  RESET: "RESET",
};
// Reducer do obsługi Akcji
function skalowanieReducer(state, action) {
  switch (action.type) {
    case SKALOWANIE_CONTEXT_ACTIONS.SET_IMIE:
      return {
        ...state,
        imie: action.payload,
      };
    case SKALOWANIE_CONTEXT_ACTIONS.RESET:
      return {
        ...initSkalowanieContextValue,
      };
    default:
      throw new Error("Skalowanie context | Unknown action");
  }
}
// NOWOŚĆ -> komponent dostarczający Providera oraz zapewniający wartość na podstawie REDUCERA
function ZarzadzanieStanemSkalowanieContextProvider({ children }) {
  // pobieramy wartość, którą przekażemy do contextu oraz funkcję do zmiany tej wartości na podstawie AKCJI
  const [state, dispatch] = useReducer(
    skalowanieReducer,
    initSkalowanieContextValue
  );
  return (
    <SkalowanieContext.Provider
      // jako wartośc dla kontekstu przekazałem OBIKET { STAN, funkcjaDoZmianyStanu}
      // UWAGA !!! Można rozdzielić ten 1 kontekst na 2 CONTEXTY (1 z wartością , 2 z funkcją zmienijącą -- to będzie jeszcze lepsze)
      value={{
        stan: state,
        dispatch,
      }}
    >
      {children}
    </SkalowanieContext.Provider>
  );
}

function ZarzadzanieStanemSkalowanie() {
  return (
    // Zastosowanie powyższych komponentów
    <ZarzadzanieStanemSkalowanieContextProvider>
      <ZarzadzanieStanemSkalowanieChild />
    </ZarzadzanieStanemSkalowanieContextProvider>
  );
}

function ZarzadzanieStanemSkalowanieChild() {
  // wykorzystanie CUSTOM HOOKA - zwróci to co przekazaliśmy w 'ZarzadzanieStanemSkalowanieContextProvider'
  // czyli OBIEKT => const {stan, dispatch} = useSkalowanieContext();
  const skalowanieContext = useSkalowanieContext();
  function handleClick() {
    if (skalowanieContext?.stan?.imie === "Aga") {
      // Możemy zmienić wartość KONTEKSTU poprzez dispatch
      skalowanieContext.dispatch({
        type: SKALOWANIE_CONTEXT_ACTIONS.SET_IMIE,
        payload: "Maciek",
      });
    } else {
      skalowanieContext.dispatch({
        type: SKALOWANIE_CONTEXT_ACTIONS.RESET,
      });
    }
  }
  return (
    <>
      {/*                             odczytanie wartości z kontekstu */}
      <button onClick={handleClick}>{skalowanieContext?.stan?.imie}</button>
    </>
  );
}
