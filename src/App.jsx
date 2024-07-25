import Komponent from "./1_TEMATY/1_Komponenty/Komponent";
import Interakcje from "./1_TEMATY/2_Interaktywność/Interakcje";
import ZarzadzanieStanem from "./1_TEMATY/3_Zarządzanie_Stanem/ZarzadzanieStanem";
import SideEffect from "./1_TEMATY/4_Side_Effects/SideEffect";
import ReactHooks from "./2_REFERENCJE/1_ref_REACT/1_Hooks/ReactHooks";
import ReactComponents from "./2_REFERENCJE/1_ref_REACT/2_Components/ReactComponents";
import ReactAPI from "./2_REFERENCJE/1_ref_REACT/3_API/ReactAPI";
import ReactDOMHooks from "./2_REFERENCJE/2_ref_REACT_DOM/1_Hooks/ReactDOMHooks";
import ReactDOMComponents from "./2_REFERENCJE/2_ref_REACT_DOM/2_Components/ReactDOMComponents";
import ReactDOMAPI from "./2_REFERENCJE/2_ref_REACT_DOM/3_API/ReactDOMAPI";
import ReactDOMClientAPI from "./2_REFERENCJE/2_ref_REACT_DOM/4_CLIENT_API/ReactDOMClientAPI";
import ReactDOMServerAPI from "./2_REFERENCJE/2_ref_REACT_DOM/5_SERVER_API/ReactDOMServerAPI";

function App() {
  return (
    <>
      {/* 
        #############################
        ## REACT TEMATY
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
      <div>
        <Separator title={"## TEMAT 1 - KOMPONENT"} />
        <Komponent />

        <Separator title={"## TEMAT 2 - INTERAKCJE"} />
        <Interakcje />

        <Separator title={"## TEMAT 3 - ZARZĄDZANIE STANEM"} />
        <ZarzadzanieStanem />

        <Separator title={"## TEMAT 4 - SIDE EFFECTY"} />
        <SideEffect />
      </div>

      {/* 
        #############################
        ## REACT REFERENCJE
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVV
        */}
      <div>
        <Separator title={"## REFERENCJE REACT 1 - HOOKS"} />
        <ReactHooks />

        <Separator title={"## REFERENCJE REACT 2 - KOMPONENTY"} />
        <ReactComponents />

        <Separator title={"## REFERENCJE REACT 3 - API"} />
        <ReactAPI />

        <Separator title={"## REFERENCJE REACT DOM 1 - HOOKS"} />
        <ReactDOMHooks />

        <Separator title={"## REFERENCJE REACT DOM 2 - KOMPONENTY"} />
        <ReactDOMComponents />

        <Separator title={"## REFERENCJE REACT DOM 3 - API"} />
        <ReactDOMAPI />

        <Separator title={"## REFERENCJE REACT DOM 3 - CLIENT API"} />
        <ReactDOMClientAPI />

        <Separator title={"## REFERENCJE REACT DOM 3 - SERVER API"} />
        <ReactDOMServerAPI />
      </div>
    </>
  );
}

export default App;

function Separator({ title }) {
  return (
    <p
      style={{
        marginTop: "40px",
        paddingTop: "24px",
        borderTop: "8px solid black",
        borderBottom: "1px solid grey",
      }}
    >
      {title}
    </p>
  );
}
