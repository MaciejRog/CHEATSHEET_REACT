import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";

function ReactHooks() {
  return (
    <div>
      {/* 
      ##########################
      ## FUNKJCONALNOŚCI PRODUKCYJNE
      VVVVVVVVVVVVVVVVVVVVVVVVVV
      */}
      {/* ##### CODZIENNE UŻYCIE */}
      <ReactHooksState />
      <ReactHooksCallback />
      <ReactHooksMemo />
      <ReactHooksContext />
      <ReactHooksDefferedValue />
      <ReactHooksReducer />
      <ReactHooksRef />
      <ReactHooksTransition />

      {/* ##### CODZIENNE UŻYCIE + TYLKO CLIENT SIDE */}
      <ReactHooksEffect />
      <ReactHooksLayoutEffect />

      {/* ##### MNIEJ PRZYDATNE */}
      <ReactHooksDebugValue />
      <ReactHooksId />
      <ReactHooksImperativeHandle />
      <ReactHooksSyncExternalStore />

      {/* ##### ZASTOSOWANIE w 0.001 % PRZYPADKOW + TYLKO CLIENT SIDE */}
      <ReactHooksInsertionEffect />

      {/* 
      ##########################
      ## FUNKJCONALNOŚCI EKSEPRYMENTALNE
      VVVVVVVVVVVVVVVVVVVVVVVVVV
      */}
      {/* ##### SERVER SIDE && CLIENT SIDE */}
      <ReactHooksActionState />

      <ReactHooksOptimistic />
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
// #### useContext -> Pozwala czytac wartości z contextu (dokładniej opisany w '1_TEMATY' '3_Zarządzanie_Stanem' dział 6)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
  pozwala na dostęp do kontekstu z dowolnego miejsca (brak konieczności PROP DRILLINGU)
  CZĘSTO ŁĄCZONY z 'useReducer'

  GDY ZMIENIMY jego wartośc to REACT RERENDERUJE te komponenty, który używają 'useContext' z KONTEKSTEM, któremu zminilismy wartość
  UWAGA!!! 'memo' nie zapobiegnie odtrzymaniu nowych wartości


  ZASTOSOWANIE:
    -) przekazywanie danych do zagnieżdżonych komponentów (zawsze z najblizszego PROVIDERA (jeśli nie ma to domyślna wartość))
*/

// tworzenie KONTEKSTU
const MyContext = createContext("light");
const ObjectContext = createContext({ name: "" });

function ReactHooksContext() {
  const [object, setObject] = useState({ name: "Aga" });
  const context = useContext(MyContext); // light -> IGNORUJE <MyContext.Provider value='dark'> w tym komponencie

  const stableObject = useMemo(() => {
    return {
      name: object.name,
      setObject,
    };
  }, [object.name]);

  return (
    <>
      <p>CONTEXT = {context}</p>
      {/* MyContext.Provider -> od tego miejsca komponenty poniżej, odczytają wartośc kontextu jako 'dark' */}
      <MyContext.Provider value="dark">
        {/* Do wartość CONTEXTU zawsze warto przekazać STABILNA REFERENCJE do obiektu poprzez 'useMemo' */}
        <ObjectContext.Provider value={stableObject}>
          <ReactHooksContextChild />
        </ObjectContext.Provider>
      </MyContext.Provider>
    </>
  );
}

function ReactHooksContextChild() {
  const context = useContext(MyContext); // dark
  const objectContext = useContext(ObjectContext); // { name: "Aga" }
  return (
    <p>
      CONTEXT CHILD = {context} {objectContext.name}
    </p>
  );
}

// #################################
// #### useDebugValue | Własne Labelki dla custom hooków
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksDebugValue() {
  const custom = useCustomHook();
  return (
    <>
      <p>{custom}</p>
    </>
  );
}

function useCustomHook() {
  const [state] = useState("ABC");
  // F12 -> 'react-dev-tool' -> po najchaniu na komponent 'ReactHooksDebugValue' -> będzie opis 'default-custom'
  // Więc dodaje labelkę 'opis', który pomaga w DEBUGOWANIU
  // moze posiadać dowolny typ nawt Object
  // PRZYJMUJE 2 atrybuty:
  // 1) [WYMAGANY] Label value
  // 2) [OPCJONALNY] format funcion [steruje jak ma się wyświetlać wartośc z argumentu 1]
  //
  // UWAGA nie dodawać do kazdego Custom Hook (a do takich co mają skomplikowaną strukturę)
  useDebugValue(
    state === "ABC" ? "default-custom" : "not-default-custom",
    (label) => {
      return label.toUpperCase();
    }
  );
  return state;
}

// #################################
// #### useDefferedValue | pozwala OPOŹNIĆ aktualizację UI
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksDefferedValue() {
  /*
  POZWALA OPOŹNIĆ AKTUALIZACJĘ UI (defer -> przełozyć na później)
  Przyjmuje 2 argumenty:
  1) value -> wartość, którą chcemy opóźnić 
  2) [EKSPERYMENTALNE] -> wartość inicjalna [wykorzystywana przy INIT RENDER]


  ZASTRZEŻENIA (caveat):
  1) gdy jest wewnątrz 'TRANISTION' zawsze zwraca nową wartość 'nie przekłada renderu bo w tranzycji juz jest przelozony'
  2) do 'useDeferredValue' powinniśmy przekazywać PRYMITYWNE wartość (string, number)
      lub OBIEKTY utworzone poza RENDERINGIEM (jeśli przekazemy obiekt utworzony podczas rendereowania to wywołamy ZBĘDNE RERENDERY)
  3) (kiedy otrzymuje nową wartość 'Object.is' [roznica między 'defferedStan', a 'stan']) -> kolejkuje w tle wykonanie RERENDERU
      RERENDER w TLE jest PRZERYWALNY -> tylko ostatni RERENDER się wykona (np: przy wpisywaniu na klawiaturze)
  4) Jest zintegrowany z <Suspense> (user widzi starą wartość podczas updatu UI)
  5) nie zapobiega DODATKOWYM rządaniom HTTP
  6) kiedy skończy się ORYGINALNY RERENDER -> react zaczyna RERENDER w TLE (background rerender) -> 
      jakie kolwiek zmiany przerwą ten w tle i uruchomią go na nowo
  7) NIE wywołuje EFFEKTOW (dopóki zmiany nie pojawią sie na EKRANIE)
  */

  const [query, setQuery] = useState(1);
  // zmiany uzaleznionie od 'defferedQuery' mają mniejszy priorytet i będą wykonane podczas RERENDERU w TLE
  // Komponent RENDERUJE się 2 razy
  // 1) zmiana 'query' np: na 2 GDZIE defferedQuery = 1 (POPRZEDNIA WARTOŚĆ 'query')
  // 2) W TLE zmian 'defferedQuery' = 2
  // w INIT RENDER 'defferedQuery' === 'query'
  const defferedQuery = useDeferredValue(query);

  console.log("");
  console.log("ReactHooksDefferedValue QUERY = ", query);
  console.log("ReactHooksDefferedValue defferedQuery = ", defferedQuery);
  // najpierw 2 i 1
  // potem 2 i 2 itp...

  return (
    <>
      <button
        onClick={() => {
          setQuery((prev) => {
            return prev + 1;
          });
        }}
      >
        ZMIEŃ QUERRY
      </button>
      <p>QUERY = {query}</p>
      <p>{query !== defferedQuery ? "Ładuje... " : null}</p>
      {/* W tym przypadku słuzy jako OPTYMALIZACJA dla ładowania bardzo duzego komponentu */}
      <ReactHooksDefferedValueChild isDefered={true} query={defferedQuery} />
    </>
  );
}

// dzięki opakowaniu w memo komponent ten sie nie rerenderuje na zmianę w query
// dopiero gdy zmieni się z czasem w TLE deferedQuery
const ReactHooksDefferedValueChild = memo(
  function ReactHooksDefferedValueChild({ isDefered, query }) {
    const limit = 1000000000;
    let i = 1;
    while (i < limit) {
      i++;
    }

    return (
      <p>
        {isDefered ? "DEFFERED_QUERY" : "QUERRY"} = {query}
      </p>
    );
  }
);

// #################################
// #### useEffect | DOKŁADNIE OPISANY w '1_TEMATY' '4_Side_Effects'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksEffect() {
  /*  
  EFFEKTY DZIAŁAJA TYLKO w 'client side'
  */
  useEffect(() => {
    //funckja Effektu uruchamiana na zmianę tablicy zalezności i Init render
    return () => {
      //cleanUP
    };
  }, []);
  // tablica zalezności wszystkie REaKTYWNE wartość, uzyte w Effekcie + to co ma go wywołać
  return <p></p>;
}

// #################################
// #### useId | hook do genereowania unikalnego ID (do przkazywania do ATRYBUTOW Accesibility)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksId() {
  /*
  zwraca unikalne id (string)
  UWAGA !!! Nigdy nie uzywać do oznaczania 'key' 

  skoro jest to string to mozna go uzywac jako np: 'prefixu do aria-describedby'
  np: `${id}-first-name`

  działa z SERVER_SIDE
  UWAGA !!! w serwer-side wymaga identycznej struktury DOM jaka bedzie w client-side

  UWAGA jeśli w 1 aplikacji mamy 2-razy 'ROOT" to mozemy dla kazdego zdefiniowac inny poczatek z useId
      const root1 = createRoot(document.getElementById('root1'), {
        identifierPrefix: 'my-first-app-'
      });
      root1.render(<App />);

      const root2 = createRoot(document.getElementById('root2'), {
        identifierPrefix: 'my-second-app-'
      });
      root2.render(<App />);

  */
  const id = useId();
  const id2 = useId();
  return (
    <>
      <input type="password" aria-describedby={id} />
      <p id={id}>useId Accesibility {id}</p>
      <p>useId Accesibility {id2}</p>
    </>
  );
}

// #################################
// #### useImperativeHandle | POZWALA ustawić co ma być w 'ref' z 'useRef'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksImperativeHandle() {
  const ref = useRef();
  return (
    <>
      <ReactHooksImperativeHandleChild ref={ref} />
    </>
  );
}

const ReactHooksImperativeHandleChild = forwardRef(
  function ReactHooksImperativeHandleChildInner(props, ref) {
    /*
    POZWALA dostosować jakie ref (ogólnie jaki obiekt) zostanie przekazany do rodzica przez 'forwardRef'
    useImperativeHandle(ref, createHandle, dependencies?) 
        ref -> ref dostarczone z 'forwardRef'
        createHandle -> funkcja, która tworzy obiekt, który zostanie przekazany do Rodzina, który dostarczył 'ref' z 'forwardRef'
        dependencies -> [OPCJONALNE] TABLICA ZALEZNOŚCI (reaktywne wartości, których zmiany maja wywołać HOOK ponownie)
  */
    const inputRef = useRef();
    useImperativeHandle(
      ref,
      () => {
        // OKRESLAMY jakie 'pola' i 'funkcje' mają być wystawione dla RODZICA (reszta nie będzie)
        return {
          focus() {
            inputRef.current.focus();
          },
          scrollIntoView() {
            inputRef.current.scrollIntoView();
          },
        };
      },
      []
    );

    return (
      <p {...props} ref={inputRef}>
        useImperativeHandle
      </p>
    );
  }
);

// #################################
// #### useInsertionEffect | TYLKO DLA BIBLIOTEK CSS w JS (poza tym nie ma zastosowania)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksInsertionEffect() {
  /*
  pozwala WSTRZYKIWAĆ style ZANIM effekty ustalające LAYOUT się odpalą
  DOKłaDNIEJ pozwala DODAWAĆ 'DOM' zanim odpalą się EFFEKTY 'layout'

  useInsertionEffect(setup, dependencies?)
  // setup -> funkcja z logiką effektu
  // dependencies -> TABLICA ZALEZNOŚCI (reaktywne wartości, których zmiany maja wywołać HOOK ponownie)

  UWAGI!!!
  - TYLKO CLIENT-SIDE
  - Nie mozna aktualizować 'state' z wewnątrz tego hooka
  - w chwili wykonywnia hook 'ref' NIE SA jeszcze PODŁACZONE 
  - przeplata funkcję 'CLEANUP' i 'setup' uruchamia je jednocześnie (inne efekty -> najpierw czyszczenie potem setup effektu)
  */

  useInsertionEffect(() => {
    // BRAK INFO...

    // zwraca CLEANUP function (uruchamia się przy kazdym rerenderingu)
    return () => {};
  }, []);

  return <></>;
}

// #################################
// #### useLayoutEffect | WERJSA 'useEffect', KTORA URUCHAMIA SIĘ ZANIM EKREN SIE NARYSUJE PONOWNIE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksLayoutEffect() {
  /*
  WERJSA 'useEffect', KTORA URUCHAMIA SIĘ ZANIM EKREN SIE NARYSUJE PONOWNIE (BEFORE SCREEN REPAINTS)
  STOSOWANY DO POMIERZENIA WYMIAROW elementów !!!! np: dzięki 'getBoundingClientRect'
  LAYOUT -> połozenie i  wymiary elementów

  useLayoutEffect(setup, dependencies?)
    // setup -> funkcja z logiką effektu
    // dependencies -> TABLICA ZALEZNOŚCI (reaktywne wartości, których zmiany maja wywołać HOOK ponownie)
  
  UWAGA!!! useLayoutEffect -> MOZE POGORSZYĆ PERFORMANCE APLIKACJI

  ZASTRZEZENIA:
    - w <strictMode> uruchomi się 2 razy na MOUNT
    - tylko CLIENT SIDE (EFFEKTY zawsze sa tylko CLIENT_SIDE)

  ZASTOSOWANIE:
    - określenie wymiarów oraz połozenia elementów HTML (np: wysokość odległośc od prawej strony ekranu itp...)
          (np: Tooltip -> jego wielkość i czy ma być na górze / z lewej / z prawej itp...) i dzięki 'useLayoutEffect'
          USER nie zobaczy tego jak Tooltip się zmienia i jak się przemieszcza
  
  useLayoutEffect VS useEffect
    - 'useLayoutEffect' BLOKUJE REPAINT EKREANU -> USER widzi efekt koncowy / 'useEffect' NIE BLOKUJE
        wpływa to na wydajność eplikacji (KIEDY MOZNA NALEZY TEGO UNIKAĆ)
  */

  const ref = useRef();
  const [height, setHeight] = useState("1");

  useLayoutEffect(() => {
    // UWAGA!!! KOD działający w 'setup' BLOKUJE REPAINTING EKRANU (dlatego moze wpływać na wydajność aplikacji)
    //          tyczy się to równiez ustawianiu STANU
    setHeight(ref.current.getBoundingClientRect().height);

    // CLEAN_UP
    return () => {
      setHeight("");
    };
  }, []);

  return (
    <p ref={ref} style={{ height: "111px" }}>
      useLayoutEffect WYSOKOŚĆ = {height}
    </p>
  );
}

// #################################
// #### useMemo | CACHOWANIE wartości na podstawie TABLICY ZALEZNOŚCI (stablina referencja)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksMemo() {
  /*
  const cachedValue = useMemo(calculateValue, dependencies)
  // calculateValue -> funkcja, która zwraca wartość, która zostanie ZCACHOWANA (stabilna referencja przy RERENDERACH)
  // dependencies -> TABLICA ZALEZNOŚCI (reaktywne wartości, których zmiany maja wywołać HOOK ponownie)

  ZASTOSOWANIE !!!:
  - POMIJANIE DROGICH OBLICZEŃ (czasochłonne Expansive calculations) 
          console.time('filter array');
          console.timeEnd('filter array');    // to co jest powyzej 1ms MOZNA nazwać jako DROGA KALKULACJA
  - POMIJANIE ZBĘDNYCH RERENDEROWAŃ -> gdy przekazujemy OBIEKT/TABLICE/FUNKCJE jako 'props'
  - MEMOIZATION (zapamietywania wartość/referencji zaleznie od innej wartości) DLA INNCYH HOOKOW [zwłaszcza OBIEKTOW i FUNKCJI]
      pozwala na nie wywołanie hook, wtedy kiedy nie trzeba [brak zmian w tablicach zalezności]
  - MEMOIZATION FUNKCJI (w tym celu dedykowany jest 'useCallback' -> który jest odmianą 'useMemo' bo use Memo musi robic HOF highr order function, a useCallback przyjmuje funkcję jako argument)

  ZASTRZEZENIA:
  - w <StrictMode> wywołuje się 2 razy
  - przy init renderze -> zawsze się wywoła (niezaleznie od TABLICY ZALEZNOŚCI)
  
  */
  /*
  SUPER jest do poprawy OPTYMALIZACJI, ale nie zawsze jest potrzbne. PRZESTRZEGAJMY ZASAD:
    1) prop 'children' jest LEPSZE od opakowania komponentów wewnątrz (te z children się nie RERENDERUJĄ 
        gdy stan komponentu się zmieni)
    2) NIE WYNOŚMY stanu dalej niż do najbliższego wspólnego komponentu
    3) LOGIKA RENDEROWANIE ma byc PURE
    4) UNIKAĆ zbędnych EFFECTÓW 
    5) UNIKAĆ ZBĘDNYCH ZALEŻNOŚCI w tablicach zależności
  */

  const cachedObj = useMemo(() => {
    return {
      name: "ABC",
    };
  }, []);

  const cachedJSX = useMemo(() => {
    return <span>JSX</span>;
  }, []);

  return (
    <div>
      <p>
        useMemo = {cachedObj.name} | JSX = {cachedJSX}
      </p>
      <ReactHooksMemoChild obj={cachedObj} />
    </div>
  );
}

// POMIJANIE ZBĘDNYCH RERENDEROWAŃ -> aby pomijać CHILD KOMPONENT musi być opakowany w 'memo'
const ReactHooksMemoChild = memo(function ReactHooksMemoChildInner({ obj }) {
  return <p>{obj.name}</p>;
});

// #################################
// #### useReducer | zaawansowane zarządzanie STANEM (bardziej zaawansowany useState)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const initReducerState = { name: "Aga" };

// WYGONIE JEST WYODRĘBNIĆ AKCJE
const REDUCER_ACTIONS = {
  SET_NAME: "setName",
  RESET: "reset",
};

function reducer(state, action) {
  switch (action.type) {
    case REDUCER_ACTIONS.SET_NAME:
      // NIE MODYFIKUJEMY STANU tylko zwracamy NOWY :)
      return {
        ...state,
        name: action.payload,
      };
    case REDUCER_ACTIONS.RESET:
      return initReducerState;
    default:
      throw new Error("Unknown action");
  }
}

function ReactHooksReducer() {
  /*
  const [state, dispatch] = useReducer(reducer, initialArg, init?)
    -) state -> STAN
    -) dispatch -> FUNKCJA do URUCHAMIANIA AKCJI (obiekt o budowie {type: string, payload?: any(optional)})
    -) reducer -> FUNKCJA do obsługi AKCJI [AKTUALIZACJI STANU]  function reducer(state, action) { ...zwraca nowy stan}
    -) initialArg -> POCZATKOWA WARTOŚĆ STANU (zawsze niech to będzie sama wartość -> nigdy wywołanie funkcji ,
           bo przy kazdym rerenderze się wykona, a nie musi [moze pogorszyć performance] jeśli mysi byc FUNC to jako 3 argument)
    -) init (OPCJONALNY) -> FUNCKJA (która zwraca stan początkowy), gdy jest obecna nadpisuje 'initialArg'
  
  ZASTRZEZENIA:
    - w <strictMode> wywoła się 2 razy
    - aktualizacja STANU jest BATCHowana (rerender komponenty dopiero gdy wszystkie SETTERY STANU się wykonają)
            mozna to zmienić poprzez dostęp do DOM przez 'flushSync'
      
  
  */
  const [state, dispatch] = useReducer(reducer, initReducerState);
  const [stanTest] = useReducer(reducer, "", () => {
    // super miejsce do pobrania INIT WARTOŚCI np: z localStorage
    return "MAMA";
  });

  function handleClick() {
    if (state.name === "Aga") {
      dispatch({
        type: REDUCER_ACTIONS.SET_NAME,
        payload: "Aguś",
      });
    } else {
      dispatch({
        type: REDUCER_ACTIONS.RESET,
      });
    }
  }

  return (
    <p onClick={handleClick}>
      (click change) REDUCER name = {state.name} | STAN_TEST = {stanTest}
    </p>
  );
}

// #################################
// #### useRef | śmietniczek na wszystko (zachowuje wartość między rerenderem ale go nie powoduje) REF do DOM, timeout, interval itp..
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksRef() {
  /*
  const ref = useRef(initialValue)

  do 'ref.current' mozemy zapisać co tylko chcemy [MUTABLE] (stabilna referencja w kazdym rerenderze, ale zmiana nie wywołuje rerenderu )
  
  ZASTRZEZENIA:
    - <strictMode> wywoła go 2 razy
    - do ref.current (zapisuje [poza initem] w EventachHenderlsach lub Effectach) UNIKAMY fazy RENDEROWANIA 

  UWAGA !!! wartośc inicjalna mimo iz jest wykorzystywana tylko przy INIT RENDERZE to odziałowuje na performance jesli jest to np:
      konstruktor klasy (jak jest to droga operacja lepiej zrobić to inaczej)

        const playerRef = useRef(null);
        if (playerRef.current === null) {             // sprawdzając czy ref nie posaida juz wartości
          playerRef.current = new VideoPlayer();
        }
      
      LUB przez GETTER

        const playerRef = useRef(null);
        function getPlayer() {
          if (playerRef.current !== null) {
            return playerRef.current;
          }
          const player = new VideoPlayer();
          playerRef.current = player;
          return player;
        }

  UWAGA!!! aby przekazać 'ref' do komponentu. To komponent musimy opakować w 'forwardRef'
  */

  const domRef = useRef(null);
  const timeRef = useRef(null);
  const componentRef = useRef(null);

  useEffect(() => {
    timeRef.current = setTimeout(() => {
      console.warn("REF CURRENT = ", domRef.current);
      console.warn(
        "REF CURRENT getBoundingClientRect = ",
        domRef.current.getBoundingClientRect()
      );
      console.warn("componentRef = ", componentRef.current);
    }, 2000);
    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  return (
    <div>
      <p ref={domRef}>p DOM REF</p>
      <ReactHooksRefChild ref={componentRef} />
    </div>
  );
}

// komponent opakowany w 'forwardRef' przyjme 'ref' jako 2 argument (1 - to 'props')
const ReactHooksRefChild = forwardRef(function ReactHooksRefChildInner(
  props,
  ref
) {
  return (
    <span {...props} ref={ref}>
      REF CHILD
    </span>
  );
});

// #################################
// #### useState | pamięc komponent (zmiana wywoła rerender)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksState() {
  /*
  UWAGA!!! DOKŁADNIE opisany w '1_TEMATY' '2_Interaktywność'

  const [state, setState] = useState(initialState)
    -) state -> STAN (jego zmiana powoduje RERENDER)
    -) setState -> funkcja do zmiany stanu (Stabilna referencja )
    -) initialState -> WARTOŚC lub FUNCKJA zwracająca wartośc POCZAtkową

  ZASTRZEZENIA:
    -) w <StrictMode> wywoła się 2 razy

  Do resetowania stanu (zmieńmy 'key' atrybut komponentu (wtedy stan będzie od INIT))
  */

  const [stan, setStan] = useState("Aga");
  const [stan2] = useState(() => {
    //np: localStore (funkcja musi być PURE)
    // uwaga taka funkcja wpłynie na wydajnośc mimo iz stan ustawi tylko na INIT
    // to i tak wywoła się na kazdy rerender
    return 28;
  });

  function handleClick() {
    setStan("Aguś");
    setStan((prevStan) => {
      // NIGDY do samego 'stan' (nie jest mutable)
      // jak jest OBIEKT i TABLICA (zawsze zwracać nowy obiekt /tablicę) NIE MUTOWAĆ
      return prevStan + "1";
    });
    setStan((prevStan) => {
      return prevStan + "2";
    });

    // wszystkie 3 się BATCHUJA i będzie 'Aguś12'
  }

  return (
    <p onClick={handleClick}>
      (click) STAN = {stan} | STAN 2 = {stan2}
    </p>
  );
}

// #################################
// #### useSyncExternalStore | Hooks pozwala się ZASUBSKRYBOWAĆ do zewnetrzego STORE (śródło danych)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.isOnline;
}

function getServerSnapshot() {
  return true;
}

function ReactHooksSyncExternalStore() {
  /*
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)

  // snapshot -> migawka danych ze store w danym czasie
  // subscribe -> FUNKCJA subskrybuje się do store i zwraca funkcję odsybskrybującą
  // getSnapshot -> FUNKCJA do czytania danych ze store (to co potrzebujemy ze store)
                    Jeśli te dane są inne (Object.is) to powoduje RERENDER komponentu
  // getServerSnapshot -> [OPCJONALNE] FUNKCJA - zwraca inicjalną wartość danych ze store, (tylko podczas SERVER_SIDE)
                  (wartość z tego zsostanie uzyta do wygenerowania plików HTML)
                  (podczas HUDRATACJI [dodawanie interaktywności do wygenerowanych na serwerze HTML])

  ZASTRZEZENIA:
    - snapshot z getSnapshot ma być IMMUTABLE (tylko read-only)
    - subscribe -> najlepiej deklarować poza komponentem
    - mutacja STORE (NIE MOZE BYC oznaczone jako NON-BLOCKING TRANISTION) -> uruchomią najblizszy <Suspacse> 
    - preferować uzywanie w ramach CUSTOM HOOK niz w KOMPONENCIE

  ZRODLA DANYCH DO UZYWANIA Z TYM: (ZRODLA DANYCH napisane nie-ractowym kodem)
    - blbioteki do zarządzania stanem
    - API PRZEGLADARKI np: navigator.isOnline


  */

  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return <p>{isOnline ? "JEST_ONLINE :)" : "JEŚTEŚMY_OFFLINE ;("}</p>;
}

// #################################
// #### useTransition | pozwala aktualizować STAN bez blokowania UI
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksTransition() {
  /*
  const [isPending, startTransition] = useTransition()

  //    isPending -> flaga informująca czy jest trwająca tranzycja
  //    startTransition -> Funkcja, która pozwala oznaczyć zmianę jako tranzycję [przyjmuje 1 arument funkcję, w której updatujemy stany]

  TRANYSCJE POMAGAJA nie wpadać w niechciany <Suspance> [oznaczone nimi zmiany go nie wywołają]

  ZASTRZEZENIA:
    - jeśli musimy wywołac tranzycję z innego miejsca zastosujmy (startTransition [ale z poza useTransition (PROSTO z REACT)])
          działa tak samo tylko nie ma 'isPending'
    - zadziała gdy wywołujemy settery stanu (dla CUSTOM_HOOK i PROPS stosować 'useDefferedValue')
    - update STANU oznaczonego jako 'TRANZYCJA' będzie PRZERWANY przez inne UPDATY STANU i ponownie wywołany 
          np: GRAF jako Tranzycja to gdy zaczniemy wpisywać w input to przerwie update grafu, zaktualizuje input state i wroci do grafu
    - WIELE TRANZYCJI jest batchowanych razem (doiero zmiana wszystkich wywoła rerender)[ZAPEWNE ZOSTANIE USUNIETE Z CZASEM]

    - NIE OPAKOWYWAĆ AKTUALIZACJI CONTROLOWANYCH POL formualrza w TRANZYCJE (setInput1 -> to nie w tranzycji)
    - nie wywoływać timeoutów/intervałów w startTransition (wtedy nie działa)
          zamiast tego opakować startTransition w timeoutów/intervałów !!!
    - wywołuje się natychmiast  (ponizej będzie '1''2''3') -> tylko SETY STANOW są Oznaczone jako TRANISTION 
              console.log(1);
              startTransition(() => {
                console.log(2);
                setPage('/about');
              });
              console.log(3);

  EKSPERYMENTALNE - pokazywanie błędu jeśli funkcja w 'startTransition' zwróci błąd
    <ErrorBoundry fallback={<p>Bład w tranzycji</p>}>
      <ComponentZuseTransition/>
    </ErrorBoundry>
  */

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [tab, setTab] = useState("111");
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <p>TAB = {tab}</p>
      <button
        onClick={() => {
          console.log("@@ RESET WYWOŁANY");
          setTab("111");
          setInput1("");
          setInput2("");
        }}
      >
        RESET
      </button>
      <p>
        <label>
          TRANZYCJA
          <input
            onChange={(e) => {
              const value = e.target.value;
              setInput1(value);

              // ZMIANY W TYM NIE BLOKUJA przycisku RESET [NIE BLOKUJA UI]
              startTransition(() => {
                setTab((prev) => prev + value);
              });
            }}
            value={input1}
          ></input>
        </label>
      </p>
      <p>
        <label>
          BEZ TRANZYCJI
          <input
            onChange={(e) => {
              setInput2(e.target.value);

              // ZMIANY W TYM BLOKUJA przycisk RESET dopóki CHILD sie nie wyrenderuje
              setTab((prev) => prev + e.target.value);
            }}
            value={input2}
          ></input>
        </label>
      </p>
      <span>{isPending ? "Trwająca tranzycja" : "Brak tranzycji"}</span>
      <ReactHooksTransitionChild tab={tab} />
    </div>
  );
}

const ReactHooksTransitionChild = memo(function ReactHooksTransitionChildInner({
  tab,
}) {
  if (tab !== "111") {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
  }

  return <p>DŁUGOŚĆ TABLICY{tab.length}</p>;
});

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
// #### useOptimistic | AKTUALIZUJE UI w sposób OPTYMISTYCZNY
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksOptimistic() {
  /*
  pokazuje INNY STAN gdy ASYNCHRONICZNA akcja się dzieje
  przujmuje stan i zwraca jego kopię (która moze się róznić gdy dzieje się asynchroniczna operacja np: HTTP REQUEST)
  NATYCHMIAST prezentuje USEROWIE wynik MIMO IŻ AKCJA TRWA (pokazuje to co chcemy aby user zobaczył jako wynik poprawnej operacji ASYNC)

  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
      -) state -> wartość do zwrócenie na INIT i gdy AKCJA trwa 
      -) updateFn -> funkcja (obecny STAN, optymistycznaWartość) zwraca optymistycznySTAN [musi być PURE]
            (currentState, optimisticValue) => {
              // merge and return new state
              // with optimistic value
            }
      -) optimisticState -> stan zwracany przez HOOK
      -) addOptimistic -> funkcja  (optimisticValue) => {}
  
      np: formularz (w tle zaraz poleci HTTP), ale pokazujemy USEROWI, ze juz się wysyła (SENDING)
  */
  return <></>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
