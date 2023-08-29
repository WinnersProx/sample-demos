import './App.css';
import DrawingArea from './DrawingArea';

// https://perfect-freehand-example.vercel.app/

function App() {
  
  return (
    <div className="App" >
      <h3>Free hand Drawing Tool</h3>
      <div style={{ border: '1px solid black', height: '50vh', width: '80vw', margin: '0 auto' }}>
        <DrawingArea />
      </div>
    </div>
  );
}

export default App;
