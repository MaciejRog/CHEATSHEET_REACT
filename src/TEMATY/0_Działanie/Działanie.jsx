function Działanie() {
  /*
    w pliku `index.html` mamy tag `<div id="root"></div>`
    to jest nasz punkt startowy w aplikacji określony w pliku `main.jsx`
    w treści `ReactDOM.createRoot(document.getElementById("root")).render(...`
    UWAGA! takich punktów może być więcej 
  */
  return <div></div>;
}

export default Działanie;

// #################################
// #### 1) UI jako DRZEWO   [UI TREE]  oraz MODUŁY jako DRZEWO
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
posiadamy wiele komponentów zagnieżdżonych w sobie, do śledzenia tej struktury React modeluje UI jako DRZEWO (TREE)
pozwala to na zarządzanie RELACJAMI między komponentami, pozwala zrozumieć jak DANE PRZEPŁYWAJĄ wewnątrz apki i jak ją zoptymalizować

UWAGA! Przeglądarka modeluje HTML w (DOM), a CSS w (CSSOM) tak samo MOBILKI
Korzeniem (ROOT) tego drzewa to 'Root komponent' -> Pierwszy wyrenderowany komponent
UWAGA! render tree -> składa się tylko z komponentów, pomija tagi HTML (jest niezalezne od platformy i działa tak samo np: dla MOBILEK)

Drzewo to odzwierciedla JEDNĄ pasę renderowania (przy renderowaniu warunkowym i/lub zmiennych danych drzewo będzie wygladało inaczej)

TOP-LEVEL COMPONENT (to te najbliżej ROOTA), 
    które odziałują na WYDAJNOŚC FAZY RENDEROWANIA wszystkich komponentów pod nim i często są bardzo skomplikowane 
LEAF COMPONENT (najbliżej dołu DRZEWA - bez DZIECI)
    komponenty, które się najcześciej PONOWNIE RENDERUJĄ


DRZEWO ZALEŻNOSCI (MODULE DEPENDENCY TREE)
    - po rozbiću komponentów i logiki w osobne pliku, tworzone są moduły JS, które mogą exportowac KOMPONENTY, FUNKCJIE, ZMIENNE
    - każdy WĘZEŁ (NODE) to MODUŁ, a każda GAŁĄŹ (BRNACH) reprezentuje 'import' do tego modułu
    - KORZENIEM (ROOT) - plik startowy (zawiera komponent ROOT)
    - BARDZO PODOBNE DO RENDER TREE, ale z różnicami:
        - węzły do MODUŁY nie KOMPONENTY
        - modułu nie będące komponentami np: pliki ze zmiennymi i funkcjami także są w drzewie jako moduły (render tree tylko z Komponentów)
        - pomija {pops.children} a REBDER TREE -> uzwglądnia jakie komponenty zostały przekazane w {props.children}

Do budowania paczki produkcjyjnej używany jest BUNDLER -> będzie korzystał z Drzewa zalezności 

*/

// #################################
// #### -) KOMPONENTY - RENDEROWANIE (RENDER) - ZATWIERDZANIE (COMMIT)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*
1) [TRIGGER] Wyołanie żądania o nowy UI
          WYWOŁYWANE PRZEZ:
            - render inicjalny (init render) [wywołanie 'createRoot' na wzkazanym DOM NODE - np <div id="root"></div>]
            - zmianę stanu (komponentu lub któregoś z jego rodziców)

2) [RENDER] dostarczenie gotowego UI do ReactDOM
          react wykonuje (wywołuje) komponenty (funkcje które zwracają kod JSX)
          -- init render (Root component) [wytworzy DOM NODES - np: <h1><section><div> itp..]
          -- rerender (komponent którego stan się zmienił -> co wywołuje wykonanie CHILD COMPONENT)
                                          [sprawdzi co trzeba zmienic w obecnej strukturze DOM - np: zmienic atrybuty, usunąć TAG <h1> dodać TAG <h2>]
          UWAGA !!! Zmiany te nie trafiają jeszcze do DOM przeglądarki
          UWAGA !!! Zawsze PURE -> te same wartości -> ZAWSZE ten sam wynik (bez zmian elementów/zmiennych poza nim)

3) [COMMIT] Zamonotowanie UI w DOM przeglądarki
          -- init render (zastosuje 'appendChild()')
          -- rerender (wykona minimalną wymaganą ilość zmian w DOM by pasował to tego co zwrócił RENDER)
          UWAGA !!! ZMIENIA TYLKO TO CO MUSI jeśli są zmiany w WYNIKU między poprzednim a obecnym RENDEREM

999) [BROWSER PAINT/RENDER] - celowo z numerem 999 - wykonywane automatycznie przez przeglądarkę po fazie 3 

do znajdywania błędów służy 'Strict Mode'
*/

// #################################
// #### -)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*

*/

// #################################
// #### -)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*

*/

// #################################
// #### -)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

/*

*/
