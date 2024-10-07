import { useRef } from "react";

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

      <p>---------- EVENTS ----------</p>
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
