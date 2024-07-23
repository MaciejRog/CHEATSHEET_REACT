import Komponent from "./TEMATY/1_Komponenty/Komponent";
import Interakcje from "./TEMATY/2_Interaktywność/Interakcje";
import ZarzadzanieStanem from "./TEMATY/3_Zarządzanie_Stanem/ZarzadzanieStanem";
import SideEffect from "./TEMATY/4_Side_Effects/SideEffect";

function App() {
  return (
    <>
      <Separator title={"## TEMAT 1 - KOMPONENT"} />
      <Komponent />

      <Separator title={"## TEMAT 2 - INTERAKCJE"} />
      <Interakcje />

      <Separator title={"## TEMAT 3 - ZARZĄDZANIE STANEM"} />
      <ZarzadzanieStanem />

      <Separator title={"## TEMAT 4 - SIDE EFFECTY"} />
      <SideEffect />
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
