import "./App.css";
import Shape from "./Shape";

function App() {
  const data = [1, 1, 1, 1, 0, 0, 1, 1, 1];
  return (
    <>
      <Shape data={data}></Shape>
    </>
  );
}

export default App;
