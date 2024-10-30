import { useLayoutEffect, useRef, useState } from "react";

function ReactDOMComponents() {
  /*
  React wspiera wszystkie tagi HTML i SVG

  każdy tagi tag w reakcie to nakładka na natywny tag HTML (dlatego nazwy atrybutów mogą być inne + każdy tez ma 'ref')
      nakładki rozbudowują funkcjonalności
      dla nazw atrybutów stosujemy 'camelCase' zamist 'tabindex' w REACTIE jest 'tabIndex'

  KOMPONENTY FORMULARZA:
      <input>, <select>, <textarea> -> przy przekazaniu atrubytu 'value' stają się KOMPONENTAMI KONTROLOWANYMI !!!!

  CUSTOM KOMPONENTY
    -) komponenty z '-' np: <moj-komponent class="ABC" for="123" />
              UWAGA!!! zamiast 'className' jest 'class'
                       zamiast 'htmlFor' jest 'for'
    -) komponenty z atrybutem 'is' są traktowane jako custom  !!!  <p is></p>     

  */
  return (
    <div>
      <ReactDOMComponentsCommon />
      <ReactDOMComponentsForm />
      <ReactDOMComponentsForm2 />
      <ReactDOMComponentsSelectOption />
      <ReactDOMComponentsProgress />
      <ReactDOMComponentsTextarea />
    </div>
  );
}

export default ReactDOMComponents;

function ReactDOMComponentsCommon() {
  /*
  WSZYSTKIE wbudowane z HTML tagi wspierają pewne 'props' i 'events'

  PROPS: (WAŻNE)
    -) id                                 | unikalny identyfikator obiektu
    -) children                           | pozwalają na zagnieżdżanie elementów w sobie
    -) ref                                | pozwala na przekazanie referencji do DOM
    -) style                              | obiekt dodający INLINE STYLE 
                                            (property obiektu są w 'camelCase' np: 'backgroundColor' zamiast 'background-color')
                                            czyste wartości liczb np:  height: 25   -> jest konwertowane na 'px' -> height: "25px"
    -) className                          | określa nazwę klas CSS 
                                            zamiast 'class' jest 'className'
    -) aria-*:                            | ARIA attributes let you specify the accessibility tree information for this element. See ARIA attributes for a  
                                            complete reference. In React, all ARIA attribute names are exactly the same as in HTML.
    -) contentEditable                    | pozwala zamienić każdy tag na 'input' -> można z klawiatury edytować jego treść 
                                            (React ostrzega warningiem gdy taki element ma props 'children' bo po edycji nie wie jak go odświeżać przy rerenderingu)
    -) data-*:                            | pozwala dodać do DOM tekstowe informacje np: obiekt w JSONIE, który można łatwo odczytać np: data-fruit="banana"
    -) draggable:                         | A boolean. Specifies whether the element is draggable. Part of HTML Drag and Drop API.
    -) htmlFor:                           | A string. For <label> and <output>, lets you associate the label with some control. Same as for HTML attribute. 
                                            React uses the standard DOM property names (htmlFor) instead of HTML attribute names.
    -) inputMode:                         | A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
    -) tabIndex:                          | Liczba (-1, 0 (można też innych używać, ale lepiej nie)) wskazująca, które elementy powinny łapać 'FOCUS' na 'TAB' key


  PROPS: (POZOSTAŁE)  
    -) accessKey:                         | A string. Specifies a keyboard shortcut for the element. Not generally recommended.
    -) autoCapitalize:                    | A string. Specifies whether and how the user input should be capitalized.
    -) dir:                               | Either 'ltr' or 'rtl'. Specifies the text direction of the element.
    -) enterKeyHint:                      | A string. Specifies which action to present for the enter key on virtual keyboards.
    -) hidden:                            | A boolean or a string. Specifies whether the element should be hidden.
    -) is:                                | A string. If specified, the component will behave like a custom element.
    -) inputMode:                         | A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
    -) itemProp:                          | A string. Specifies which property the element represents for structured data crawlers.
    -) lang:                              | A string. Specifies the language of the element.
    -) suppressHydrationWarning           | boolean (gdy na true to REACT nie rzuca WARNINGIEM gdy CLIENT i SERVER komponent mają różne WYNIKI)
                                          np: bazują na 'new Date().getTime()'
    -) suppressContentEditableWarning     | boolean 
                                            na 'true' pozwala na posiadanie prop 'children' wraz z atrybutem 'contentEditable' na true
    -) UWAGA!!! dangerouslySetInnerHTML   | (innerHtml) NIE UŻYWAĆ - > powoduje podatności XSS  [nie może być użyte jednocześnie z 'children']
    -) role:                              | A string. Specifies the element role explicitly for assistive technologies.
    -) slot:                              | A string. Specifies the slot name when using shadow DOM. In React, an equivalent pattern is typically achieved by passing JSX 
                                            as props, for example <Layout left={<Sidebar />} right={<Content />} />.
    -) spellCheck:                        | A boolean or null. If explicitly set to true or false, enables or disables spellchecking.
    -) title:                             | A string. Specifies the tooltip text for the element.
    -) translate:                         | Either 'yes' or 'no'. Passing 'no' excludes the element content from being translated.

  UWAGA!! można nadawać 'customProps' czyli wszystko co nie zaczyna się od 'on' będzie w DOM :)
  */

  /*
    EVENTY - zademonstrowane na przykładach

    UWAGA!!!
      w reactie -> w przeciwieństwie do JS'a (wszystkie eventy bombelkują!!!)
                    Some events (like onAbort and onLoad) don’t bubble in the browser, but bubble in React.

    UWAGA!
      każdy event posiada swoje 2 werjsi np:
      -) onClick            - obsługa kliknięcia w element
      -) onClickCapture     - wersja 'onClick' która odpali się w fazie 'capture'

    Tak więc eventy 'capture' pozwalając omijać 'stopPropagation' 
    -> użyteczne do routerów i analityki

    EVENTY PROPAGUJĄ W REAKCJIE w 3 fazach:
    - 1) od window -> do elementu | który wywołał (wywołuja wszystkie 'capture eventy' np: 'onClickCapture' )
    - 2) wywołuje 'event' np: 'onClick' na elemencie 
    - 3) od elementu -> do window | po drodze wywołując wszystkie 'onClick' na elementach przez któe przechodzi
  */

  const domRef = useRef();
  return (
    // children
    <div>
      <p>---------- PROPS ----------</p>
      {/* ref */}
      <div ref={domRef}>REF</div>
      <div
        ref={(ref) => {
          // do atrybutu 'ref' można też przekazać funkcję !!!
          // wtedy na 'mount' dostaniemy referencję do obiektu, a przy 'unmount' null (np przy rerenderze null i domRef dostaniemy)
          // wywoła się za każdym razem gdy dostanie nową wartość callbacku (np: tak jak tutaj przy każdym rerenderze zwróci nową funkcję)
          console.log("ReactDomComponents | ref callback = ", ref);

          // UWAGA!!! EKSPERYMENTALNIE przyjmuje 'return' cleanup function
          // return () => {};
        }}
      >
        REF
      </div>
      {/* class CSS -> zamiast nazwy 'class' stosujemy className */}
      <div className="nazwa-klasy-css"></div>
      {/* style */}
      <div style={{ backgroundColor: "red", height: "25px" }}></div>
      {/* aria-* */}
      <div aria-description="Opis dla Aria">ARIA</div>
      {/* data-* */}
      <div data-moje-dane={JSON.stringify({ a: "1", b: "ccc" })}>DATA</div>
      {/* contentEditable-* */}
      <p>CONTENT EDITABLE</p>
      <div
        contentEditable="true"
        inputMode="numeric"
        style={{ border: "1px solid grey" }}
      ></div>
      {/* dangerouslySetInnerHTML | odpowiednik 'innerHTML' pozwala osadzać kod HTML (BARDZO NIEBEZPIECZNE) */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<br><br><div>TO JEST OSADZONE PRZEZ INNER HTML REACTOWE</div><br><br>`,
        }}
      ></div>

      <p>---------- EVENTS ----------</p>
      <div
        onClick={(e) => {
          // eventy otrzymuja tzw: 'SYNTETIC EVENT' reactowa wersja obudowująca natywne eventy
          console.log("EVENT , SYNTETIC EVENT= ", e);

          /*
          WSZYSTKIE EVENTY DODAWANE W REACTIE są tak na prawdę dodawane na ROOTCIE !!!

          Posiada inne pola i naprawia, niektóre niekonsekwencje przeglądarek.
          Powodować może zmiany w różnych property event względem natywnych eventów np:
          currentTarget, eventPhase, target, and type

          DOSTĘP DO NATYWNEGO EVENTU PRZEZ:
            nativeEvent: A DOM Event. The original browser event object.
          */
        }}
      ></div>
      {/* eventy tylko dla <form> */}
      <form
        onReset={console.log(
          "wywołane na reset (resetowanie form przez button)"
        )}
        onSubmit={console.log(
          "wywołane na submit (zatwierdzenie form przez button)"
        )}
      ></form>
      {/* eventy tylko dla <dialog> */}
      <dialog
        onCancel={console.log("wywołane na Cancel")}
        onClose={console.log("wywołane na Close")}
      ></dialog>
      {/* eventy tylko dla <details> */}
      <details onToggle={console.log("wywołane na Toggle")}></details>
      {/* eventy tylko dla <img>, <iframe>, <object>, <embed>, <link>, and SVG <image>*/}
      <img
        onLoad={console.log("wywołane na Load")}
        onError={console.log("wywołane na Error")}
      ></img>
      {/* eventy tylko dla  <audio> and <video> [UWAGA - bobmelkują]*/}
      <video
        onAbort={console.log(
          "wywołane na when the resource has not fully loaded, but not due to an error"
        )}
        onCanPlay={console.log(
          "wywołane na Fires when there’s enough data to start playing, but not enough to play to the end without buffering"
        )}
        onCanPlayThrough={console.log(
          "wywołane na Fires when there’s enough data that it’s likely possible to start playing without buffering until the end"
        )}
        onDurationChange={console.log(
          "wywołane na Fires when the media duration has updated"
        )}
        onEmptied={console.log(
          "wywołane na Fires when the media has become empty"
        )}
        onEncrypted={console.log(
          "wywołane na Fires when the browser encounters encrypted media"
        )}
        onEnded={console.log(
          "wywołane na Fires when the playback stops because there’s nothing left to play"
        )}
        onError={console.log(
          "wywołane na  Fires when the resource could not be loaded"
        )}
        onLoadedData={console.log(
          "wywołane na Fires when the current playback frame has loaded"
        )}
        onLoadedMetadata={console.log(
          "wywołane na Fires when metadata has loaded"
        )}
        onLoadStart={console.log(
          "wywołane na Fires when the browser started loading the resource"
        )}
        onPause={console.log("wywołane na Fires when the media was paused.")}
        onPlay={console.log(
          "wywołane na Fires when the media is no longer paused"
        )}
        onPlaying={console.log(
          "wywołane na Fires when the media starts or restarts playing"
        )}
        onProgress={console.log(
          "wywołane na Fires periodically while the resource is loading"
        )}
        onRateChange={console.log(
          "wywołane na  Fires when playback rate changes"
        )}
        onResize={console.log("wywołane na Fires when video changes size")}
        onSeeked={console.log(
          "wywołane na Fires when a seek operation completes"
        )}
        onSeeking={console.log(
          "wywołane na Fires when a seek operation starts"
        )}
        onStalled={console.log(
          "wywołane na Fires when the browser is waiting for data but it keeps not loading."
        )}
        onSuspend={console.log(
          "wywołane na  Fires when loading the resource was suspended."
        )}
        onTimeUpdate={console.log(
          "wywołane na Fires when the current playback time updates"
        )}
        onVolumeChange={console.log(
          "wywołane na Fires when the volume has changed"
        )}
        onWaiting={console.log(
          "wywołane na  Fires when the playback stopped due to temporary lack of data"
        )}
      ></video>
    </div>
  );
}

// #################################
// #### <form></form> [EKSPERYMENTALNE FUNKCJONALNOŚCI]
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
const productId = 123;

function ReactDOMComponentsForm() {
  /*
  w opisie pominięto:
    - HOOK 'useFormStatus'
    - HOOK 'useOptimistic'
    - KOMPONENT <ErrorBoundary fallback={<p>Coś</p>}>...</ErrorBoundary>
    - HOOK 'useActionState'

  
  <form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
  </form>

  <form> przyjmuje atrybut 'action' jako:
    1) URL -> natywne zachowanie przeglądarki (przekierowanie, ale ZAWSZE METODA 'POST" szyfrowane dane)
    2) FUNKCJE -> może być asynchroniczna (z dopiskiem "use server" w Server Componentach pozwala 
                korzystać z formularza zanim załaduje się kod JS)
    UWAGA!!  można nadpisać poprzez atrybut 'formAction' NA <button>, <input type="submit">, or <input type="image">
  */

  async function addToCart(formData) {
    ("use server");
    // z obiektu 'formData' poprzez metodę 'get' można wyciągnąć wartości pól formularza
    const poleValue = formData.get("pole");
    const productIdValue = formData.get("productId");
    console.log("addToCart | poleValue = ", poleValue);
    console.log("addToCart | productIdValue = ", productIdValue);
    // await updateCart(productId);
  }

  {
    /* METODA 1 PRZEKAZYWANIA DODATKOWYCH DANYCH DO ACTION = poprzez 'bindowanie */
  }
  async function addToCart2(productId, formData) {
    "use server";
    console.log("addToCart2 | formData = ", formData);
    // await updateCart(productId);
  }
  // zbindowaliśmy 'productId' dzięki czemu addToCart2 ma do niej dostęp i otrzyma ją jako argument;)
  const addProductToCart = addToCart2.bind(null, productId);

  function save(formData) {
    const poleValue = formData.get("pole");
    console.log("SAVE | poleValue = ", poleValue);
  }

  return (
    <>
      {/* przyjmuje funkcje asynchroniczną */}
      <form action={addToCart}>
        {/* METODA 2 PRZEKAZYWANIA DODATKOWYCH DANYCH DO ACTION = poprzez pola "hidden" */}
        <input type="hidden" name="productId" value={productId} />
        <input name="pole" />
        <button type="submit">Add to Cart</button>
        {/* Nadpisanie wywołania 'action', pominie wywołanie funkcji 'addToCart', w zamian wywoła funkcję 'save' */}
        <button formAction={save}>Save draft</button>
      </form>
      <form action={addProductToCart}>
        <input name="pole" />
        <button type="submit">Add to Cart</button>
      </form>
    </>
  );
}

// #################################
// #### FORMULARZE <input> && <form></form>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactDOMComponentsForm2() {
  /*
  POLA KONTROLOWANE: (ich wartości z pól są zapisane do stanu)
    - WYMAGAJĄ atrybutu 'value' lub 'checked' [ustalają ich wartość, też domyślną]
    - do tego potrzebny event 'onChange'
        UWAGA!!! 'value' jest STRINGIEM a 'checked' BOOLEAN

  POLA NIEKONTROLOWANE: (ich wartość jest do odczytania dopiero przy submit / obsłudze eventu)
    - do ustawienia wartości domyślnych jest (defaultChecked [radio i checkbox] LUB defaultValue)

  UWAGA! Komponenty muszą byc albo KONTROLOWANE albo NIEKONTROLOWANE (nie może sie to zmienic w czasie)

  ISTOTNE ATRYBUTY:
    - autoComplete
    - autoFocus
    - disabled
    - placeholder
  
  DLA KAŻDEGO <input> MUSIMY NADAC ATRYBUT 'name'
  <input name="nazwa-pola-formularza"/>

  DLA KONTROLOWANYCH wartości nadawane dla STANU muszą byż zgodne z 'e.target.value' lub 'e.target.checked'
    (NIE MOŻNA ICH MODYFIKOWAĆ np: 'e.target.value.toUpperCase()' jest BŁĘDNE !!!)
    + UPDATE MUSI BYĆ SYNCHRONICZNY !!! nie dopuszczalna jest asynchroniczność
  */

  const [checked, setChecked] = useState(false);
  const [checkedValue, setCheckedValue] = useState(0);

  // wartości dla KONTROLOWANYCH PÓL (nie powinny byc 'null' lub 'undefined')
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState(0); // dla <input> które mogą przyjąć NUMBER, ale na onChange i tak to ustawią jako STRING !!!

  // do przetrzymania z NIEKONTROLOWANEGO POLA
  const [uncontrolVal, setUncontrolVal] = useState(undefined);

  function handleState(name, value) {
    switch (name) {
      case "checked":
        setChecked(value);
        break;
      case "checked-value":
        setCheckedValue(value);
        break;
      case "value-1":
        setValue1(value);
        break;
      case "value-2":
        setValue2(value);
        break;
      case "uncontrol-value":
        setUncontrolVal(value);
        break;
      default:
        break;
    }
  }

  const handleChangeChecked = (e) => {
    // odczytujmey 'checked' i 'name' z atrybutów <input>
    const { name, checked } = e.target;
    console.warn(
      `handleChangeChecked | name = ${name} | checked = ${checked} | typeof checked = ${typeof checked}`
    );
    handleState(name, checked);
  };

  const handleChangeValue = (e) => {
    // odczytujmey 'value' i 'name' z atrybutów <input>
    const { name, value } = e.target;
    console.warn(
      `handleChangeValue | name = ${name} | value = ${value} | typeof value = ${typeof value}`
    );
    handleState(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn("FORM SUBMIT | e = ", e);
    console.warn(
      "FORM SUBMIT | new FormData(e.target) = ",
      new FormData(e.target)
    );
    console.warn(
      "FORM SUBMIT | new FormData(e.target).get('value-1') = ",
      new FormData(e.target).get("value-1")
    );
  };

  const handleReset = (e) => {
    e.preventDefault();
    console.warn("FORM RESET | e = ", e);
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "16px",
        }}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {/* 
        ###############################################
        ## <label> -> OZNACZENIE POLA i POPRAWA JEGO ACCESIBILITY
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        {/* LABEL, WERSJA 1 - poprzez atrybuty 'htmlFor' oraz 'id' */}
        <label htmlFor="label-1">LABEL 1</label>
        <input id="label-1"></input>
        {/* LABEL, WERSJA 2 - poprzez zagnieżdzenie <input> w <label> */}
        <label>
          <span>LABEL 2</span>
          <input name="label-2"></input>
        </label>

        {/* 
        ###############################################
        ## ELEMENTY 'checked' | tylko <input type="checkbox"/> (gdy jest atrybut 'checked' to jest KONTROLOWANY)
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <label>
          <span>CHECKED</span>
          <input
            name="checked"
            type="checkbox"
            value={checked}
            onChange={handleChangeChecked}
          ></input>
        </label>

        {/* 
        ###############################################
        ## ELEMENTY 'checked' i 'value' | tylko <input type="radio"/> (gdy jest atrybut 'checked' to jest KONTROLOWANY)
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <label>
          <span>CHECKED VALUE</span>
          <input
            name="checked-value"
            type="radio"
            value={"1"}
            checked={checkedValue === "1" ? true : false}
            onChange={handleChangeValue}
          ></input>
          <input
            name="checked-value"
            type="radio"
            value={"2"}
            checked={checkedValue === "2" ? true : false}
            onChange={handleChangeValue}
          ></input>
        </label>
        {/* 
        ###############################################
        ## ELEMENTY 'value' | (gdy jest atrybut 'value' to jest KONTROLOWANY)
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <label>
          <span>VALUE 1 - TEXT</span>
          <input
            name="value-1"
            type="text"
            // type="color"
            // type="date"  // również przyjmuje 'Date.now()'
            // type="email"
            // type="password"
            // type="range"
            // type="search"
            // type="tel"
            // type="time"
            // type="url"
            value={value1}
            onChange={handleChangeValue}
          ></input>
        </label>

        <label>
          <span>
            VALUE 2 - NUMBER (i tak będzie po onChange zamiana na STRING)
          </span>
          <input
            name="value-2"
            type="number"
            // type="range"
            value={value2}
            onChange={handleChangeValue}
          ></input>
        </label>
        {/* 
        ###############################################
        ## ELEMENTY NIEKONTROLOWANE | <input type="file"/>
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <label>
          <span>NIEKONTROLOWANE type=file</span>
          <input
            name="uncontrol-value"
            type="file"
            onChange={handleChangeValue}
            accept=".txt"
            // capture="user"
            multiple={true}
          ></input>
          <span>{uncontrolVal}</span>
        </label>

        {/* 
        ###############################################
        ## PRZYCISKI DO SUBMIT (zatwierdzania formularza)
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <button type="submit">SUBMIT BTN</button>
        <label>
          <span>INPUT SUBMIT</span>
          <input name="input-submit" type="submit" />
        </label>
        <label>
          <span>INPUT IMAGE SUBMIT</span>
          <input
            name="img-submit"
            type="image"
            alt="Zdjęcie"
            width={"20px"}
            height={"20px"}
            src=""
          />
        </label>
        {/* 
        ###############################################
        ## PRZYCISKI DO RESET (resetowanie formularza)
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <button type="reset">RESET BTN</button>
        <label>
          <span>INPUT RESET</span>
          <input name="input-reset" type="reset" />
        </label>
        {/* 
        ###############################################
        ## PRZYCISKI BEZ WYWOŁANIA eventów (submit, reset) FORMULARZA
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
        <button type="button">BTN KTÓRY NIC NIE WYWOŁA</button>
      </form>
    </>
  );
}

// #################################
// #### <select> <option>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const OPTIONS = [
  { id: "option-1", value: "1", text: "Option-1" },
  { id: "option-2", value: "2", text: "Option-2" },
];

function ReactDOMComponentsSelectOption() {
  // SELECT KONTROLOWANY | sterowanie zarządzaniem domyślnie wybranej wartości dla <select> poprzez stan inicjalny
  // SELECT NIEKONTROLOWANY | poprzez wartość atryubutu 'defaultValue'

  //dla <select>  STRING
  // const [selectVal, setSelectVal] = useState("-1");
  //dla <select multiple={true}> TABLICA STRINGOW
  const [selectVal, setSelectVal] = useState(["-1"]);

  const handleChange = (e) => {
    // obsługa onChange identyczna jak dla inputów (opartych na 'value')
    const { name, value, selectedOptions } = e.target;
    console.warn(
      `handleChange SELECT | name = ${name} | value = ${value} | typeof value = ${typeof value} | selectedOptions = ${Array.from(
        selectedOptions
      ).map((option) => option.value)}`
    );
    //dla <select>
    // setSelectVal(value);
    //dla <select multiple={true}> WERSJA 1
    setSelectVal((prev) => {
      if (prev.includes(value)) {
        return prev.filter((el) => el !== value);
      } else {
        return [...prev, value];
      }
    });
    //dla <select multiple={true}> WERSJA 2
    const options = [...selectedOptions];
    const values = options.map((option) => option.value);
    setSelectVal(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectVal = formData.get("select-name");
    // NIE RADZI SOBIE Z <select multiple={true}>
    console.warn(`handleSubmit SELECT | selectVal=${selectVal}`);
    // ABY WYDOBYĆ <select multiple={true}>
    console.warn(
      `handleSubmit SELECT multiple={true} | selectVal=${Array.from(
        formData.entries()
      )}`
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* select jak inne pola <input> najlepiej niech przyjmuje name  */}
        <label>
          <span>Wybierz coś z selecta</span>
          {/* select może być komponentem kontrolowanym przez podanie 'value' i do tego 'onChange' */}
          <select
            multiple={true}
            size={2}
            name="select-name"
            value={selectVal}
            onChange={handleChange}
          >
            {/* aby zmiana była widoczna w SELECT OPTION muszą mieć atrybuty 'value' */}
            <option value="-1">Default</option>
            {OPTIONS.map((optionEL) => {
              return (
                <option key={optionEL.id} value={optionEL.value}>
                  {optionEL.text}
                </option>
              );
            })}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

// #################################
// #### <progress> Raczej mało przydatne ...
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactDOMComponentsProgress() {
  /*
  bez podania 'max' jego wartośc domyślna to 1 
  */
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span>ROGRASSY</span>
        <progress value={0} />
        <progress value={0.5} />
        <progress value={0.7} />
        <progress value={75} max={100} />
        <progress value={1} />
        {/* ustawienie 'value' na null USTALA STAN <progess> na NIEOKREŚLNY (takie czekanie na otrzymanie danych) */}
        <progress value={null} />
      </div>
    </>
  );
}

// #################################
// #### <textarea>
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactDOMComponentsTextarea() {
  /*
  <textarea> tak samo jak <input> może byc KONTROLOWANE przez atrybut 'value' + 'onChange' (nie może być ZMIENNY W CZASIE)
  --lub jak jest NIEKONTROLOWANY to domyślną wartość można mu nadać przez 'defultValue'

  UWAGA!!! nie można zagniezdzać dzieci !!! <textarea>Some content</textarea> NIE DOZWOLONE
  */
  const [value, setValue] = useState(""); // tak samo jak w <input> value musi być STRING
  //                                          jeżeli jest NULL np: z API to najlepiej `value ?? ''`
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.warn(
      `handleChange TEXTAREA | name = ${name} | value = ${value} | typeof value = ${typeof value}`
    );
    setValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectVal = formData.get("select-textarea");
    console.warn(`handleSubmit TEXTAREA | selectVal = ${selectVal}`);
    const formJson = Object.fromEntries(formData.entries());
    console.log("handleSubmit | formJson = ", formJson);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Textarea - field</span>
          <textarea
            ref={textareaRef}
            name="select-textarea"
            value={value}
            onChange={handleChange}
            style={{
              resize: "none", // służy do uniemożliwienia zmiany wielkości elemntu
            }}
            cols={40} // liczba znaków w szerokości
            rows={1} // liczba widocznych linii tekstu
            // wrap="off" //'hard', 'soft', or 'off'
          />
        </label>
        <button type="submit">Prześlij</button>
      </form>
    </>
  );
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// function ReactDOMComponents() {
//   return <></>;
// }
