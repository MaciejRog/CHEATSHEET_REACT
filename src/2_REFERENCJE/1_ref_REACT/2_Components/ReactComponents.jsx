import { Fragment } from "react";

function ReactComponents() {
  return (
    <div>
      <ReactComponentsFragment />
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
