import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

function SideEffect() {
  return (
    <div>
      <SideEffectRefs />
      <SideEffectEffect />
      <SideEffectEffectNotNeeded />
      <SideEffectLifecycle />
      <SideEffectSepracjaEventowOdEffectow />
      <SideEffectRemovingDependencies />
      <SideEffectCustomHook />
    </div>
  );
}

export default SideEffect;

// #################################
// #### 1) REFS - śmiatnik na wszystko (bardzo użyteczny)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

const refArrayLi = [1, 2, 3];

function SideEffectRefs() {
  /*
                                                  REF         vs      STATE
  przechowuje między re-renderami                 tak                 tak
  zmiana wartości powoduje re-render              NIE                 tak
  Wartość używana do RENDEROWANIA                 NIE                 tak
  MUTTABLE                                        tak                 NIE


  REF -> pozwala zapamiętać jakąś wartość pomiędzy rerenderami, (ALE jej zmiana NIE WYWOŁUJE RERENDERU)
  (jest to trochę taki STATE, ale bez używanego settera)

  REF TO NAJLEPSZE MIEJSCE BY PRZECHOWAĆ:
    -- timeout / inteval
    -- referencje do DOM ( w celu - focus, scrolowanie, wymiary, położenie itp...)[wartości dostępno dopiero od fazy COMMIT (po RENDER)]
    -- wartość nie wymagane podczas RENDEROWANIA
        
  Struktura, każdy ref jest OBIEKTEM, który wygląda tak:
    {
      current: any    // dowolna wartość (string. object, function, ...)
    }
  */

  // Tworzenie referencji poprzez HOOK 'useRef' i wartość inicjalna tutaj null
  const timeRef = useRef(null);
  const domRef = useRef(null); // UWAGA!!! Bardzo uważać na DOM ->
  //                                        najelepiej NIGDY NIE 'USUWAĆ', "PRZEMIESZCZAC", 'DODAWAC" elementów, którymi zarządza JSX
  //                                        jeśli JSX zwraca np: zawsze pusty <div></div> to w nim coś można podziałać, ale po za NIE
  const domListRef = useRef(null); // Ref do obsłużenie DYNAMICZNEJ listy referencji do DOM
  const componentRef = useRef(null);
  const ograniczeniaRef = useRef(null);

  // UWAGA TO BĘDZIE opisane później (póki co wiecmy, że pozwala na zarządzanie cyklem życia komponentu i SIDE-EFFECTAMI)
  useEffect(() => {
    return () => {
      // UWAGA!!! przy pracy z 'timeout' i 'interval' zawsze zwracać ich czyszczenie (na chwilę przed zniszczeniem komponentu)
      clearTimeout(timeRef.current);
    };
  }, []);

  // funkcja pomocnicza do obsługi DYNAMICZNEJ listy referencji do DOM
  function getDomList() {
    if (!domListRef.current) {
      // Zamiast przechowywać referencję do DOM będziemy mieć mapę, która będzie posiadała budowę 'klucz' => referencje do DOm
      domListRef.current = new Map();
    }
    return domListRef.current;
  }

  function handleClickBtn() {
    // dostęp do danych przechowywanych wewnątrz REF jest poprzez 'ref.current'
    // MOŻNA ustawić to na DOWOLNĄ WARTOŚĆ jaką chcemy (możemy ją nadpisywać JEST MUTABLE)
    // UWAGA - nie ustawiać i nie czytać wartości 'ref.current' w głównym nurcie renderowania (traktować jak side-effecty)
    timeRef.current = setTimeout(() => {
      console.warn("TIMEOUT POLECIAŁ");
      clearTimeout(timeRef.current);
    }, 1000);
  }

  function handleClickSpan() {
    // jeśli nie ma takiego obiektu w DOM (np: zostanie usunięty) to będzie 'null'
    if (domRef.current) {
      // w przypadku REF do DOM, mamy obiekt, którym możemy sterować tak jak w przypadku 'document.querySelector'
      domRef.current.innerText = "Nowy Text";
    }
  }

  return (
    <>
      <button onClick={handleClickBtn}>Ustaw Timeout</button>
      {/* Aby przekazać REF do DOM -> musimy nadać ATRYBUT 'ref' dla elemenetu HTML */}
      <span ref={domRef} onClick={handleClickSpan}>
        ABC
      </span>
      <ul
        onClick={() => {
          console.log("MAP REF LIST REF = ", domListRef.current);
        }}
      >
        {refArrayLi.map((el) => {
          return (
            //           uwaga do ref możemy też przekazać funkcję, która przyjmuje jako argument (node) - referencje do DOM obiektu
            //           takie funkcje nazywają się 'callback'
            <li
              key={el}
              ref={(node) => {
                const map = getDomList();
                if (node) {
                  // dla danego 'key' posiadamy 'referencję' :)
                  map.set(el, node);
                } else {
                  map.delete(el);
                }
              }}
            >
              {el}
            </li>
          );
        })}
      </ul>
      {/* UWAGA !!! takiej referencji nie da się przekazać dla KOMPONENTU, potrzebny jest specjalny mechanizm 'FORWARD_REF' */}
      {/* TEN NIE DZIAŁA */}
      {/* <SideEffectRefsChild ref={componentRef} /> */}
      {/* TEN DZIAŁA */}
      <SideEffectRefsChildForward ref={componentRef} />
      <SideEffectRefsChildForwardOgraniczenia ref={ograniczeniaRef} />
    </>
  );
}

//                              ref otrzymujemy jako 2 argument za 'props' WYMAGA 'forwardRef' aby działało
function SideEffectRefsChild(props, ref) {
  console.log("Puste props = ", props);

  function handleClick() {
    if (ref?.current) {
      ref.current.innerText = "Działa Ref w Komponencie";
    }
  }

  return (
    // to jest pełny dostęp ze strony REF rodzica do tego komponentu
    <div ref={ref} onClick={handleClick}>
      TEST
    </div>
  );
}

// To jest mechanizm przekazania ref poprzez KOMPONENT - Wykorzystujemy tzw: HigherOrder
// czyli opakowujemy nasz komponent w (funkcję / inny komponent) -> który zarządzi przekazanymi w nim danymi
// ABY DZIAŁAŁO przekazanie 'REF' poprzez komponent do, któregoś z jego elementów muimy go opakować w funkcję 'forwardRef'
// 'forwardRef' zwraca NOWY KOMPONENT
const SideEffectRefsChildForward = forwardRef(SideEffectRefsChild);

const SideEffectRefsChildForwardOgraniczenia = forwardRef(
  function SideEffectRefsChildOgraniczenia(props, ref) {
    const domRef = useRef(null);
    // możemy ograniczyć dostęp rodzica do DOM komponentu poprzez HOOK 'useImperativeHandle'
    // pozwa na określić co chcemy aby zostało przekazane do 'ref' wewnątrz rodzica (ogarniczenie na properties, funkcje itp...)
    // tutaj do 'ref' przekazujemy wyłącznie funkcję DOM 'focus'i nic więcej, 'ref' nawet CSS'ów nie zobaczy ;)
    // więc tak na prawdę OKREŚLAMY jaką wartośc ma mieć dany 'ref'
    // tutaj akturat będzie to obiekt z property 'focus', które jest funkcją
    useImperativeHandle(ref, () => {
      return {
        focus() {
          domRef.current.focus();
        },
      };
    });
    // a faktyczną referencję na obiekt trzyma wewnętrzna referencja 'domRef', do której rodzic nie ma dostępu
    return <div ref={domRef}></div>;
  }
);

/*

UWAGA !!! Aby wykonać fajnie nasze operacje na DOM z użyciem REF, ale w odpowiedzi na rerender trzeba coś zrobić:
  1) 'flushSync' => wymuszenie aktualizacji DOM przy rerenderze w sposób synchroniczny!!!!

    flushSync(() => {     // opakowujemy settery STANU w to -> przez co stają się synchroniczne [wykonają się na tychmiast]
      setStan(...)
    })
    //...np: operacje na DOM poprzed REF  -- z już nowymi wartościami 

  2) zareagowanie dopiero poprzez useEffect - który w tablicy zależności ma stan na zmianę, którego chcemy zareagować 
          opisane później
*/

// #################################
// #### 2) EFFECTS
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectEffect() {
  /*
		nowy HOOK 'useEffect' -> bardzo potęzny, ale uwazać aby go nie naduzywać 
		EFFECT pozwalają na WYKONYWANIE:
			- Side effectów
			- synchronizację z zewnętrznymi systemami
		
		PRZYPOMNIENIE:
			RENDEROWANIE) -> wszystkie elementy w głównym bloku komponentu muszą być PURE (zwracać ten sam wynik przy takich samych danych wejściowych)
											brać 'props' i 'state' i na ich podstawie (np: transformacji/modyfikacji) zwracać JSX
			EVENT HANDLERS) -> funkcje zagniezdzone w głównym bloku (głębszy poziom bloku) komponentu - które wykonują czynności nie związane z renderem np:
													- rządania HTTP (fetch)
													- nawigacje do innych ekranów 
													- obsługę Eventów np: 'kliknięć' itp...
		
		EFFECTY - to SIDE-EFFECTY które są wywoływane przez RENDEROWANIE !!!!
						- UWAGA !!! EFFECTY są wywoływane na koniec FAZY COMMIT  (po tym jak ekran zostanie ZAKUTALIZOWANY)
						- idealne do wyjścia poza Reacta i SYNCHRONIZACJI z ZEWNĘTRZNYMI SYSTEMAMI (np: HTTP, operacje na REF, BrowserAPI,  zewnętrzne biblioteki itp...)
						- działają w DOMKNIECIU (CLOUSER) - wieć wartości w EFFEKCIE są zalezne od Wartości w danym RENDERZE
		*/
  const [stan, setStan] = useState(1);

  // Deklaracja EFFECTU poprzez HOOK 'useEffect',
  // 1- argument  funkcja do wywołania
  useEffect(() => {
    // tutaj mamy tylko 1 argument | funkcja wykona się po kazdej fazie COMMIT (po wproawdzeniu zman na ekran), która objemuje komponent
    // czyli react czeka z wykonanie kodu podanego tutaj, az zmiany pojawią się na ekranie
    // (bardzo rzadko uzywamy efectów bez 2-go argumentu ) - powinien się wykonywać tylko wtedy gdy naprawdę musi
    //
    // najlepsze miejsce np: do modyfikacji DOM poprzez REF, które mają się wykonać automatycznie
    // synchronizować z innymi bibliotekami np: z jQuery
    /*
			#################
			UWAGA !!! Bardzo uwazać na NIESKONCZONE PETLE (infinite loop)
					useEffect(() => {
						setStan(prev => stan + 1)				// wywoła nieskończoną pętle
																						// bo nie mamy tablicy zalezności 
																						// a zaktualizowanie stanu -> powoduje rerender -> który wywoła commit -> wywoła EFFECT -> zmieni stan -> ...
																						// aby zaktualizowanie stan musim dodać do TABLICY ZALEZNOSCI setter stanu (funkcja ze stała referencję)
																						// ALE NIE SAM STAN, który zmieniamy
					});
			*/
  });

  // PEŁNY ZAKRES FUNKCJONALNOŚCI
  // 1- argument (funkcja, która ma się wywołać na INICJALNYM RENDERZE oraz gdy zmienią się wartości podane w 2-m argumencie )
  // 2- argument (TABLICA ZALEŻNOŚCI), (moze być pusta lub zawierać stan, props, setteryStanu, inne zmienne itp..)
  //						jeśli jakakakolwiek wartośc się zmieni (lub jej referencja) to funkcja z 1-go argumentu się WYWOŁA ponownie)
  //						react porównuje ze sobą elementy z TABILCY ZALEZNOŚCI poprzez 'Osbject.is'
  useEffect(() => {
    // Opcjonalne mozemy zwrócić tzw' CLEANUP FUNCION - wykonuje się gdy:
    //	-) tuz przed URCHOMIENIEM EFFEKTU (tak dokładnie przed funkcja w useEffect(() => {...przedTym...}))
    // 	-) przy UNMOUNT (odmontowaniu - usunięciu ) KOMPONENTU
    return () => {
      // idealna do wprawdzenia czyszczenia np:
      // -- wyczyszczenie timeoutów np: clearTimeout / clearInterval
      // -- zatrzymanie zmian / odłączenie od serwisów / odsubskrypowanie
      // -- wyłączenie animacji
      // -- itp..
    };
    // tablica zalezności musi posiadać:
    // -) WSZYSTKIE props, state, funkcje (tez settery - te mozna omijać) [OGOLNIE to wszystko co jest uzywane wewnątrz funkcji z argumentu 1 !!!!]
    // 																									co pochodzi z poza zakresu tej funkcji i jest w ramach zakresu KOMPONENTU
    //																									+ to co SAMI CHCEMY ABY WYWOŁAŁO EFFECTs
    //																									UWAGA !! nie wymaga 'REF' - react gwarantuje, ze zawsze jest to ten sam obiekt
    //																												to samo jest z 'SETTERAMI_STANU' -> mozna omijać zalezy od konfuguracji ESLINT'a\
    //																												OMIJAC MOZNA TYLKO STABLINE WARTOŚCI (np: ref z forwardRef nie jest stabilne)
    // -) o tym co jest potrzebne pięknie podpowiada nam ESLINT
  }, []);

  useEffect(() => {
    console.warn("STAN SIE ZMIENIŁ teraz wynosi STAN = ", stan);
    // funckja wywoła się:
    // 1) po inicjalnym renderze Komponentu (MOUNT -> PIERWSZE mojawienie się komponentu na ekranie)
    // 1a) podczas DEVELOPMENTU - na MOUNT useEffect wywołują się 2 razy (przez komponent <StrictMode>) <-- najlepiej tak zostawić
    //					jest to celem sprawdzenia czy nie ma bugów  związanych z czyszczeniem po EFFECTACH
    //					Dlatego tez React w <strictMode> najpierw dodaje i montuje (MOUNT) komponent i od razu go udmontowuje (UNMOUNT) i montuje ponownie
    //					pozwa nam to na sprawdzenie czy EFFECT, które wymagają sprzątania są sprzątane
    //					przy budowaniu Paczki produkcyjnej REACT SIE TEGO POZBYWA i bedzie wywołanie tylko 1 RAZ
    // 2) za kazdym razem gdy referencja do 'stan' się zmieni (dla typów prostych jest to zmiana wartości, dla obiektów nowy obiekt się pojawi)
  }, [stan]);

  function handleCLick() {
    setStan((prev) => prev + 1);
  }
  return (
    <div>
      <button onClick={handleCLick}>Zwiększ o 1 | wartość = ${stan}</button>
      <SideEffectEffectDevelopment />
    </div>
  );
}

/*
####################
## Jeśli chcemy aby coś się wykonało tylko 1 RAZ
to musimy to wyrzucić przed komponentem :)
najlepiej przed 'App'dsa
*/

function SideEffectEffectDevelopment() {
  /*
	##########################
	## WIDGETS -> zewnetrzne elementy UI (nie napisane w Reactie)
	VVVVVVVVVVVVV
	*/
  useEffect(() => {
    /* np: WIDGET dialog -> i chcemy go urudzomic od razu (ale aby pokazać DIALOG to musi on być zamknięty, bo inaczej zwróci BŁAD)
			const dialog  = dialogRef.current;
			dialog.showModal();
			*/
    return () => {
      /* dialog wymaga zamkniecia aby mogl sie ponownie otworzyc -- daltego wymusimy zamkniecie na czyszczenie
				dialog.close();
					*/
    };
  }, []);

  /*
	##########################
	## EVENTY 
	VVVVVVVVVVVVV
	*/
  useEffect(() => {
    // deklarujemy funkcje do obslugi event, aby na podstawie jej referencji móc ją później usunąć
    function handleScroll(e) {
      console.warn("e = ", e);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      // JEŚLI DODAJEMY 'event listenera' nie zapomnijmy go usunąć
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
	##########################
	## ANIMACJE CSS
	VVVVVVVVVVVVV
	*/
  useEffect(() => {
    const el = document.querySelector("h1");
    el.style.opacity = 1; // uruchomienie ANIMACJI
    return () => {
      el.style.opacity = 0; // powrót do wartości WYJSCIOWEJ
    };
  }, []);

  /*
	##########################
	## FETCH (rządanie HTTP) -- UWAGA, NAJLEPIEJ KORZYSTAC Z ZEWNETRZNYCH BIBLIOTEK (w ostatecznosci w Effecie)
	VVVVVVVVVVVVV
	*/
  useEffect(() => {
    const abortController = new AbortController();
    // LEPSZE sa zewnetrzne biblioteki - zapewniaja bezpieczenstwo oraz mechanim CACHOWANIA odpowiedzi
    /*
			OGOLNIE ZAMIST klasycznego 'fetch' lepiej stosować:
			- rządania HTTP z frameworków REACTOWYCH (Next.js)
			- ZEWNETRZNE BIBILIOTEKI:
						- React Query
						- useSWR
						- React Router 6.4+
			- własne rozwiązania, które obsługują
				'duplikowane rządania', 'cachowanie odpowiedzi' 'wstepnego pobierania tzw; prefetching' itp...
			*/
    fetch("https://swapi.dev/api/people/1/", {
      abort: abortController.signal,
    })
      .then((res) => {
        // console.log("FETCH RES = ", res);
        return res.json();
      })
      .then((data) => {
        console.log("FETCH DATA = ", data);
      })
      .catch((err) => {
        console.log("FETCH ERROR = ", err);
      });

    return () => {
      // rządania HTTP musimy przerywać -- za pomocą AbortController
      abortController.abort();
    };
  }, []);

  /*
	#############
	## DANE ANALITYCZNE 
	VVVVVVVVVVVVV
	*/
  useEffect(() => {
    // logAnalitics()
  }, []);

  /*
	#############
	##
	VVVVVVVVVVVVV
	*/
  useEffect(() => {}, []);

  return <></>;
}

// #################################
// #### 3) EFFECT NIE SA ZAWSZE POTRZBENE
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectEffectNotNeeded() {
  /*
	NIE POTRZBUJESZ useEffect ABY:
	-) Zmienić dane (transform / map) do renderowanie
	-) obsłuzyć eventy uzytkowników

	EFFECTY mają:
	-) SYNCHRONIZOWAC zewnętrzne elementy ze STANEM komponentów
	-) POBIERAĆ DANE
	-) UWAGA !!! CZASEM JEST TEZ UZYTECZNE ABY AKTUALIZOWAC STAN NA BAZIE 'KILKU" STNAOW
	//						UWAGA !!! NIE robić REDUNDANCJI!!! - mając IMIE i NAZWISKO nie potrzebny jest stan PELNE_IMIE	
	*/

  // PRZY UZYWANIU EFFECTOW PAMIETAJMY ZE:
  // - EFFEKTY wywołują sie po MOUNT (pokazaniu komponentu na ekranie)
  //			-- wiec ustawienie w nich stanu (na bazie np: zmiany props) spowoduje rerender,
  //					gdzie 1 wywołał się ze starą wartościa props, a 2 ze zmianami na bazie nowej
  //					DLATEGO ZAWSZE LEPIEJ jest wyrzucić takie zmiany do :
  //								-- fazy renderowania
  //								-- Event handlersów
  //												gdy ustawiamy wiele stanów w 1 funkcji to REACT (BATCHUJE setteryStanów)
  //												DZIEKI TEMU MAMY TYLKO 1 RERENDER - ustawiajac wszystkie stan w 1 odświezeniu

  // ZASADY:
  /*
	-) jesli coś mozna wyliczyć w fazie RENDER to tak zróbmy, bez useEffect
	-) aby cachować drogie w obliczeniach operacje uzyjmy 'useMemo' -> o tym później
	-) by zresetować STAN CAŁEGO KOMPONENTU zmieńmy jego 'key' 
	-) by zresetować CZĘŚĆ STANU KOMPONENTUY zróbmy to fazie RENDER zapisując poprzednią wartość PROP (ostatecznie Effect)
	-) TO CO MA SIĘ WYKONAĆ PRZY WYŚWIETLENIU KOMPONENTU jest w 'useEffect' -> reszta Side-effect w EVENT HANDLERSACH
	-) Aktualizowanie stanu KILKU komponentów -> najlepiej zrobić w POJEDYNCZYM EVENT HANDLERZE
	-) chcesz synchronizować stan w ROZNYCH komponentach -> Wynieś go do wspólnego RODZICA
	-) CHECZ mieć FETCH (HTTPS) w 'useEffect'
					-- rozwaz gotowe biblioteki
					-- gotowe rozwiazania z frameworkow
					-- napisz walsny useFetch (pamietaj o cachowaniu i czyszczeniu (CLEANUP FUNCION))
											CLEANUP FUNCION -> jako np: AbortController | zapobiega tzw Race condition
																				 czyli sytuacji wywołania wiele razy tego samego zapytania HTTP
																				 i nie wiedzy, w której kolejności się wykonaja i jaki będzie rezultat
																				 np: przy pobieraniu listy 'option' dla tagu 'select' 
																				w odpowiedzi na wpisywany tekst uzytkownika
																				jak wpisze 'czesc' -> fetch wywola się 5 razy !!!
																				dla 'c' 'cz' 'cze' 'czes' 'czesc' ->  i bez CLEAN UP nie mamy pewnosci, ktory 
																				wykona sie ostatni i jaki stan ustawi 
	*/

  const [firstName] = useState("Aga");
  const [lastName] = useState("Maciek");
  const fullName = `${firstName}${lastName}`; // wartość mozna wyliczyc w fazie RENDER, STAN NIE POTRZEBNY

  return (
    <>
      {fullName}
      <SideEffectEffectNotNeededStateReset userId={123} key={123} />
      <SideEffectEffectNotNeededDostosowanieWartociPrzezProps age={29} />
      <SideEffectEffectNotNeededZeroChainEffectow />
    </>
  );
}

function SideEffectEffectNotNeededStateReset({ userId }) {
  /*
    useEffect(() => {
        // resetowanie stanu
    }, [userId]);			// <<--- bardzo złe podejście i na prawdę nie wymagane 
											// zamist useEffect z RESETOWANIEM stanu KOMPONENT powienien dostać atrybut 'KEY'
		*/
  return <>{userId}</>;
}

function SideEffectEffectNotNeededDostosowanieWartociPrzezProps({ age }) {
  const [stan, setStan] = useState("Aga");
  const [prevAge, setPrevAge] = useState(age); // przechowywanie poprzednich wartość z PROPS w STANIE
  //																							jest lepsze niz zmiana przez useEffect [w ostatecznosci mozna :)]
  if (age !== prevAge) {
    //																					a dostosowanie wartości juz w fazie renderowania
    setPrevAge(age);
    setStan("Agusia");
  }
  return <>{stan}</>;
}

function SideEffectEffectNotNeededZeroChainEffectow() {
  // UWAGA !!! NIGDY NIE ROBIC ZALEZNOSCI, ZE 1 EFFECT WYWOLUJE 2, 3 itp... !!!!!
  // Starsznie spowalnia i powoduje MASE NIEPOTRZBNYCH RERENDEROW
  /*
    console.warn("WYWOŁANE");
    const [stan1, setStan1] = useState(1);
    const [stan2, setStan2] = useState(1);

    useEffect(() => {
        setStan1((prev) => prev + 1);
    }, []);

    useEffect(() => {
        setStan1((prev) => prev + 1);
    }, [stan1]);

    useEffect(() => {
        console.warn("TUTAJ");
    }, [stan2]);
		*/

  // Wyliczac takie ciągi w fazie renderowania ORAZ w Event-handlersach

  return <></>;
}

// #################################
// #### 4) LIFECYCLE (CYKL ŻYCIA)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectLifecycle() {
  /*
  EFFECTY mają inny cykl życia niż komponenty.
  DLATEGO NIE MOŻEMY UTOŻSAMIAĆ CUKLUŻYCIA KOMPONENTU Z EFFECTAMI (to są 2 różne cykle!!!)

  CYKL ŻYCIA KOMPONENTU:
    1) MOUNT -> zamontowanie komponentu (Jego dodanie na ekran)
    2) UPDATE -> Wywołanie RERENDERU i COMMITU (przez zmianę PROPS lub STATE)
    3) UNMOUNT -> odmontowanie komponentu (Jego usunięcie z ekranu)
  
  CYKL ŻYCIA EFFECTU [może powtarzać się wiele razy - zależnie od tablicy zależności i zmian w STATE i PROPS]
    1) SYNCHRONIZACJA Z CZYMŚ (wywołanie na MOUNT komponentu i każdy UPDATE (który dotyka tablicy zależności - zmienia wartości / referencje))
    2) CLEANUP - KONIEC SYNCHRONIZACJI (wywołanie na UNMOUNT i przed rozpoczęcieciem SYNCHRONIZACJI)

  synchronizacja (cykl życia efektu), zależy od reaktywnych wartości przekazanych w tablicy zależności.
  REAKTYWNE WARTOŚCI -> props, state i inne wartości wewnątrz komponentu (wyliczane podczas RENDEROWANIE i biorące udział w przepływanie danych)
                                              zmienne i funkcje (z top-levelu komponentu)
                                              
  UWAGA!!! NIE WSZYSTKO MOŻE BYĆ ZALEZNOŚCIĄ!!!!
            MUTABLE VALUE, NIE MOGĄ BYĆ !!!! 
            MUTABLE VALUES (wraz ze zmiennymi globalnymi) NIE SĄ REAKTYWNE -> czyli takie zmienne, których zmiana nie wywołuje RERENDERINGU

                  np: location.pathname (z 'window') -> zmian nie wywoła re-renderowania [oraz zniszczy 'PURE' komponentu]
                                                   bo odczytamy mutable data podczas fazy renderowania (w niej jest wyliczana tablica zależności)
                      ref.current -> zmian nie wywoła re-renderowania
  
  UWAGA!!! 
            STABLE VALUE NIE SĄ REAKTYWNE -> np: 'ref', 'setStan' React dba o to, że zawsze będą to te same referencje 
            STABLE -> mogą być w tablicy zależności (ale efekt jest taki jakby ich tam nie było)

  W TABLICY ZALEŻNOŚCI, ZAWSZE MUSZĄ BYĆ WSZYSTKIE 'REAKTYWNE WARTOŚCI', których effect używa:
    czasem może to powodować błędy, które można rozwiązać poprzez:
      -) wydzelenie wielu efektów [każdy na osobny temat synchronizacji]
      -) unikać OBIEKTÓW i FUNKCJI w tablicach zależności (zawsze będą miały nową referencję i wywołają EFEKT przy RERENDERINGU)
                trzeba stosować 'useMemo' dla OBIEKTÓW i 'useCallback' dla FUNKCJI
  */
  return <></>;
}

// #################################
// #### 5) ODZIELENIA EVENTÓW OD EFEKTÓW 'useEffectEvent'
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectSepracjaEventowOdEffectow() {
  /*
  EVENTY -> wywołane przez INTERAKCJE [wymagają MANUALNEJ INGERENCJI] (np: click, scroll itp...)
            logika wewnątrz EVNETÓW jest NIE REAKTYWNA
  EFFECTY -> wywołane przez ZMIANĘ REAKTYWNEJ WARTOŚCI [wykonywane poniekąd jako AUTOMATYCZNE] (np: prop, state)
              logika wewnątrz EFFEKTÓW jest REAKTYWNA
  UWAGA!!!
    może być sytuacja gdy chcemy wywoływać jakieś zdarzenie w EFFEKCIE bazujące na REAKTYWNEJ WARTOŚCI, ale nie chcemy 
    aby zmiana tej wartości powodowała ponowne wywołanie EFFEKTU (czyli aby można z niej było skorzystać w EFFEKCIE bez podania jej
    w tablicy zależności tego efektu)

  DO TEGO WPROWADZONO NOWY HOOK 'useEffectEvent' 
    UWAGA na stan '2024.07.23' jest w fazie EKSPERYMENTALNEJ (nie dostępny póki co - dlatego poniższy kod jest zakomentowany)
  */

  /*
  const [stan] = useState(123);
  const [event] = useState("ABC");

  // hook 'useEffectEvent' -> służy do przeniesienie NIE REAKTYWNEJ logiki z 'useEffect'
  const onEvent = useEffectEvent(() => {  // może otrzymać argumenty (które zostaną dostarczone z poziomu wywołanie w Efekcie)
    //... tutaj funkcja do wywołania, która nie wywoła ponownie effektu (mimo iż bazuje na reaktywnych wartościach)
    // logika wewnątrz jest NIE reaktywna i ma dostęp do najnowszych wartości state i props
    // jako iż 'onEvent' jest NIE reaktywny to nie musi być podany w tablicy zależności
    // MOŻNA myśleć o 'EFFECT EVENTACH' jako o 'EVENT HANDLERSACH' 
    // gdzie: 
    //      'EVENT HANDLERS'  => wywołany na interakcję użytkownika
    //      'EFFECT EVENT'    => wywołany autmatycznie przez Efekt

    // OGRANICZENIA !!!!
    //   -- useEffectEvent -> WYWOŁUJEMY TYLKO w useEffect
    //   -- ZAKAZ przekazywanie 'useEffectEvent' do inncyh komponentów lub 'hooków'
    
    console.warn("EVENT TO = ", event);
  });

  useEffect(() => {
    console.warn("STAN TO = ", stan);
    onEvent();
    //  efekty wywoła się przy każdej zmianie 'stan', ale NIGDY przy zmianie 'event' -> mimo iż wykorzystujemy tą reaktywną zmienna w effect evencie
  }, [stan]);
  */

  return <></>;
}

// #################################
// #### 6) USUWANIE 'EFFECT DEPENDENCIES' - TABLICA ZALEŻNOŚCI
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectRemovingDependencies() {
  /*
  LINTER (np: ESLINT) dba o to aby w tablicy zależności były wszystkie wykorzystywane w EFFEKCIE 'REAKTYWNE wartość'
  REAKTYWNE WARTOŚCI -> to takie, które zmianiają się przy 'RERENDERIUNGU' np: funkcje top-level komponentu, zmienne w top-level itp..

    -> czyli wszystko deklarowane poza komponentem nie jest reaktywną wartościa

  ABY usunąć coś z tablicy zależności, musimy zmodyfikować KOD effectu

  // UWAGA, możemy okłamać LINTERA poprzez poniższy komentarz, ale jest to 'BARDZO NIEBEZPIECZNE'
  '// eslint-disable-next-line react-hooks/exhaoustive-deps' 

  USUWANIE TABLICY w sposób POPRAWNY:
  1) aby usuwać zależności w bezpieczny sposób musimy się zastanowić czy to jest wgl Effect a nie Event
  2) jeśli tak to czy nie robi zbyt wielu rzeczy (rozbić 1 Effect na kilka mniejszych)
  3) Zastosowanie 'useEffectEvent' <- ekseprymentalna funkcjonalność
  4) Unikać 'Obiektów' i 'Funkcji' jako zależności -> przy deklaracji i re-renderze zawsze mają nową referencję 
      albo bazować na prostym property Obiketu, albo użyć 'useMemo' 
      albo bazwoać na wyniku funkcji (gdy są PURE) albo użyć 'useCallback'
      lub wynieść deklarację poza komponent
      lub deklarować wewnątrz Effectu
  */
  return <></>;
}

// #################################
// #### 7) CUSTOM HOOK (Tworzenie własnych hooków)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function SideEffectCustomHook() {
  /*  
  Możemy sami tworzyć hooki 
  POZWALA to na WSPÓŁDZIELENIE LOGIKI między komponentami
      -- UWAGA !!! LOGIKI, a nie STANU !!!  (każda instancja HOOK ma swój własny stan)

  */
  const stanMojHook = useMyHook(true);
  const { stan, stan2 } = stanMojHook;
  return (
    <>
      <p>
        MÓJ HOOK = Stan = {stan} | Stan2 = {stan2}
      </p>
    </>
  );
}

/*
Aby stworzyć hook muismy napisac funkcję od słowa 'use'   np: 'useFetch' 'useDownload' 'useMark' itp...
*/
function useMyHook(isDone = false) {
  /*
  w CUSTOM HOOK możemy działać 1 do 1 jak w komponencie i wykorzystywać inne HOOKIE itp.
  UWAGA!!! Jeśli nie korzystamy z innych hook, to nie róbmy CUSTOM HOOKA tylko zwykłąd funkcję 
  UWAGA!!! Muszą być PURE (myslmy o nich jak o kawałkach komponentów)

  Każdy re-render komponentu, kóry implementuje hook WYWOŁA GO CAŁEGO OD NOWA (więc ma dostęp do najnowszych przekazanych argumentów)
  */
  const [stan] = useState(11);
  const [stan2] = useState(isDone ? "Zrobione" : "Niezrobione");
  useEffect(() => {
    //tylko dla przykładu pokazuję, że mozna ten effecty dodać
  }, []);

  /*
  Natomiast to jest 1-na różnica między KOMPONENT i CUSTOM_HOOK (poza konwencją nazw)
      tutaj ZWRACAMY STAN (reaktywna wartość dla komponentu, który wykorzysta naszego hooka), a nie kod JSX 
      -- ogólnie CUSTOM HOOK mogą zwracać DOWOLNĄ wartość.
  */
  return {
    stan,
    stan2,
  };
}
