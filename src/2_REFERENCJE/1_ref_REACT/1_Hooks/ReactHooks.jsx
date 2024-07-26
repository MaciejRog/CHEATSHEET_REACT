function ReactHooks() {
  return (
    <div>
      {/* 
    ##########################
    ## FUNKJCONALNOŚCI EKSEPRYMENTALNE
    VVVVVVVVVVVVVVVVVVVVVVVVVV
    */}
      <ReactHooksActionState />
    </div>
  );
}

export default ReactHooks;

//###################################################################################################
//=== FUNKJCONALNOŚCI PRODUKCYJNE
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

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

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

//###################################################################################################
//=== FUNKJCONALNOŚCI EKSEPRYMENTALNE
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// #################################
// #### useActionState [eksperymentalny]
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactHooksActionState() {
  /*
  HOOK używany do Utworzenia Stanu, którego setterem jest akcja formularza 'form action' -> aktualizuje 'state'
  UWAGA !!! może być w 'React Server Component' SERVEROWYCH KOMPONENTENACH

  'React Server Component' ->  pozwala na uaktywnienie formularza zanim JS sie wykona po stronie klienta
  w Client Componentach -> odpowiednik LOKALNEGO STATE komponentu (jak useState)
  */

  /*
  const initState = 1;
  function callback = (prevState, formData) => {
    //...
    return prevState + 1;
  }
  // state -> stan danych w formularzu
  // formAction -> AKCJA z formularz, zamiast 'submit'
  //                dodanie do :
  //                      1) <button formAction={formAction}>
  //                      2) <form action={formAction}>
  // callback -> FUNKCJA do zarządzania stanem (przyjmuje poprzedni stan) oraz wartości z formularza
  //             WYWOŁYWANA gdy 'form' jest SUBMITTED lub klikniemy 'button' z atrybutem 'formAction'
  // initState -> Bazowy stan formularza
  // permalinks -> OPCJONALNY atrybut | URL jako 'string'
  //                unikalny adres URL => dla stron z dynamicznym kontentem | gdy podany to form po submit przeniesie na ten link
  //                MUSIMY zapewnić, że ten sam formularz (z takim samym 'callback' i 'permalinks') jest renderowany na podanym URL
  const [state, formAction] = useActionState(callback, initState, permalinks?)

  return <form>
    <button formAction={formAction}>Callback</button>
  </form>
  */
  return <></>;
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
