import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

function SideEffect() {
  return (
    <div>
      <SideEffectRefs />
    </div>
  );
}

export default SideEffect;

// #################################
// #### 1) REFS - śmiatnik na wszystko (bardzo użyteczny)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const refArrayLi = [1, 2, 3];

function SideEffectRefs() {
  /*
                                                  REF         vs      STATE
  przechowuje między re-renderami                 tak                 tak
  zmiana wartości powoduje re-render              NIE                 tak
  Wartość używana do RENDEROWANIA                 NIE                 tak
  MUTTABLE                                        tak                 NIE


  REF -> pozwala zapamiętać jakąś wartość pomiędzy rerenderami, (ALE jej zmiana NIE WYWOŁUJE RERENDERU)
  (jest to trochę taki STATE, ale bez używanego settera)

  REF TO NAJLEPSZE MIEJSCE BY PRZECHOWAĆ:
    -- timeout / inteval
    -- referencje do DOM ( w celu - focus, scrolowanie, wymiary, położenie itp...)[wartości dostępno dopiero od fazy COMMIT (po RENDER)]
    -- wartość nie wymagane podczas RENDEROWANIA
        
  Struktura, każdy ref jest OBIEKTEM, który wygląda tak:
    {
      current: any    // dowolna wartość (string. object, function, ...)
    }
  */

  // Tworzenie referencji poprzez HOOK 'useRef' i wartość inicjalna tutaj null
  const timeRef = useRef(null);
  const domRef = useRef(null); // UWAGA!!! Bardzo uważać na DOM ->
  //                                        najelepiej NIGDY NIE 'USUWAĆ', "PRZEMIESZCZAC", 'DODAWAC" elementów, którymi zarządza JSX
  //                                        jeśli JSX zwraca np: zawsze pusty <div></div> to w nim coś można podziałać, ale po za NIE
  const domListRef = useRef(null); // Ref do obsłużenie DYNAMICZNEJ listy referencji do DOM
  const componentRef = useRef(null);
  const ograniczeniaRef = useRef(null);

  // UWAGA TO BĘDZIE opisane później (póki co wiecmy, że pozwala na zarządzanie cyklem życia komponentu i SIDE-EFFECTAMI)
  useEffect(() => {
    return () => {
      // UWAGA!!! przy pracy z 'timeout' i 'interval' zawsze zwracać ich czyszczenie (na chwilę przed zniszczeniem komponentu)
      clearTimeout(timeRef.current);
    };
  }, []);

  // funkcja pomocnicza do obsługi DYNAMICZNEJ listy referencji do DOM
  function getDomList() {
    if (!domListRef.current) {
      // Zamiast przechowywać referencję do DOM będziemy mieć mapę, która będzie posiadała budowę 'klucz' => referencje do DOm
      domListRef.current = new Map();
    }
    return domListRef.current;
  }

  function handleClickBtn() {
    // dostęp do danych przechowywanych wewnątrz REF jest poprzez 'ref.current'
    // MOŻNA ustawić to na DOWOLNĄ WARTOŚĆ jaką chcemy (możemy ją nadpisywać JEST MUTABLE)
    // UWAGA - nie ustawiać i nie czytać wartości 'ref.current' w głównym nurcie renderowania (traktować jak side-effecty)
    timeRef.current = setTimeout(() => {
      console.warn("TIMEOUT POLECIAŁ");
      clearTimeout(timeRef.current);
    }, 1000);
  }

  function handleClickSpan() {
    // jeśli nie ma takiego obiektu w DOM (np: zostanie usunięty) to będzie 'null'
    if (domRef.current) {
      // w przypadku REF do DOM, mamy obiekt, którym możemy sterować tak jak w przypadku 'document.querySelector'
      domRef.current.innerText = "Nowy Text";
    }
  }

  return (
    <>
      <button onClick={handleClickBtn}>Ustaw Timeout</button>
      {/* Aby przekazać REF do DOM -> musimy nadać ATRYBUT 'ref' dla elemenetu HTML */}
      <span ref={domRef} onClick={handleClickSpan}>
        ABC
      </span>
      <ul
        onClick={() => {
          console.log("MAP REF LIST REF = ", domListRef.current);
        }}
      >
        {refArrayLi.map((el) => {
          return (
            //           uwaga do ref możemy też przekazać funkcję, która przyjmuje jako argument (node) - referencje do DOM obiektu
            //           takie funkcje nazywają się 'callback'
            <li
              key={el}
              ref={(node) => {
                const map = getDomList();
                if (node) {
                  // dla danego 'key' posiadamy 'referencję' :)
                  map.set(el, node);
                } else {
                  map.delete(el);
                }
              }}
            >
              {el}
            </li>
          );
        })}
      </ul>
      {/* UWAGA !!! takiej referencji nie da się przekazać dla KOMPONENTU, potrzebny jest specjalny mechanizm 'FORWARD_REF' */}
      {/* TEN NIE DZIAŁA */}
      {/* <SideEffectRefsChild ref={componentRef} /> */}
      {/* TEN DZIAŁA */}
      <SideEffectRefsChildForward ref={componentRef} />
      <SideEffectRefsChildForwardOgraniczenia ref={ograniczeniaRef} />
    </>
  );
}

//                              ref otrzymujemy jako 2 argument za 'props' WYMAGA 'forwardRef' aby działało
function SideEffectRefsChild(props, ref) {
  console.log("Puste props = ", props);

  function handleClick() {
    if (ref?.current) {
      ref.current.innerText = "Działa Ref w Komponencie";
    }
  }

  return (
    // to jest pełny dostęp ze strony REF rodzica do tego komponentu
    <div ref={ref} onClick={handleClick}>
      TEST
    </div>
  );
}

// To jest mechanizm przekazania ref poprzez KOMPONENT - Wykorzystujemy tzw: HigherOrder
// czyli opakowujemy nasz komponent w (funkcję / inny komponent) -> który zarządzi przekazanymi w nim danymi
// ABY DZIAŁAŁO przekazanie 'REF' poprzez komponent do, któregoś z jego elementów muimy go opakować w funkcję 'forwardRef'
// 'forwardRef' zwraca NOWY KOMPONENT
const SideEffectRefsChildForward = forwardRef(SideEffectRefsChild);

const SideEffectRefsChildForwardOgraniczenia = forwardRef(
  function SideEffectRefsChildOgraniczenia(props, ref) {
    const domRef = useRef(null);
    // możemy ograniczyć dostęp rodzica do DOM komponentu poprzez HOOK 'useImperativeHandle'
    // pozwa na określić co chcemy aby zostało przekazane do 'ref' wewnątrz rodzica (ogarniczenie na properties, funkcje itp...)
    // tutaj do 'ref' przekazujemy wyłącznie funkcję DOM 'focus'i nic więcej, 'ref' nawet CSS'ów nie zobaczy ;)
    // więc tak na prawdę OKREŚLAMY jaką wartośc ma mieć dany 'ref'
    // tutaj akturat będzie to obiekt z property 'focus', które jest funkcją
    useImperativeHandle(ref, () => {
      return {
        focus() {
          domRef.current.focus();
        },
      };
    });
    // a faktyczną referencję na obiekt trzyma wewnętrzna referencja 'domRef', do której rodzic nie ma dostępu
    return <div ref={domRef}></div>;
  }
);

/*

UWAGA !!! Aby wykonać fajnie nasze operacje na DOM z użyciem REF, ale w odpowiedzi na rerender trzeba coś zrobić:
  1) 'flushSync' => wymuszenie aktualizacji DOM przy rerenderze w sposób synchroniczny!!!!

    flushSync(() => {     // opakowujemy settery STANU w to -> przez co stają się synchroniczne [wykonają się na tychmiast]
      setStan(...)
    })
    //...np: operacje na DOM poprzed REF  -- z już nowymi wartościami 

  2) zareagowanie dopiero poprzez useEffect - który w tablicy zależności ma stan na zmianę, którego chcemy zareagować 
          opisane później
*/

// #################################
// #### 2)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

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

// #################################
// #### 8)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
