import { useEffect, useState } from "react";

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
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPICreateContext() {
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPIForwardRef() {
  return <div></div>;
}

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
