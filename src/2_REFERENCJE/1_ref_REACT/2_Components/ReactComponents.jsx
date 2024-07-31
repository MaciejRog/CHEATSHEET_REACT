import { Fragment, lazy, Profiler, StrictMode, Suspense } from "react";

function ReactComponents() {
  return (
    <div>
      <ReactComponentsFragment />
      <ReactComponentsProfile />
      <ReactComponentsStrictMode />
      <ReactComponentsSuspense />
    </div>
  );
}

export default ReactComponents;

// #################################
// #### <Fragment> <> | grupuje elementy bez konieczność opakowywanie ich w inny element
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactComponentsFragment() {
  /*
  <></>                 // skrót od <Fragment> | nie moze miec 'key'
  <Fragment></Fragment> // moze miec 'key'

  słyzy do grupowania elementów (JSX musi zwrócić 1-element (1 tag | 1 node))
  Ale czasem nie chcemy opakowywać elementów w <div> tylko mieć na 1 poziomie kilka elementów wtedy jest Fragment
    (nie modyfikuje struktury DOM)


  ZASTRZEZENIA:
    - 1 zagniezdzenie  Z <Komponent> NA <> <Komponent/> </>  NIE RESETUJE STANU <Komponent>
    - 2 i więcej resetuje !!!   Z <Komponent> NA  <><> <Komponent/> </></>
    -

  */
  return (
    <>
      Tekst
      <p>Fragment</p>
      <p>Opakowuje i pozwala zagniezdzić wiele tagów bez (PARENT TAGU)</p>
      <Fragment key={1}>
        <p>Dzięki całej nazwie Fragment przyjmuje atrybuty HTML np: key</p>
      </Fragment>
      {/* ten komponent zwróci tylko 2x <span> */}
      <ReactComponentsFragmentChild />
    </>
  );
  /*
  TEN RETURN ZWROCI (płaską strukturę <> i <Fragment> są pomijane podczas zwracania kodu JSX)
          <p>Fragment</p>
          <p>Opakowuje i pozwala zagniezdzić wiele tagów bez (PARENT TAGU)</p>
          <p>Dzięki całej nazwie Fragment przyjmuje atrybuty HTML np: key</p>
          <span>123</span>
          <span>456</span>
  */
}

function ReactComponentsFragmentChild() {
  return (
    <>
      <span>123</span>
      <span>456</span>
    </>
  );
}

// #################################
// #### <Profiler> | miezy wydajność DRZEWA REACTA
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactComponentsProfile() {
  /*
  domyślnie wyłączony na produkcji

  ODPOWIEDNIK 'React Develop Tolls' (dodatek do przeglądarki)

  // Mozna miec bardzo wiele <Profiler> mogą tez być zagniezdzone

  -- nie naduzywać i stosować wtedy kiedy trzeba 
  */

  function handleRender(
    id, // identyfikuje <Profiler id="wydajnosc"
    phase, // 'mount' 'update' 'nested-update'
    actualDuration, // [ms] czas na render <Profiler> i jego dzieci | określa jak dobrze działa 'memo' i 'useMemo'
    //                      przy RERENDERACH powinno być ZNACZNIE mniejsze niz przy MOUNT (i wywołane na zmiany props)
    baseDuration, // [ms] czas szacowany ile bedzie sie rerenderował <Profiler> i jego dzieci  BEZ OPTYMALIZACJI
    //                      idealne by porównać z 'actualDuration' by sprawdzić czy optymalizacja działa
    startTime, // [ms] -> od którego stamu czasu sie zaczął render
    commitTime // [ms] -> do którego stamu czasu się zakończył render
  ) {
    console.log(
      `ReactComponentsProfile | id=${id} | phase=${phase} | actualDuration=${actualDuration} | baseDuration=${baseDuration} | startTime=${startTime} | commitTime=${commitTime}`
    );
  }
  return (
    // id -> identyfikuje jaką cześć aplikacji obliczamy
    // onRender -> funkcja która wykona sie za kazdym razem gdy zaktualizuje sie DRZEWO (zagniezdzone w <Profiler> komponenty)
    <Profiler id="wydajnosc" onRender={handleRender}>
      <ReactComponentsProfileChild />
    </Profiler>
  );
}

function ReactComponentsProfileChild() {
  return <p>ABC</p>;
}
// #################################
// #### <StrictMode> | pozwala na wyszukanie błędów w komponentach podczas DEVELOPMENTU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactComponentsStrictMode() {
  /*
  pozwala na wyszukanie błędów w komponentach podczas DEVELOPMENTU
  - dodaje funkcjonalności i ostrzezenia w czasie developmentu
  
  DODATKI:
    - komponenty RERENDERUJA się 2 razy (znajduje błędy w 'IMPURE KOMPONENTACH' wszystkie powinny być 'PURE')
          (PURY -> przy tym samych props, state, context [co powoduje rerender] zwracany jest taki sam JSX )
          RENDERUJE 2 RAZY:
            - ciało komponentu 
            - settery (setStan, useMemo, useCallback, useReducer)
            - metody komponentu (constructor, redner, shouldComponentUpdate itp..)
    - wywoła EFEKTY 2 razy (znajduje błędy w brakujących CLEANUPACH)
          NA PRODUKCJI JEST:
            - MOUNT (setup)                 [przy <strictMode> tutaj wywoła się jeszcze 'cleanup' -> 'setup']
            - RERENDER (cleanup -> setup)
            - UNMOUNT (cleanup)
    - react sprawdza czy komponenty nie korzystają z 'DEPRECATED API"
  
  Jak jest właczony (najlepiej opakować nim główny komponent, ale mozna tez tylko część aplikacji) to nie da się go wyłączyć
  AUTOMATYCZNIE usuwany w produkcji
  */
  return (
    <StrictMode>
      <ReactComponentsStrictModeChild />
    </StrictMode>
  );
}

function ReactComponentsStrictModeChild() {
  return <p>Strict Mode</p>;
}

// #################################
// #### <Suspense>  | pozwala wyświetlić inny kod JSX, podczas ładowania komponentu dziecka (props.children dla <Suspense>)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// lazy -> pozwala ładować LENIWIE [lazy] (nie zachłanie [eager]) komponenty (umówione dokładnie dalej)
const enableImport = true;
const ReactComponentsSuspenseChild = lazy(() => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (enableImport) {
        resolve(import("./ReactComponentsSuspenseChild"));
      } else {
        reject();
      }
    }, 3000);
  });

  return promise;
});
const ReactComponentsSuspenseChild2 = lazy(() => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (enableImport) {
        resolve(import("./ReactComponentsSuspenseChild"));
      } else {
        reject();
      }
    }, 8000);
  });

  return promise;
});

function ReactComponentsSuspense() {
  /*
  pozwala wyświetlić inny kod JSX, podczas ładowania komponentu dziecka (props.children dla <Suspense>)
  props.children -> inaczej jako CONTENT TREE -> JSX między tagami 
          <Suspense fallback={<></>}>
            // props.children | CONTENT TREE
          </Suspense>
  props.children musi się zawieścić (suspends) podczas renderowania -> wtedy wyrenderuje się JSX z atrybutu 'fallback' 

  fallback może byc: [najlepiej lekki JSX np: LoadingSpinner, Skieleton]
    - JSX | fallback={<p>Ładowanie</p>}
    - KOMPONENT | fallback={<ReactComponentsSuspenseFallback />}

  UWAGA!!! aktywuje się 'fallback' z najbliższego <Suspense>
  UWAGA!!! nawet jeśli tylko 1 CHILD się ładuje to wszystkie opakowane w <Suspense> się UKRYJĄ
          i pokażą w tym samym czacie gdy zawieszony sie odwiesi
          [pozwala sterować widocznością zależnych od siebie elementów]
  UWAGA!!! 'fallback' wywoła się nawet gdy komponent który go wywoła jest bardzo głeboko w TREE
            lub nawet w innym komponencie (obsługa do niego trafi)

  ZASTRZEŻENIA:
    - kiedy komponent się zawieśi (jego stan jest ZEROWANY -> trzewo budowane na NOWO)
    - AKTUALIZACJE PRZEZ 'startTransition' (useTransition) LUB 'useDeferredValue' NIE WYWOŁAJĄ 'fallback'
          Pomocne gdy jakieś updaty stanu MAJA GO NIE WYWOŁAĆ (dotyczy tylko <suspance> w który wpadają)
    - jeśli zawiesi się wcześniej wyrenderowane DRZEWO, react wyczyście jego LAYOUT EFFECTY
          kiedy CONTENT TREE będzie gotowe react wywoła LAYOUT EFFECTY ponownie
    - react ma opytmalizację do tego (Streaming Server Rendering && Selective Hydration)

  CO AKTYWUJE SUSPANSE:
    - pobierania danych wewnątrz frameworków (Relay && Next.js)
          sam z siebie tego nie wykrywa!!! (więc 'fetch' w EFFEKTACH czy EVENT HANDLERSACH nie wywoła tego)
    - LAZY-LOADING poprzez 'lazy'
    - czytanie wartości z PROMISE poprzez 'use'

  UWAGA:
    - nie opakowujmy każdego komponentu (dogadajmy z designerem gdzie ma być)
    - (alternatywą jest 'useDeferredValue' oraz 'startTransition' 
      PRZEPROWADZAJĄ UPDATY STANU nie blokujące UI | nie pokazują innych JSX'ow TYLKO JSX'y ze starymi wartościami stanu (w trakcie RERENDERU W TLE)

      startTransition (useTransition) -> używane często we 'frameworkach' oraz 'router libraries'
      useDeferredValue -> gdy chcemy określic zmiany jako 'nie nagłe'
    )

  SERVER_SIDE:
    - obsługuje ERRORY (od komponentów) po stronie serwera! (zwróci jego 'fallback')
        po stronie KLIENTA taki komponent spróbuje wyrenderować ponownie
              <Suspense fallback={<Loading />}>
                <Chat />
              </Suspense>
              function Chat() {
                // pozwala zapobiec renderowaniu komponentu na serwerze
                // na stronie klienta spróbuje ponownie ;)
                if (typeof window === 'undefined') {      
                  throw Error('Chat should only render on the client.');
                }
                // ...
              }
    - 
  */
  return (
    <div>
      <Suspense fallback={<ReactComponentsSuspenseFallback />}>
        {/* 
        przez 3s pokaże <ReactComponentsSuspenseFallback />
        po tym 'lazy' załaduje <ReactComponentsSuspenseChild /> i go wyświetli
         */}
        <ReactComponentsSuspenseChild />
        <p>TEN NIE CZEKA, ale i tak w 1 Suspense się ukryje </p>
        <Suspense fallback={<ReactComponentsSuspenseFallback2 />}>
          {/* na tego czekamy 5s dłużej niż na tego wyżej 
          więc podczas ładowanie tego 
              <ReactComponentsSuspenseChild />
              <p>TEN NIE CZEKA</p>
          są już widoczne
          gdy ten się ładuje wywoła się (NAJBLIŻSZY 'fallback') <ReactComponentsSuspenseFallback2>
            ale <ReactComponentsSuspenseFallback /> JUŻ NIE 
        */}
          <ReactComponentsSuspenseChild2 />
        </Suspense>
      </Suspense>
    </div>
  );
}

function ReactComponentsSuspenseFallback() {
  return <div style={{ color: "#ff0000" }}>Trwa ładowanie dziecka</div>;
}

function ReactComponentsSuspenseFallback2() {
  return <div style={{ color: "#00ff00" }}>Trwa ładowanie dziecka 2 !!!</div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
