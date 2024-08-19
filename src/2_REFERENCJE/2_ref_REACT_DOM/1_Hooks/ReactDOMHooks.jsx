function ReactDOMHooks() {
  return (
    <div>
      <ReactDOMHooksUseFormStatus />
    </div>
  );
}

export default ReactDOMHooks;

// #################################
// #### useFormStatus | informacje o ostatnio przesłanym formularzu
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

function ReactDOMHooksUseFormStatus() {
  /*
  EKSPERYMENTALNY!!!!

  const { pending, data, method, action } = useFormStatus();

    -) pending  | true -> formularz jest przesyłany, false  
    -) data     | obiekt z danymi z pól formularza (FormData interface) lub 'null'
                  DOSTĘP DO DANYCH POPRZEZ MAPĘ z 'name' atrybutów POL  |  <input type="text" name="username"/>   ->    data?.get("username")
    -) method   | 'GET' (domyślne) lub 'POST'
    -) action   | referencja do funkcji przekazanej do argumenty 'action' w <form> lub 'null'

  ZASTRZEZENIA)
    -) do uzycie w komponentach renderowanych wewnątrz <form> ... </form>
    -) UWAGA!!! nie odczyta danych z <form> wewnątrz komponentu który ma 'useFormStatus'
       komponenty korzystające z 'useFormStatus' muszą być wyrenderowane w komponencie rodzica wewnątrz <form>
    -) dane dotyczą tylko najbliższego zagnieżdzonego <form>


  ZASTOSOWANIE)
    -) wyświetlanie info o trwającym przesyle danych




  function Submit() {
    const status = useFormStatus();                             // dostęp do <form> w którym jest zagnieżdżony
    return <button disabled={status.pending}>Submit</button>
  }

  export default function App() {
    return (
      <form action={action}>
        <Submit />                          // <Submit /> zagnieżdżenie w <form> 
      </form>
    );
  }



  */
  return <div></div>;
}

// #################################
// ####
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
