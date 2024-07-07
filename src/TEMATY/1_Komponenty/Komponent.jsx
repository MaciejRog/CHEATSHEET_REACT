import { Fragment, useEffect, useState } from "react";
import KomponentExport from "./elements/KomponentExport"; // komponent pobrany z innego pliku (można pominąć `.jsx` dzięki ES MODULE)

function Komponent() {
  /*
  Komponent to podstawowa jednostka do budowanie UI aplikacji, mogą być małe jak i b. duże
  komponent to Funkcja (we wczesnych wersjach Reacta to była Klasa)
  UWAGA! Funkcja musi być z WIELKIEJ LITERY (bo komponent nie będzie działał)
  nie można zagnieżdżać DEFINICJI 1 komponentu w innym
  */

  return (
    <div>
      <KomponentJSX /> {/* komponenty można w sobie zagnieżdżać */}
      <KomponentImported />
      <KomponentProps />
      <KomponentRenderWarunkowy />
      <KomponentRenderList />
      <KomponentNajlepszePraktykiPure />
    </div>
  );
}

export default Komponent;

// #################################
// #### 1) JSX
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function KomponentJSX() {
  const imgSrc = `stronaZObrazkiem.jpg`;

  function renderFooter() {
    return <footer>Stopka strony</footer>;
  }

  /*
  Komponenty zwracają kod JSX
  który składa się z 'markup'ów' html -> nakładek na tagi HTML'a
  markup -> pozwala łączyć HTML z JS -> wynikiem są komponenty [połączenie treści i logiki strony]
  JSX -> piszemy jak HTML, ale to jest JS, który jest zmieniany na HTML'a 
  JSX i React to 2 różne rzeczy mogą być od siebie niezależne, ale w 99% nie są :)
  */
  return (
    // jeśli jest więcej niż 1 linia to zwracaną treść musimy opakować w nawiasy ()
    // UWAGA ! ZASADY pisania JSX
    // 1) JSX musi zwracać 1 TAG, dlatego jeśli jest więcej niż 1 tag to musimy je opakować np w: <> .... </> [Fragment] lub <div> ... </div>
    // 2) Wszystkie tagi muszą być zamknięte np: nie <img> TYLKO <img /> , nie <li>Nazwa TYLKO <li>Nazwa</li>
    // 3) camelCase, JSX zmienia się w obiekty JS, a podane w nim atrybuty zmieniają się na właściwości obiektu
    //      dlatego nie border-width, tylko borderWidth="" | oraz class - to zarezerwowane słowo dlatego piszmy className
    //      UWAGA! aria-* | oraz data-* | z historycznych powodów są pisane z użyciem dashCase czyli myślnikami
    // UWAGA! wewnątrz JSX można używać JS"a poprzez zamieszczenie go w nawiasy { ... }
    //        działą dla tekstów i atrybutów, ale nie można dynamicznie zmieniać tagów !!! <{tag}/> NIE DZIAŁA
    <div>
      <h1>Markup Nagłówek</h1>
      <img
        src={imgSrc} // odniesienie do zmiennej
        alt="Opis"
        className={`Dynamiczna-nazwa-${"klasy" + 1}`} // wykorzystanie `` z JS'a
        style={{
          // style jest obiektem JS'a (może żyć w osobnej zmiennej) | 1 para {} to wejście w JS w JSX, 2 para to obiekt JS'a
          borderWidth: "2px",
        }}
        aria-label="Nazwa Aria"
        data-label="Customowy atrybut html"
      />
      {/* Komentarz */}
      {renderFooter()} {/* Wywołanie funkcji JS, zwracającej kod JSX */}
    </div>
  );
}

// #################################
// #### 2) Import i export komponentów
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function KomponentImported() {
  /*
  DEFAULT vs NAMED export/import [funkcjonalność JS dokładnie ES MODULES]
  
  rodzaj    |   export                                 |   import                                 |   ilość
  -------------------------------------------------------------------------------------------------------------------
  DEFAULT   |   export default function Komp(){...}    |   import DowolnaNazwa from './Komp.jsx'  |     1
  NAMED     |   export function Komp(){...}            |   import { Komp } from './Komp.jsx'      |   dowolnie wiele

  UWAGA named export musi importować dokładnie taką samą nazwę zmiennej (identyczne imie), ale możną ją nadpisać ;)
    import { Komp: MojaNazwaDlaKomponentu } from './Komp.jsx'
  */

  return (
    <>
      {/* wykorzystanie komponentu pobranego z innego pliku */}
      <KomponentExport />
    </>
  );
}

// #################################
// #### 3) Właściwości komponentów (props)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function KomponentProps() {
  // komponenty komunikują się ze sobą poprzez właściwości (props), trochę jak argumenty funkcji (można przekazać nawet obiekty, tablice, funkcje)
  // zmiana props -> wywołuje przeładowanie komponentu, który go otrzymuje
  // props są 'immutable' -> niezmienne
  // TO ZNACZY , jeśli komponent potrzebuje zmienić props, to odpytuje rodzica i prosi o przekazanie nowych propsów (nowy OBIEKT) i pozbywa się starych
  // CZYLI z poziomu np: KomponentPropsPass1, sami nie możemy zmienić 'name' , 'age' itp.. musi dostać nowe wartości od 'KomponentProps'
  return (
    <>
      <KomponentPropsPass1
        name="ABC"
        age={21}
        data={{
          height: 180,
        }}
      >
        <span>SYN 1</span>
        {/* WSZYSTKO ZAGNIEŻDŻONE wewnątrz komponentu, który otrzymuje props, zostanie w nim przekazane jako  
            props.children !!!    to taka pusta przestrzeń, CHILD KOMPONENT nie musi wiedzieć jaki JSX wyrenderuje 
        */}
      </KomponentPropsPass1>
      <KomponentPropsPass2
        name="ABC2"
        age={22}
        data={{
          height: 182,
        }}
      >
        <span>SYN 2</span>
      </KomponentPropsPass2>
    </>
  );
}

// UWAGA aby ESLINT, nie zwracał błędów przy kosztaniu z props musimy mu je wyłączyć
// plik '.eslintrc.cjs' i w rules dodajemy "react/prop-types": "off",
/*
  rules: {
    "react/prop-types": "off",
    ...
  }
*/
function KomponentPropsPass1(props) {
  // odcytanie przekazanych props przez rodzica (dostajemy obiekt)
  return (
    <>
      <p>
        {`IMIE = ${props.name} | WIEK = ${props.age} | WZROST = ${props.data?.height} | ZAWÓD = }`}
        {props.children} {/*  <span>SYN 1</span> */}
      </p>
      <hr></hr>
      <KomponentPropsPass2 {...props} />
      {/* MOŻNA przekazać wszystkie propsy przez listowania ich {...props} NIE NADUŻYWAĆ, odpowiednik przekazana propsów
        dla komponentu <KomponentPropsPass1 /> przez komponent <KomponentProps />
      */}
    </>
  );
}

function KomponentPropsPass2({ name = "", age = 0, data, children }) {
  // odcytanie przekazanych props przez rodzica (ten obiekt możemy zdestrukturalizować oraz przypisać wartości inicjalne)
  // wartości inicjalne zostaną użyte gdy: 1) nie będzie pola np: name, 2) wartość będzie 'undefined' || nie działa dla null !
  return (
    <p>
      {`IMIE = ${name} | WIEK = ${age} | WZROST = ${data?.height} | ZAWÓD = }`}
      {children} {/*  <span>SYN 2</span> */}
    </p>
  );
}

// #################################
// #### 4) Renderowanie warunkowe
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function KomponentRenderWarunkowy() {
  // można warunkowo zwracać JSX zarówno w 'if' 'switch'
  // UWAGA !! zwrócienie wartości  null, false, undefined -> działa poprawnie i nie renderuje nic! (taka pusta działająca dziura w kodzie JSX)
  // UWAGA !! przy ?, &&, || nie używać czystych LICZBA !!! np: 0 && <spna>ABC</span>    zwraca 0
  const warunek1 = true;
  const warunek2 = true;
  let HTML = <p>To jest paragraf</p>;
  if (warunek2) {
    return <p>WARUNEK 2 TRUE</p>;
  } else {
    return (
      <div>
        {/* działa także "?"  */}
        {warunek1 ? <span>TRUE ?</span> : <span>FALSE ?</span>}
        {/* jeśli 'warunek1===true' to zwróci prawego */}
        {warunek1 && <span>TRUE &&</span>}
        {/* jeśli 'warunek1===true' to zwróci lewego */}
        {warunek1 || <span>TRUE ||</span>}
        {/* można wykorzystać by zwrocić warunkowo kod, jeśli istenie, jeśli nie można zwrócić 'null' */}
        {/* 'null' oznacza, że nie zostanie wyrenderowany dany fragment */}
        {warunek1 ? (
          <span>To się wyrenderuje tylko gdy warunek1 jest true</span>
        ) : null}
        {/* jeśli HTML istnieje to zostanie wyrenderowane */}
        {HTML || null}
      </div>
    );
  }
}

// #################################
// #### 5) Listy i klucze 'key'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function KomponentRenderList() {
  const lista = [
    {
      id: "ABC1",
      name: "A",
      age: 1,
    },
    {
      id: "ABC2",
      name: "B",
      age: 2,
    },
    {
      id: "ABC3",
      name: "3",
      age: 3,
    },
  ];

  return (
    <ul>
      {/* aby wyrenderować listę mapujemy po niej i przerabiamy każdy jej element na KOD JSX */}
      {/* główny tag z tego kodu JSX (pierwszy TAG) musi posiadać atrybut 'key', który jest UNIKALNY!!! */}
      {lista
        // Przykład 1 liniowego array-function (bez słowa return)
        .filter((el) => el.age < 3)
        // przykład wieloliniowego array-function (z użytym słowem return)
        .map((el, index) => {
          return (
            // atrubut key (dodana do tagów JSX oraz Komponentów)
            // UWAGA !!! key nie jest dostępne z poziomu props
            // key -> napis lub cyfra, UNIKALNY identyfikator obiektu z tablicy (może się powtórzyc dla INNYCH TABLIC)
            // key -> musi pozostać BEZ ZMIAN przy każdym renderze
            // Odpowiada za mapowanie obiektu z tablicy do danego komponentu, wspiera optymalizację zmian w DOM
            // sprawdzając który element uległ modyfikacji i który trzeba wyrenderować w DOM ponownie
            // na 99% nie wyliczac go z indexu ani np: math.random(), znacznie lepiej poprzez pakiet npm,  uuid lub crypto.randomUUID()
            // zalecane jest aby był brany prosto z tablicy (np id z bazy danych)
            <li key={el.id}>
              ID={index} | Nazwa = {el.name} | wiek = ${el.age}
            </li>
          );
        })}
      {lista.filter((el) => {
        return (
          // jeśli trzeba zwrócić więcej niz 1 tag przy pomocy map, to opakujemy to we <Fragment>...</Fragment>, działa jak <>...</>
          // z tą różnicą, że pozwala na określenie atrybutu 'key'
          <Fragment key={el.id}>
            <span>Nazwa = {el.name}</span>
            <span>Wiek = {el.age}</span>
          </Fragment>
        );
      })}
    </ul>
  );
}

// #################################
// #### 6) Najlepsze praktyki 'PURE'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
pure -> funckja, który wykonuje wyłącznie obliczenie
        nie zmienia zmiennych, które istniały zanim została wywołana
        te same dane wejściowe Zawsze zwracają ten sam wynik
TAKIE powinny być nasze komponenty !!!
        przy tych samych props -> powinny wyrenderować zawsze to samo
        PROCES RENDEROWANIA MUSI BYĆ PURE, nie można zmieniać zmiennych, które istniały przed renderowaniem 
        Przykład ZŁEGO KOMPONENTU PONIŻEJ
              let zmienna = 1;
              function Inpure() {
                zmienna++;                  // <-- MUTACJA zmiennej z poza zasięgu funckji 
                                            // <-- NIE MOŻNA MUTOWAĆ (zwłaszcza, STATE, PROPS i CONTEXT)  setState itp.. to nie MUTACJE :)
                let object = {};
                object.age = 18;            // <-- UWAGA !! zmiany zmiennych zdefiniowanych w ramach funckji SĄ OK !! tzw. LOCALNA MUTACJA
                return <p>{zmienna}{object.age}</p>;
              }
        JSX każdy komponent myśli tylko o sobie (jak na egzaminie w szkole)
        <React.StrictMode> -> pomaga w fazie developmentu na wykrycie złych (INPURE) komponentów
SIDE EFFECT -> aktualizacja ekranu, animacja, zmiana danych to przykłady operacji wykonywanych PO ZA renderowaniem
        można je wykonywać tylko poza fazą renderowania komponentów np w:
              event handlers    np: onclick   (wykonywane poprzez wykonanie pewnej akcji, w fazie renderowania są deklarowane, a nie wywoływane)
              useEffect     (OSTATNIA DESKA RATUNKU - hook wywoływany po fazie renderowania, kiedy dozwolone są side-effecty)

WSZYSTKIE KOMPONENTY POWINNY BYĆ PURE
    pozwala to na omijanie niepotrzebnych renderów i porzucanie tych, które juz są nieaktualne, co wspiera optymalizację

*/

function KomponentNajlepszePraktykiPure({ wiek = 18 }) {
  const [name, setName] = useState("ALA");
  useEffect(() => {
    // side-eddecty, w ostateczności tutaj
  }, []);
  function handleClick() {
    // side - effecty tutaj
    setName("ABC"); // <-- set'tery NIE MUTUJĄ
  }
  return (
    <div onClick={handleClick}>
      To jest czysty (PURE) komonent | {name} {wiek}
    </div>
  );
}
