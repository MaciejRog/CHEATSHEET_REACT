import { memo } from "react";
import { useCallback } from "react";
import { useState } from "react";

function ReactHooks() {
  return (
    <div>
      <ReactHooksCallback />
      {/* 
      ##########################
      ## FUNKJCONALNOŚCI EKSEPRYMENTALNE
      VVVVVVVVVVVVVVVVVVVVVVVVVV
      */}
      <ReactHooksActionState />
    </div>
  );
}

export default ReactHooks;

//###################################################################################################
//=== FUNKJCONALNOŚCI PRODUKCYJNE
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### useCallback -> CACHOWANIE FUNKCJI (stabilna referencja, zależna od tablicy zależności) [OPTYMALIZACJA WYDAJNOŚCI]
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksCallback() {
  const [stable, setStable] = useState(true);
  const [arg1, setArg1] = useState(1);
  const [arg2, setArg2] = useState(2);
  const sumArg = () => {
    // jeśli tylko ustawiamy jakiś state w funkcji to NIGDY nie bierzmy jej jawnie 'args1' ZAWSZE jej settter
    // dzięki temu nie musimy jej dodawać do tablicy zależności
    setArg1((prev) => prev + 1);
    setArg2((prev) => prev + 1);
  };

  // sumArg -> to 'callback' funckja która dostanie stabilną referencję (dowolna funkcja)
  // [] -> ARRAY DEPENDENCIE (tablica zależności) Reaktywne wartości, których zmiana zmieni REFERENCJE FUNKCJI
  //        UWAGA!!! bez tego przy każdym renderze będzie nowa referencja WIĘC PAMIĘTAĆ o TABLICY ZALEŻNOŚCI
  // callbackSumArg -> wynik 'useCallback' STABILNA referencja funkcji zależnie od tablicy zależności
  //                  UWAGA jest to STABILNA FUNKCJA !!! (a nie tylko jej wynik)
  const callbackSumArg = useCallback(sumArg, []);

  return (
    <>
      <p>
        ARG1 = {arg1} | ARG2 = {arg2} |{" "}
        <button onClick={() => setStable((prev) => !prev)}>
          CHANGE STABLE
        </button>
      </p>
      <ReactHooksCallbackChild
        fun={stable ? callbackSumArg : sumArg}
        isCallback={stable ? true : false}
      />
    </>
  );
  /*
  SUPER jest do poprawy OPTYMALIZACJI, ale nie zawsze jest potrzbne. PRZESTRZEGAJMY ZASAD:
    1) prop 'children' jest LEPSZE od opakowania komponentów wewnątrz (te z children się nie RERENDERUJĄ gdy stan komponentu się zmieni)
    2) NIE WYNOŚMY stanu dalej niż do najbliższego wspólnego komponentu
    3) LOGIKA RENDEROWANIE ma byc PURE
    4) UNIKAĆ zbędnych EFFECTÓW 
    5) UNIKAĆ ZBĘDNYCH ZALEŻNOŚCI w tablicach zależności
  */
  /*

 */
}

// UWAGA !!! ABY DZIAŁAŁO nie renderowania DZIECI musimy komponent opakować w HOC 'memo'
// 'memo' zapewnia, że jeśli KOMPONENT nie otrzyma nowych wartości / referencji PROPS -> to się nie RE_RENDERUJE
// działa do wartości prostych (string, number), funkcji z useCallback i Obiektów z useMemo
const ReactHooksCallbackChild = memo(function ReactHooksCallbackChildInner({
  fun,
  isCallback,
}) {
  // RÓŻNICA WIDOCZNA w 'react developer tools' -> F12 -> 'profiler' -> SETTINGS -> 'profiler' -> zaznaczenie 'why component render'
  // F12 -> 'profiler' -> niebieskie kóło 'start profiling' -> 'ranked = pokazuje tylko renderowane komponenty'
  return (
    <button onClick={fun}>
      useCALLBACK preview {isCallback ? "Callback" : "NotCallback"}
    </button>
  );
});

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

//###################################################################################################
//=== FUNKJCONALNOŚCI EKSEPRYMENTALNE
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### useActionState [eksperymentalny] OBSŁUGA AKCJI w FORMULARZACH
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksActionState() {
  /*
  HOOK używany do Utworzenia Stanu, którego setterem jest akcja formularza 'form action' -> aktualizuje 'state'
  UWAGA !!! może być w 'React Server Component' SERVEROWYCH KOMPONENTENACH

  'React Server Component' ->  pozwala na uaktywnienie formularza zanim JS sie wykona po stronie klienta
  w Client Componentach -> odpowiednik LOKALNEGO STATE komponentu (jak useState)
  */

  /*
  const initState = 1;
  function callback = (prevState, formData) => {
    //...
    return prevState + 1;
  }
  // state -> stan danych w formularzu
  // formAction -> AKCJA z formularz, zamiast 'submit'
  //                dodanie do :
  //                      1) <button formAction={formAction}>
  //                      2) <form action={formAction}>
  // callback -> FUNKCJA do zarządzania stanem (przyjmuje poprzedni stan) oraz wartości z formularza
  //             WYWOŁYWANA gdy 'form' jest SUBMITTED lub klikniemy 'button' z atrybutem 'formAction'
  // initState -> Bazowy stan formularza
  // permalinks -> OPCJONALNY atrybut | URL jako 'string'
  //                unikalny adres URL => dla stron z dynamicznym kontentem | gdy podany to form po submit przeniesie na ten link
  //                MUSIMY zapewnić, że ten sam formularz (z takim samym 'callback' i 'permalinks') jest renderowany na podanym URL
  const [state, formAction] = useActionState(callback, initState, permalinks?)

  return <form>
    <button formAction={formAction}>Callback</button>
  </form>
  */
  return <></>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
