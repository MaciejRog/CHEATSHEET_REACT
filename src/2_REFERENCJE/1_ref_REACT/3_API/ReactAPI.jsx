import { useEffect, useState } from "react";

function ReactAPI() {
  return (
    <div>
      <ReactAPIAct />
      <ReactAPICache />
      <ReactAPICreateContext />
      <ReactAPIForwardRef />
      <ReactAPILazy />
      <ReactAPIMemo />
      <ReactAPIStartTransition />
      <ReactAPIUse />
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
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactAPICache() {
  return <div></div>;
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
