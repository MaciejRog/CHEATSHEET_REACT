function ZarzadzanieStanem() {
  return (
    <div>
      <ZarzadzanieStanemInput />
      <ZarzadzanieStanemStruktura />
    </div>
  );
}

export default ZarzadzanieStanem;

// #################################
// #### 1) STATE - reagowanie na INPUTY
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemInput() {
  // REACT zapewnia DEKLARATYWNE (declarative) MANIPULOWANIE UI
  /*
  IMPERAKTYWNE  -> dokładne instrukcje do zarządzanie UI, bazując na tym co się dzieje
                  // jak jazda samochodem -> skeć w lewo, prawo i inne instrukcje w danej chwili (nie wiedząc gdzie jedziemy)
                  // imperaktywne -> bo zarządzamy każdym elementem UI z osobna poprzez komendy
  DEKLARATYWNY  -> określamy co chcemy zobaczyć lub ukryć bezpośrednio (a jak to zrobić określa wewnętrznie react)
                  // jak TAXI, gdzie chcemy dojechać i sam nas wiezie
  
  */
  /*
  DEKLARATYWNE PISANIE KODY:
  1) IDENTYFIKACJA KOMPONENTÓW
  2) OKREŚLENIE CO ZMIENIA STAN (co moze go zmieniać) 
      - interakcja użytkownika (kliknięcie, wpisanie z klawiatury)
      - interakcja komputera (np: timeout, odpowiedź z API)
  3) ODZWIERCIEDLENIE STANU jako 'useState'
  4) USUNIĘCIE zbędnych danych stanu
  5) DODANIE event handlersów

 */

  return <></>;
}

// #################################
// #### 2) STRUKTURA STANU
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ZarzadzanieStanemStruktura() {
  /*
  ZASADY STRUKTURY STANU:
  1) GRUPUJ ZALEŻNE STANY
    - jeśli zawsze aktualizuję 2 stany w tym samym czasie to lepiej je połączyć w 1 
    - np: wspólny stan dla formularza
    - np: położenie X,Y elementów / kursora itp...
  2) UNIKAJ SPRZECZNOŚCI STANU
    - unikać sytuacji gdy stany mogą mieć sprzeczne wartości
  3) UNIKAJ NADMIAROWEGO STANU
    - to co można wyliczyć z obecnego STATE lub PROP nie powinno być jako stan tylko zwykła zmienna
    UWAGA !!!
          Kompoenent({color}){
            // GDY zmieni się prop 'color' wartość stanu się nie nadpisze!!! użyteczne tylko dla inicjalizacji stanu wartością 
            const [stan, setStan] = useState(color);
          }
  4) UNIKAJ DUPLIKATÓW
    - cięzko sychnronizować duplikaty więc lepiej ich nie mieć
  5) UNIKAJ BARDZO ZAGNIEŻDŻONYCH STRUKTUR DANYCH
    - bardzo ciężki update (najlepsze są płaskie stuktury)
  */
  return <></>;
}

// #################################
// #### 3)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 4)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 5)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 6)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### 7)
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
