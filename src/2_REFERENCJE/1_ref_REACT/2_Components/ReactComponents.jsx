import { Fragment, Profiler } from "react";

function ReactComponents() {
  return (
    <div>
      <ReactComponentsFragment />
      <ReactComponentsProfile />
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
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
