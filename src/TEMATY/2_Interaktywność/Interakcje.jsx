import { useState } from "react";

function Interakcje() {
  return (
    <div>
      <InterakcjeEventy />
      <InterakcjeState />
      <InterakcjeStateObjects />
      <InterakcjeStateArrays />
    </div>
  );
}

export default Interakcje;

// #################################
// #### 1) ZDARZENIE (EVENTY)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function InterakcjeEventy() {
  // deklarujemy funkcję do obsługi zdarzenia konwencja mówi by zaczynać ją od 'handle' i 'NazwaEventu' np: handleClick, handleSubmit, handleChange
  // funkcja jest deklarowana wewnątrz komponentu (mamy dostęp do setterów stanu)
  // (może też być poza, ale jeśli ma ustawić stan to albo setter trzeba przekazać jako argument)
  // Jak funkcja jest mała to można ją zadeklarować bezpośrednio przy 'onEvent' poniżej jako 'onPointerEnter'
  function handleClick(e) {
    // deklarowana funkcja wewnątrz komponentu, ma dostęp do wszystkiego w nim (PROPS, STATE, REF, CONTEXT itp..)
    // EVENT HANDLERSY - TO NAJLEPSZE MIEJSCE NA SIDE_EFFECTY np: pobranie z serwera poprzez 'fetch', ustawienie stanu itp...
    // więc EVENT HANDLERSY NIE MUSZĄ BYĆ 'PURE' są "UNPURE" :)
    console.warn("KLIKNIETY | e = ", e);
  }

  function hanldeChildClick(e) {
    console.warn("CHILD KLIKNIETY | e = ", e);
  }

  return (
    <>
      {/* Dodajemy atrybut do obsługi zdarzenia zaczynający się od 'on' i 'NazwaEventu' np: 'onClick', 'onPointerDown', 'onKeyPress', onChange */}
      {/* tak na prawdę to nie jest to atrybut tylko PROP! */}
      {/* UWAGA! PRZEKAZUJEMY funkcję lub ją DEKLARUJEMY, a NIE WYWOŁUJEMY */}
      {/* PRZEKAZUJĄC funkcję - react zapamięta ją i wywoła za każdym razem jak wystąpi EVENT do którego została przypisana */}
      {/* Wywołanie jest np: handleClick() -> wywoła funkcję w chwili RENDERU, a nie na zdarzenia */}
      <button
        onClick={handleClick}
        onPointerEnter={() => {
          console.warn("OBSŁUGA wewnątrz eventu");
        }}
      >
        KLIKNIJ MNIE
      </button>
      <InterakcjeEventy2 onChildClick={hanldeChildClick} />
      <InterakcjeEventyDomyslne />
    </>
  );
}

// Funkcje mozna przekazać jako PROPS i wywołać ją z CHILD COMPONENTu
// konwencja jest by zaczynać nazwy prop funkcji od 'on'+'NazwaNaszegoEventu' np: 'onSelectingCard', 'onReachingGoal' itp...
function InterakcjeEventy2({ onChildClick }) {
  return (
    <div
      onClick={(e) => {
        // Aby uniemożliwić poniżej opisany mechanizm PROPAGACJI
        // należy wywołać na przekazanym obiekcie 'event' [zawsze 1 argument w handlerze tutaj nazwany 'e' (nazwa dowolna)] metodę
        // od tego handlera wszyscy rodzice wyżej już nie wywołają onClick (o ile tacy są) :)
        // Ale spokojnie jeśli klikniemy rodzica (nie ten element, ale rodzica tego) i on ma onClick to już się na luzie wykona
        // po prostu od tego wyżej nie przejdziemy, a nie że cos się usuwa ;)
        e.stopPropagation();
        console.warn("DIV TEZ KLIKNIETY");
      }}
    >
      <button
        onClick={onChildClick}
        onClickCapture={() => {
          // UWAGA! RZADKI PRZYPADEK
          // można też dodać 'on'+NazwaEventu+'Capture'  np: onClickCapture
          // złapie EVENT nawet gdy jego wykonanie jest zatrzymane przez 'e.stopPropagation();'
          // np: do analizowania każdego kliknięcia, routingu,
          console.warn("");
        }}
      >
        {/* -- CAPTURE I BUBLING!!! --- */}
        {/* CAPTURE -> event wyszukuje od ROOT -> schodac niżej do elementu który go wywołał (event.target)     | onClickCapture - wszystkich rodziców*/}
        {/* EVENT dociera do elementu (event.target)                                                            | onClick - elementu*/}
        {/* BUBBLING [PROPAGATION] -> EVENT idzie w górę do Roota                                               | onClick - wszystkich rodziców */}
        {/* --------------------------- */}
        {/* jeżeli klikniemy w <span> lub w <button> to wywoła się 1 funkcja przekazana przez PROP 'onChildClick' ORAZ 2 onClick z DIVA :) */}
        {/* to jest tzw 'BUBBLES' - bompelkowania lub 'PROPAGATION' - propagacja , W GÓRE DRZEWA 
      (zaczyna się od elementu, który klikneliśmy)(a kończy na korzeniu ROOT)
      wywołując po drodze wszystkie zdarzenia tego tybu na wszystkich elmentach, do których jest przypisany EVENT HANDLER
      */}
        {/* UWAGA !!! w React wszystkie eventy PROPAGUJĄ !!! nawet 'onChange' i 'onSubmit' WYJĄTEK to 'onScroll', który działa TYLKO na dodanym JSX */}
        <span>CHILD CLICK</span>
      </button>
    </div>
  );
}

function InterakcjeEventyDomyslne() {
  const [name, setName] = useState("");

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    // Niektóre event przeglądarki np: 'submit' mają swoje natywne zachowania, które chcemy wyłączyc w reacie
    // robimy to poprzez wywołanie metody na przekazanych evencie
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleChange}></input>
      <button type="submit">Prześlij</button>
    </form>
  );
}

// #################################
// #### 2) STATE - stan komponentu jego PAMIĘĆ
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function InterakcjeState() {
  let zmienna = 1;
  zmienna++;
  //  to nie wywoła RE_RENDERINGU
  // zmienne LOKALNE (w obrębie komponentu) nie zachowują się pomiędzy RENDERAMI

  // stan -> to przychowywana wartość,
  // setStan -> funkcja ustawiająca przychowywaną wartośc,
  // 1 -> [INITAL STATE] to wartośc początkowo domyślna jaką będzie miał 'stan' przy 1 renderze
  // destrukturyzacja tablicy         const [element1, element2] = [1, () => {}]
  // wszystko od 'use' to HOOK (maja swoje jasne reguły) najważniejsza -> muszą być wywołane w głównym bloku {} funkcji komponentu
  const [stan, setStan] = useState(1); // tak jak tutaj ( a nigdy np: w zagnieżdżonym if(){}...) czyli w miejscu renderowania
  function handleClick() {
    setStan(2); // uwaga nie można wywołać settera STANU na poziomie TOP komponentu -> powoduje to błąd INFINITY LOOP
  }
  // to WYWOŁA RE_RENDERING
  // wartość zachowuje się pomiędzy RENDERAMI

  // konwencja nazw 'cos' 'setCos'
  // dowolna liczba stanów jest dozwolona
  // Sepracja na osobne stany jest najlepsza gdy są od siebie niezależne - gdy zależą od siebie warto rozważyć umieszczenie obiektu/tablicy w stanie
  const [inaczej, setInaczej] = useState(() => {
    //do pobierania z session storage itp...
    return 100;
  });
  function handleClick2() {
    setInaczej((prevValue) => {
      return prevValue + 1;
    });
  }

  // UWAGA!!! bardzo ważna jest kolejność HOOKÓW w komonencie, React w ten sposób identyfikuje którą wartość ma zwrócić dla którego stanu !!!
  // dlatego nie jest dopuszczone warunkowe tworzenie hooków w 'if' 'function' itp...
  // hooki komponentu są trzymane w TABLICY (ARRAY) - stąd tak ważna jest ich kolejność

  // UWAGA !!! Stan jest izolowany (LOKALNY) !! jeśli wywołam 2+ ten komponent to każdy ma swój osobny stan (NIE WSPÓŁDZIELĄ GO)

  return (
    <>
      <p
        onClick={() => {
          handleClick();
          handleClick2();
        }}
      >
        Zmienne = {zmienna} | stan {stan} | stan 2 = {inaczej}
      </p>
      <InterakcjeStateSnapshot />
    </>
  );
}

function InterakcjeStateSnapshot() {
  console.warn(`RENDER ${Math.random() * 100000}`);
  const [number, setNumber] = useState(0);
  // wywołanie settera stanu nie ustawia tak naprawdę wartości -> tylko powoduje wywołanie RERENDERU (zachowuje się jak SNAPSHOT - MIGAWKA)
  // którego wynik jest zależny od nowej wartości nadanej stanowi
  // RENDEROWANIE - to 1) wywołanie funkcji komponentu
  // 2) funkcji komponentu zwraca JSX (SNAPSHOT) w danym czasie
  // 3) react aktualizuje UI aby pasowało do tego SNAPSHOTA
  // po WYWOŁANIU funkcji STATE nie znika tylko żyje wewnątrz REACT przypisany do danej instancji komponentu
  // UWAGA !! zniakają za to i tworzone są na nowo wszystkie zmienne i funkcje (event handlers, stałe, zmienne itp...)
  // UWAGA funkcje mają zakres wartość STATE -> taki jaki był gdy były tworzone (Zapamiętują go [CLOUSERS w JS]) - nie aktualizuje się sam (dopiero gdy tworzona jest funkcja na nowo)
  return (
    <>
      <p>NUMBER = {number}</p>
      <button
        onClick={() => {
          // UWAGA!!! z uwagi na powyżej opisane życie stanu poza komponentem po kliknięciu wartość zmieni się z 0 -> 1
          // bo wszystkie wywołania setterów są w ramach 1 snashotu (gdzie number = 0)
          setNumber(number + 1); // ten się wywoła i number = 0, zwiększy to o 1 => 1
          setNumber(number + 1); // UWAGA dla tego number też jest 0 !!! w tym SNASHOT jest number = 0 !!!   wynik => 1
          setNumber(number + 1); // tutaj tak samo 0 + 1 => 1
          // W efekcie będzie 1 re-render ustawiający wartość na 1 (dlaczego 1? Opisane poniżej)
          // UWAGA to samo dla ASYNCHRONICZNOŚCI wartośc stanu jest brana ze SNASHOTA -> więc w setTimeout też by było 0 przekazane
        }}
      >
        +3 (zwróci +1)
      </button>
      <InterakcjeStateSeriesOfUpdates />
    </>
  );
}

// #################################
// #### 3) aktualizacja stanu poprzez funkcję (BATCHING + STATE UPDATER FUNCTIONS)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function InterakcjeStateSeriesOfUpdates() {
  // uzupełnienie do powyższej lekcji
  // PARTIA AKTUALIZACJA (Batch of updates)
  const [number, setNumber] = useState(0);
  return (
    <>
      <p>NUMBER = {number}</p>
      <button
        onClick={() => {
          // UWAGA !!! react CZEKA aż CAŁY kod z event-handlera się wykona zanim przeprowadzi UPDATE STANU
          // to czekanie na wykonanie Całego kodu z event-handlera => BATCHING (PARTIOWANIA)[przyśpiesza reacta]
          // każde event (nawet ten sam np: 'click') jest obsługiwany osobno
          setNumber((prevNumber) => prevNumber + 1); // prev = 0, wynik = 1     // dodano do kolejki wywołań funkcji przed rerenderem
          setNumber((prevNumber) => prevNumber + 1); // prev = 1, wynik = 2     // dodano do kolejki wywołań funkcji przed rerenderem
          setNumber((prevNumber) => prevNumber + 1); // prev = 2, wynik = 3     // dodano do kolejki wywołań funkcji przed rerenderem
          // DO SETTERÓW STANU można przekazać FUNKCJĘ (funkcja UPDATER) !!! [MUSI BYĆ PURE i ZWRACAĆ WARTOŚĆ]
          // UWAGA!!! KONWENCJA nazwa argumentu dla FUNKCJI UPDATER
          // 1) 1 litera nazwy stanu np: [stan = number (n => ...)],  [stan = age (a => ...)]
          // 2) powtórzenie nazwy stanu np: [stan = number (number => ...)],  [stan = age (age => ...)]
          // 3) prefeix 'prev' + nazwa stanu np: [stan = number (prevNumber => ...)],  [stan = age (prevAge => ...)]
          // -) czasem używam po prostu 'prev' (nazwa settera mówi mi czego dotyczy)
          // funkcja ta musi zwracać nową wartość stanu, BAZUJĄĆ na POPRZEDNIEJ WARTOŚCI w KOLEJCE !!!
          // operujemy na faktycznej wartości STANU, a nie wartości stanu uzyskanej dla komponentu w ramach SNAPSHOTA
        }}
      >
        +3 (zwróci +3)
      </button>
      <button
        onClick={() => {
          setNumber(number + 5); // dodane do kolejki | number = 0 => 0 + 5 = 5
          setNumber((prevNumber) => prevNumber + 1); // dodane do kolejki | prev = 5 => 5 + 1 = 6
          // wynik to 6
        }}
      >
        ZMIANA 1
      </button>
      <button
        onClick={() => {
          setNumber((prevNumber) => prevNumber + 1); // dodane do kolejki | prev = 0 => 0 + 1 = 1
          setNumber(number + 5); // dodane do kolejki | number = 0 => 0 + 5 = 5
          // wynik to 5 (bo 'number + 5' nie operuje na wartości stanu, a wartości z snashota + ZASTEPUJE wartość stanu,
          // a nie wylicza ją na bazie poprzedniej wartości)
        }}
      >
        ZMIANA 2
      </button>
    </>
  );
}

// #################################
// #### 4) Aktualizacja OBIEKTÓW STANU (STATE OBJECT UPDATE)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function InterakcjeStateObjects() {
  // stan może przechowywać dowolną wartość JS'a => zwłaszcza OBIEKT
  // UWAGA !! nie można zmieniać obiektu bezpośrednio, trzeba stworzyć nowy!!! (lub kopię istniejącego )

  // zmienne IMMUTABLE  => 'string', 'number', 'booleans'
  // zdefiniowane w systemie w pamięci przez JS'a (tylko 'read-only') => więc ich zmiana np: z 1 na 5 zmienia referencję do komórki w pamięci

  // MUTACJA => mamy obiekt const [stan, setStan] = useState({x: 0, y: true})
  // obiekt dostaje swoją referencję w pamięci
  // możemy zrobić MUTACJĘ!!! (zmiana wartosci bez zmiany referencji)   np:  stan.x = 5 | stan.y = false
  // UWAGA przy MUTACJI nie zmieni sie referencja do obiektu co przełoży się na brak 're-renderingu'
  // UWAGA!!! to dotyczy tylko OBIEKTÓW które są STANEM (STATE OBJECT)

  const [obiekt, setObiekt] = useState({
    name: "AGA",
    age: 30,
  });
  const [nestObiekt, setNestObiekt] = useState({
    id: 1,
    items: [
      {
        name: "kiwi",
      },
    ],
  });

  function handleClick() {
    // aktualizując stan z obiektem musimy go traktować jako 'read-only'
    // czyli zwrócić
    // 1) nowy obiekt
    // 2) kopię istniejącego

    // ver_1
    setObiekt({
      // PŁYTKA KOPIA (SHALLOW-COPY) - zmienia tylko referencję 'obiekt', ALE nie zmieni referencję obiektów / tablic wewnątrz niego
      ...obiekt,
      name: "Nowa_wartosc",
    });

    // ver_2
    setObiekt((prevObiekt) => {
      return {
        ...prevObiekt,
        age: 29,
      };
    });

    // ver_3
    setObiekt(
      // DEEP COPY - zmienia referencję obiektów i WSZYSTKICH obiektów / tablick itp.. w nim zagnieżdżonych (wszystko tworzone na nowa z nową referencję)
      JSON.parse(
        JSON.stringify({
          ...obiekt,
          name: "100% zmiana referencji wraz z zagnieżdżonymi referencjami",
        })
      )
    );

    // ver_4  (jak najbardziej poprawna)
    const newObject = {
      name: "MR",
      age: 29,
    };
    newObject.name = "MARO"; // w nowo utworzonym obiekcie mozna zrobić mutację (zanim trafi do settera stanu) [LOCAL MUTATION są OK :)]
    setObiekt(newObject);
  }

  function handleClickNestObject() {
    // każdy zagnieżdżony obiekt należy też destrukturyzować ... (upierdliwe trochę)
    // UWAGA !! tak na prawdę to nie ma zagnieżdżeń,
    // po prostu pola wskazuja referencję na obiekt
    /* WIĘC TAK NA PRAWDĘ WEWNĄTRZ DZIEJE SIĘ COŚ TAKIEGO:
    let obj = {
      name: 'ABC'
      obj2: obj2      // referencja do obiektu
    }
    let obj2 = {
      name: '123'
    }
    UWAGA !!!!
        aby nie działać w ten sposób REACT zaleca stosowanie BIBLIOTEKI 'IMMER'  => npm i user-immer (i zamiast 'useState' => 'useImmer')
        pozwala na zmiany typu: obj.pole = "nowa_wartośc" (które wewnątrz wykonują zmiany NIE MUTUJĄC OBIEKTU)
    */
    setNestObiekt((prevNestObiekt) => {
      return {
        ...prevNestObiekt,
        items: [
          // UWAGA 2-ga destruktyryzacja (aby zmienić referencję dla zagnieżdżonego obiektu !!!!!)
          ...prevNestObiekt.items,
          {
            //dodano nowy obiekt do tablicy
            name: "sage",
          },
        ],
      };
    });
  }

  return (
    <>
      <p onClick={handleClick}>
        NAME = {obiekt.name} | WIEK = {obiekt.age}
      </p>
      <p onClick={handleClickNestObject}>Nest id = {nestObiekt.id}</p>
    </>
  );
}

// #################################
// #### 5) ARRAYS STATE (tablice jako stan)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function InterakcjeStateArrays() {
  // tablice w js są mutable, ale tak na prawdę są obiektami!!! i musimy je traktować jak obiekty (IMMUTABLE)
  /*
	                      avoid (mutates the array)	                prefer (returns a new array)[Z TYCH KORZYSTAĆ]
  adding	                push, unshift	                              concat, [...arr] spread syntax 
  removing	              pop, shift, splice	                        filter, slice 
  replacing	              splice, arr[i] = ... assignment	            map
  sorting	                reverse, sort	                              copy the array first

  UWAGA!!! gdy używamy biblioteki Immer - można korzystać wtedy z 2 kolumn  [zamiast useState -> useImmer]
        "immer": "1.7.3",             npm i immer
        "use-immer": "0.5.1"          npm i use-immer
  UWAGA!!! używamy 'SLICE' -> nowa tablica, a NIE  'splice' -> który mutuje obecną tablicę 
                    [odkadWyciac, dokadWyciac]               [index, liczbaElDoUsunieciaOdIndex, ...elementy]
  */

  const [tablica, setTablica] = useState([1, 2, 3, 4]);

  function handleClick() {
    //#####################
    // DODANIE ELEMENETU na koniec
    setTablica([...tablica, 99]);
    setTablica((prevTablica) => [...prevTablica, 99]);
    //#####################
    // DODANIE ELEMENETU na początek
    setTablica([100, ...tablica]);
    setTablica((prevTablica) => [100, ...prevTablica]);

    //#####################
    // USUWANIE ELEMENTU
    setTablica((prevTablica) => {
      return prevTablica.filter((el) => {
        if (el > 2) {
          return el;
        }
        return null;
      });
    });

    //#####################
    // MODYFIKACJA ELEMENTU (LUB jego ZMIANA)
    setTablica((prevTablica) => {
      return prevTablica.map((el) => {
        if (el === 2) {
          // UWAGA GDY MAMY TABLICĘ OBIEKTÓW to musimy obiekty desktrukturyzować
          // return {...el, inneZmiany: true}
          return el - 1;
        }
        return el;
      });
    });

    //#####################
    // WSTAWIANIE W DOWOLNE MIEJSCE
    const indexToInsert = 2;
    setTablica((prevTablica) => {
      const before = prevTablica.slice(0, indexToInsert);
      const after = prevTablica.slice(indexToInsert);
      return [...before, 998, ...after];
    });

    //#####################
    // SORTOWANIE i ODWRACANIE
    setTablica((prevTablica) => {
      const copy = [...prevTablica];
      copy.sort(); // .reverse();
      return copy;
    });
  }

  return (
    <>
      {tablica.map((el) => {
        return (
          <span key={el} onClick={handleClick}>
            {el}
          </span>
        );
      })}
    </>
  );
}

// #################################
// #### 6)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 7)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
