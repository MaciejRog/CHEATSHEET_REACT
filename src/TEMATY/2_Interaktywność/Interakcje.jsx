import { useState } from "react";

function Interakcje() {
  return (
    <div>
      <InterakcjeEventy />
      <InterakcjeState />
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
  // wywołanie settera stanu nie ustawia tak naprawdę wartości -> tylko powoduje wywołanie RERENDERU (zachowuje się jak SNAPSHOT - MIGAWKA)
  // USTAWIENIE STANU POWODUJE RERENDER

  return <></>;
}

// #################################
// #### 3)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 4)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 5)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 6)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 7)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
