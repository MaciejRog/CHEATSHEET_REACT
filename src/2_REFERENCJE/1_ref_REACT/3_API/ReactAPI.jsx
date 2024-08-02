import {
  createContext,
  forwardRef,
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
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPILazy() {
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIMemo() {
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIStartTransition() {
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIUse() {
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
