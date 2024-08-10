import {
  createContext,
  forwardRef,
  lazy,
  memo,
  startTransition,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function ReactAPI() {
  return (
    <div>
      <ReactAPIAct />
      <ReactAPICreateContext />
      <ReactAPIForwardRef />
      <ReactAPILazy />
      <ReactAPIMemo />
      <ReactAPIStartTransition />
      <ReactAPIUse />

      {/* TYLKO SERVER-SIDE */}
      <ReactAPICache />
    </div>
  );
}

export default ReactAPI;

// #################################
// #### act | -> pomoc przy testowaniu komponentów
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIAct() {
  /*
  // INSTALACJA WYMAGANYCH BIBLIOTEK
  npm install --save-dev vitest jsdom @testing-library/jest-dom @testing-library/react @testing-library/user-event

  // ZMIANY package.json
  "scripts": {
    //...
    "test": "vitest"
  },

  //vite.config.js
  export default defineConfig({
    base: "./",
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./tests/setup.js",
    },
  });

  //W TESTACH   komponent.test.jsx  IMPORTUJEMY na górze
  import { describe, it, expect } from "vitest";

  // NOWY plik 'tests/setup.js'
  import { afterEach } from 'vitest'
  import { cleanup } from '@testing-library/react'
  import '@testing-library/jest-dom/vitest'

  // runs a clean after each test case (e.g. clearing jsdom)
  afterEach(() => {
    cleanup();
  })




  await act(async actFn)

    - async actFn | funkcja opakowująca rendery lub interakcje komponentu


  przygotowanie komponentu na dodanie go w testach
    w ten sposób pomagamy testom uruchamiać się w środowisku bardzo przyminającym działanie reacta w przeglądarce
    (dlatego opakowujmemy w 'awiat act' funkcję która renderuje i wykonuje update)

  UWAGA!! istnieje bliboteka 'React Testing Library' która pomaga i robi to za nas
          nazwa od wzroca 'Arrange-Act-Assert'


  // TEST  - w testach renderowanie, obsługa eventów, pobieranie danych (fetch) mozna nazwac jednostkami (UNITS)
            act - pozwala zapewnic, ze te UPDATY dla tych jednostek (UNITY) się wykonają i będą w DOM przed testami 'assertions' (zapewnienia)

  it ('renders with button disabled', async () => {
    // act zapewni, ze przycik którego szukamy nizej jest dostępy gdy wywołamy 'expect' i 'querySelector'
    // UWAGA!!! zachęcane jest stosowanie 'act' przy 'async/await'
    await act(async () => {
      root.render(<TestComponent />)
    });
    expect(container.querySelector('button')).toBeDisabled();
  });



  // PLIK TESTU 'ReactAPI.test.jsx'
  import { describe, it, expect } from "vitest";
  import { act } from "react";
  import ReactDOM from "react-dom/client";
  import { ReactAPIActChild } from "./ReactAPI";

  describe("TEST", () => {
    it("Test test with React act", async () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      // UWAGA!!!  w 'act' mozemy RENDEROWAC komponenty
      await act(async () => {
        ReactDOM.createRoot(container).render(<ReactAPIActChild />);
      });

      const button = container.querySelector("button");
      const label = container.querySelector("p");

      expect(label.textContent).toBe("You clicked 0 times");
      expect(document.title).toBe("You clicked 0 times");

      // UWAGA!!!  w 'act' mozna tez wywoływać EVENTY
      await act(async () => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(label.textContent).toBe("You clicked 1 times");
      expect(document.title).toBe("You clicked 1 times");
    });
  });



  */
  return (
    <div>
      <ReactAPIActChild />
    </div>
  );
}

export function ReactAPIActChild() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

// #################################
// #### cache | SERVER SIDE cache
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPICache() {
  /*
  const cacheFn = cache(fn);
    // fn -> funkcja którą chcemy schachować (dowolna funkcja, dowolne argumenty, dowolny wynik)
    // cacheFn -> RETURN funkcję, która ma funkcjonalność cachowania 
                  (przy takich samych argumentach się nie wykona tylko poda zapisany wcześniej wynik)
                      te same argumenty to [porównanie przez 'Object.is' jak TABLICE ZALEZNOŚCI]:
                        - ich wartości
                        - i referencje (obiekty często sie zmianiją przy kazdym renderze UWAZAĆ NA TO !!!)
                                lepiej przekazać wartości obiektu osobno jako argumenty 1,2,3 ...
                  jeśli nie było wcześniej takich argumentów to się wykona

  cache ->:
    -) tylko SERVER-SIDE
    -) EKSPERYMENTALNE

  zatrzezenia:
    -) react uniewaznia 'cache' wszystkich funkcji przy kazdym RZADANIU do SERVERA
    -) wywołanie 'cache' tworzy nową funkcję (dla kazdej jest osobny 'cache')
    -) cachuje tez ERRORY
    -) TYLKO SERVER-SIDE  (dopuszcza async/await rendering  [async function Komp(){ //...mozna wywołać 'await' //...  }])
    -) Wywołanie TYLKO W KOMPONENCIE (poza komponentem nie działa) [w tle uzywa 'context']
        DEKLARACJA NAJLEPIEJ POZA KOMPONENTEM (aby współdzielić)

  ZASTOSOWANIE:
    -) cięzkie obliczenia np: Fetch list itp...
    -) PRELOAD DATA!!!
          (jeśli 1 wowołanie się nie skończy to 2 grzecznie czeka az 1 się skończy i bierze od niego dane)

          ### PRZYKŁAD 1
          const fetchData = cache(fn);
          function App(){
            fetchData();        // bez przypisania zwracanych danych [wywoła fetch gdy dzieci się renderują ]
            // ...
          }
          function Child(){
            const data = fetchData();   // Tutaj juz uzyjemy danych (zostały schaczowane w <App>)
            /...
          }

          ### PRZYKŁAD 2
          async function MyComponent() {
            getData();                          // 1
            // ... some computational work  
            await getData();                    // 2 z 'await'
            // ...
          }



  cache VS useMemo VS memo    [wszystkie są do MEMOIZATIION | ale sa roznice (CO CaCHUJE | KTO MA DOSTEP DO CACHE | KIEDY CACHE JEST CZYSZCZONY)]
  
                      
  - useMemo   |   client-side komponent && cache tylko dla ostatnich wartości w tablicy zalezności  (a nie dla kazdego wariantu)
                  słuzy do zapamietania DROGICH i skomplikowanych operacji (oraz dla stabilnej referencji)
                  [NIE CACHUJE ASYNCHRONICZNOSCI]
                  współdzielenie tylko poprzez przekazanie przez 'props'

  - memo      |   zapobiega Rerenderowie komponentów (gdy referencje i wartości props są niezmienne)
                  cachuje tylko ostatni render przy ostatnich props (z ostatnimi props, a nie kazdy wariant)

  - cache     |   server-side komponent && funckje które powinny być współdzielone wśród komponentów
                  cachuje WSZYSTKIE zwrotki
                  rowniez cachuje 'fetch' czyli ASYNCHRONICZNE FUNKCJE
                  cache się czyści przy rządaniach do Servera
  */
  return <div>Cache</div>;
}

// #################################
// #### createContext | do tworzenia contextu
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// tworzenie KONTEKSTU
const MyContext = createContext("light");
const ObjectContext = createContext({ name: "" });

function ReactAPICreateContext() {
  /*
  PRZEPISANE Z  '2_REFERENCJE' '1_ref_REACT' '1_Hooks' 'useContext' 

  useContext -> pozwala na dostęp do kontekstu z dowolnego miejsca (brak konieczności PROP DRILLINGU)
  CZĘSTO ŁĄCZONY z 'useReducer'

  GDY ZMIENIMY jego wartośc to REACT RERENDERUJE te komponenty, który używają 'useContext' z KONTEKSTEM, któremu zminilismy wartość
  UWAGA!!! 'memo' nie zapobiegnie odtrzymaniu nowych wartości


  ZASTOSOWANIE:
    -) przekazywanie danych do zagnieżdżonych komponentów (zawsze z najblizszego PROVIDERA (jeśli nie ma to domyślna wartość))
*/
  const [object, setObject] = useState({ name: "Aga" });
  const context = useContext(MyContext); // light

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
// #### forwardRef | pozwala na przekazanie 'ref' poprzez komponent do elementów (inny komponent lub tag), które on renderuje
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIForwardRef() {
  /*
  dokładnie opisane w '2_REFERENCJE' '1_ref_REACT' '1_Hooks' 'useRef'

  Wazne opisane powyzej :   HOOK 'useImperativeHandle' -> pozwala na określenie co przekazemy do ref 
  */

  const componentRef = useRef(null);

  return (
    <div>
      <ReactHooksRefChild ref={componentRef} />
    </div>
  );
}

// komponent opakowany w 'forwardRef' przyjme 'ref' jako 2 argument (1 - to 'props')
// w <StrictMode> wywoła się 2 razy
// ref moze być
//    - obiektem
//    - funkcją
//    - domyślna wartość NULL
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
// #### lzay | pozwala opóźnić ładowanie kody do chwili do której nie wyrenderuje się po raz 1
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const enableImport = true;

// bardziej zaawansowe uzycie lazy (doładowuje komponent dopiero po 3 sekundach)
const ReactAPILazyChild1 = lazy(() => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (enableImport) {
        resolve(import("./ReactAPILazyChild1.jsx"));
      } else {
        reject();
      }
    }, 3000);
  });

  return promise;
});

// najprostrze zastosowanie 'lazy'
// wymaga by 'ReactAPILazyChild2' miał 'default export'
const ReactAPILazyChild2 = lazy(() => import("./ReactAPILazyChild2.jsx"));

function ReactAPILazy() {
  /*
    pozwala opóźnić ładowanie kody do chwili do której nie wyrenderuje się po raz 1,
    czyli np: komponenty których dana strona nie uzywa, ale inna uzywa 
    LUB jak ponizej (kod komponentu 'ReactAPILazyChild2' doładuje się [zakładka 'network'])
      dopiero gdy klikniemy przycisk 'Load child 2'
      (na dzień dobry kod tego komponentu nie jest pobierany)
      PRZYSPIESZA działanie aplikacji, bo eliminuje ilość kodu do pobrania na Dzień Dobry
      i doczytuje go tylko wtedy gdy jest potrzebny

    const SomeComponent = lazy(load);
      // load ->  skrypt do ładowania komponentu z zewnętrznego zasobu 
                  w zasadzie to przyjmuje 'Promise' (oraz 'thenable' -> to na czym mozna wywołać 'then') 
                  wywoła się dopiero gdy będziemy chcili wyrenderować zmienną 'ReactAPILazyChild2'
                  pod zmienną 'SomeComponent' zapisze to co zwróci 'resolve' z Promise
                  po wywołaniu 'load' i jego wynik są 'CACHOWANE' -> wywoła się tylko 1 raz
                  gdy będzie reject to wywoła najblizszy Error Boundry -> o tym później
                        przykład jak w 'ReactAPILazyChild1'


    Komponenty zaczytane z mechanizmem 'lazy' są 'Suspense'
    czyli działa na nie mechanizm '<Suspense fallback={}>


    ZASTRZEZENIA:
      - deklarować POZA komponentem (nigdy wewnątrz)
  */

  const [showComponent, setShowComponent] = useState(false);

  return (
    <div>
      <p>LAZY</p>
      {/* dopóki się nie załaduje w lazy 'ReactAPILazyChild1' wyświetli sie fallback*/}
      <Suspense fallback={<p style={{ color: "#00ff00" }}>Trwa ładowanie</p>}>
        <ReactAPILazyChild1 />
      </Suspense>
      <div>
        <p>
          <button
            onClick={() => {
              setShowComponent((prev) => !prev);
            }}
          >
            Load child 2
          </button>
        </p>
        <div>
          {/* dopóki się nie załaduje w lazy 'ReactAPILazyChild2' wyświetli sie fallback*/}
          {/* BEZ TEGO <Suspense> React rzuci błędem  */}
          {showComponent ? (
            <Suspense
              fallback={
                <p style={{ color: "#00ff00" }}>
                  Trwa ładowanie warunkowego komponentu
                </p>
              }
            >
              <ReactAPILazyChild2 />
            </Suspense>
          ) : (
            <div style={{ color: "#00ff00" }}>Nie załadowany</div>
          )}
        </div>
      </div>
    </div>
  );
}

// #################################
// #### memo | pozwala pomijać RERENDERING komponentu tak długo jak nie zmieni się WARTOŚĆ lub REFERENCJA któregoś z PROPS
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const objOutside = { id: 2 };

function ReactAPIMemo() {
  /*
  pozwala pomijać RERENDERING komponentu tak długo jak nie zmieni się WARTOŚĆ lub REFERENCJA któregoś z PROPS
      nie działa na zmianę STANU wewnątrz 'memo' komponentu | zmianę CONTEXTU | zmianę stanu w REDUCER
      (mozna STAN i CONTEXT wynieść wyzej)
  POPRAWIA PERFORMANCE aplikacji

  const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
      -) SomeComponent | komponent, który chcemy ZMEMOIZOWAĆ (zapewnić ze rerenderuje go tylko zmiana props)
      -) arePropsEqual [OPCJONALNE | funkcja do porównywania czy props się zmieniły !!!! (przyjmuje STARE_PORPS, NOWE_PROPS)
                                     domyślnie bez tego React korzysta z 'Object.is'
                                     UWAGA!!! trzeba porównać kazde 'props'
                                     UWAGA!!! MOZE POGORSZYĆ PERFORMANCE (naawet gorszy niz RERENDER za kazdym razem)
                    function memoPropsEqualFuncs(prevCompProps, newCompProps) {
                      if (prevCompProps.obj1.id === newCompProps.obj1.id) {
                        // jeśli zwróci 'true' -> STARE i NOWE props są identyczne [BRAK RERENDERU]
                        // sami sterujemy czy ma sie RERENDEROWAĆ
                        return true;
                      } else {
                        // jeśli zwróci 'false' -> Inne wartości PROPS -> WYWOŁA RERENDER
                        return false;
                      }
                    }
      -) MemoizedComponent [ZWRACANA WARTOŚĆ] | komponent do uzywania (identyczny jak w 'SomeComponent' tylko z funkcjonalnością)

  
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
  const [rerender, setRerender] = useState(false);
  const [obj3] = useState({ id: 3 });
  // stabilna referencja dla OBIEKTOW|TABLIC poprzez 'useMemo' dla funkcji dzięki 'useCallback'
  const stableRef = useMemo(() => {
    return {
      id: obj3.id,
    };
  }, [obj3.id]);

  return (
    <div>
      <p>memo KOMPONENT | {rerender ? "TRUE" : "FALSE"}</p>
      {/* MIMO iz przy naciścięciu 'ReactAPIMemo' się RERENDERUJE to 'ReactAPIMemoComp' juz nie bo dostanie stabline PROPS*/}
      <button
        onClick={() => {
          setRerender((prev) => !prev);
        }}
      >
        RERENDER PARENT memo
      </button>
      <ReactAPIMemoComp
        age={21}
        name={"ABC"}
        // TEN obiekt ponizej ZAWSZE wywoła 'rerender' bo jest tworzony zawsze przy rerenderze (czyli ma zmienną referencje)
        // dlatego jest ZAKOMENTOWANY
        // obj1={{ id: 1 }}
        obj2={objOutside}
        obj3={stableRef}
      />
      {/*
        W tym stosujemy funkcję porównującą PROPS 'memoPropsEqualFuncs'
        która sprawdza tylko czy wartośc 'id' się zmieniła
        dlatego zapobiega RERENDEROWI
      */}
      <ReactAPIMemoComp2 obj1={{ id: 1 }} />
    </div>
  );
}

const ReactAPIMemoComp = memo(function ReactAPIMemoCompInner(props) {
  console.log("!!!! ReactAPIMemoComp RERENDER");
  return (
    <p>
      MEMO COMP | {props.name} {props.age} |
      {/* <span>OBIEKT 1 = {props.obj1.id ?? "Brak stabilnej referencji"}</span>{" "} */}
      <span>OBIEKT 2 = {props.obj2.id}</span>{" "}
      <span>OBIEKT 3 = {props.obj3.id}</span>{" "}
    </p>
  );
});

function ReactAPIMemoComp2Inner(props) {
  console.log("!!!! ReactAPIMemoComp2 RERENDER");
  return <p> MEMO COMP 2 | OBIEKT 1 = {props.obj1.id}</p>;
}
function memoPropsEqualFuncs(prevCompProps, newCompProps) {
  if (prevCompProps.obj1.id === newCompProps.obj1.id) {
    // jeśli zwróci 'true' -> STARE i NOWE props są identyczne [BRAK RERENDERU]
    // sami tym sterujemy
    return true;
  } else {
    // jeśli zwróci 'false' -> Inne wartości PROPS -> WYWOŁA RERENDER
    return false;
  }
}
const ReactAPIMemoComp2 = memo(ReactAPIMemoComp2Inner, memoPropsEqualFuncs);

// #################################
// #### startTransition(scope) | pozwala aktualizować stan bez blokowania UI (podobne do useTranistion, BEZ isPending)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIStartTransition() {
  /*
  startTransition(scope)
    -) scope -> funkcja, która w sobie wywołuje settery stanu
                wszystkie synchronicznie wywołane settery stanu są oznaczone jako 'tranzycje'
    -) funkcja nie zwraca nic
    -) pochodzi z biblioteki {react}

  (UWAGA mozna wywołać POZA KOMPONENTEM np: z biblioteki danych i innych skryptów zewnętrznych)

  TRANYSCJE POMAGAJA nie wpadać w niechciany <Suspance> [oznaczone nimi zmiany go nie wywołają]

  ZASTRZEZENIA:
    - jeśli musimy wywołac tranzycję z innego miejsca zastosujmy (startTransition [ale z poza useTransition (PROSTO z REACT)])
          działa tak samo tylko nie ma 'isPending'
    - zadziała gdy wywołujemy settery stanu (dla CUSTOM_HOOK i PROPS stosować 'useDefferedValue')
    - update STANU oznaczonego jako 'TRANZYCJA' będzie PRZERWANY przez inne UPDATY STANU i ponownie wywołany 
          np: GRAF jako Tranzycja to gdy zaczniemy wpisywać w input to przerwie update grafu, zaktualizuje input state i wroci do grafu
    - WIELE TRANZYCJI jest batchowanych razem (doiero zmiana wszystkich wywoła rerender)[ZAPEWNE ZOSTANIE USUNIETE Z CZASEM]

    - NIE OPAKOWYWAĆ AKTUALIZACJI CONTROLOWANYCH POL formualrza w TRANZYCJE (setInput1 -> to nie w tranzycji)
    - nie wywoływać timeoutów/intervałów w startTransition (wtedy nie działa) [tylko synchroniczne settery stanow]
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
// #### use | -> (Eksperymentalna funkcjonalność) pozwala czytać wartości z PROMISE lub CONTEXT
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIUse() {
  /*
  const value = use(resource);
    -) resource | źródło danych do odczytania z wartości odczytane przez PROMISE lub CONTEXT
    -) value | wartość odczytana z źródła danych (resolve(promise) LUB wartość contextu)

  const messagePromise = new Promise((resolve, reject) => {
    resolve({
      id: "ABC123",
    });
    // reject({
    //   error: "Error123",
    // });
  });
  const messagePromise2 = new Promise((resolve, reject) => {      // WERSJA Z OBSLUGA BŁĘDU !!!
    reject();
  }).catch(() => {
    return "no new message found.";
  });
  const ThemeContext = createContext("CONTEXT123")
  const message = use(messagePromise);      // message -> { id: "ABC123", }
  const theme = use(ThemeContext);          // theme   -> "CONTEXT123"    | DZIAŁA PODOBNIE do 'useContext'
                                            szuka wartości przekazanych przezn nablizszy <Context.Provider value='...'
                                                      opakowujący komponent wykorzystujący 'use' z KONTEXTEM
                                            UWAGA !!! tak jak 'useContext' ignoruje <Context.Provider value='...' z KOMPONENTU
                                                      który wywołuje 'use'

  ZASTRZEZENIA:
    -) jak HOOKI musi być wywołany w KOMPONENCIE lub HOOKU
    -) 'use' moze być uzyte wewnątrz PĘTLI oraz IF !!!
            zastosowanie z PROMISE -> pozwala na działanie mechanizmu <Suspanse> i <ErrorBoundry>
                                      gdy promise jest w PENDING to komponent jest w SUSPANSE i wywoła 'fallback' w <Suspanse>
                                      gdy zwróci RESOLVE -> wyświetli faktyczny komponent ( środek <Suspanse> )
                                      gdy zwróci REJECT -> wywoła najblizszy <ErrorBoundry>
    -) w SERVER COMPONENETACH
          preferujemy async/await  | nad 'use'
          z async/await -> komponent się renderuje dopiero gdy skończy się wywołanie await
          'use' -> rerenderuje komponent gdy dane są RESOLVED (rozwiązanie -> w kontekście dostarczenia z sukcesem)
    -) w SERVER COMPONENETACH
          preferujemy tworzenie PROMISOW w SERVER KOMPONENTACH i dostarczanie ich do KLIENT KOMPONENTOW poprzez 'props'
            (nie tworzymy promisow w KLIENT komponentach -> przy kazdym rerenderze sa tworzone od nowa)
            promisy z SERVER KOMPONENTOW są STABLINE w KLIENT KOMPONENTACH miedzy RERENDERAMI
            UWAGA!!! wartości zwracane przez PROMISE przekazywane w ten sposób muszą byc SERIALIZABLE !!!!
                  Serialization -> The process whereby an object or data structure is translated into a format 
                                    suitable for transfer over a network, or storage
                  np: FUNKCJE NIE SA SERIALIZABLE
                  ale PRYMITYWNE WARTOŚCI i OBIKETY, TABLICE itp.. SA!!!

    -) GDY PROMISE zwróci REJECT (dostarczy dane z ODRZUCENIA operacji)
          1) mozna wyświetlić <ErrorBoundry>
          2) mozna wyswietlic alternatywną wartości z '.catch(err => {...})'
    -) NIE MOZNA UZYWAC 'use' w     try {...} catch(exc) {...}
    -)

  */

  /*
  #################
  ## <ErrorBoundary />      | dodatek opisujący mechanizm wyłapywania BŁĘDOW 
  VVVVVVVVVVVVVVVVV

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      logErrorToMyService(error, info.componentStack);
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return this.props.fallback;
      }

      return this.props.children;
    }
  }

  ### ZASTOSOWANIE

  <ErrorBoundary fallback={<p>Something went wrong</p>}>
    <Profile />
  </ErrorBoundary>

  */

  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
