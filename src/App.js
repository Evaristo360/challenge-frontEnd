import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const COLORS = ["red", "blue", "yellow", "green", "purple"];

  const addMoveable = async () => {
    // Create a new moveable component and add it to the array
   

    
    const BG_SIZE = ["auto", "contain", "cover", "inherit", "initial", "revert", "unset"];
    const BG_REPEAT = ["repeat", "no-repeat", "repeat-x", "repeat-y"];
    const BG_POSITION = ["bottom", "center", "left", "top", "right", "revert"];

   
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        image: images[Math.floor(Math.random() * images.length)],
        bgSize: BG_SIZE[Math.floor(Math.random() * BG_SIZE.length)],
        bgRepeat: BG_REPEAT[Math.floor(Math.random() * BG_REPEAT.length)],
        bgPosition: BG_POSITION[Math.floor(Math.random() * BG_POSITION.length)],
      },
    ]);
    
  };

  const getDataColor=()=>{
    fetch("https://jsonplaceholder.typicode.com/photos")
    .then((response) => response.json())  
    .then((res) => {
      setImages(res);
    })
    .catch((error) => {
      console.log('Hubo un problema con la petición:' + error.message);
    });
  }

  const deleteItem = (id) => {
    let aux= moveableComponents.slice();
    console.log(moveableComponents);
    const objWithIdIndex = aux.findIndex((obj) => obj.id === id);
    aux.splice(objWithIdIndex, 1);
    console.log(aux)
    setMoveableComponents(aux);
    
  };

  useEffect(() => {
    getDataColor();
  }, []);

  const updateMoveable = (id, newComponent) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };


  return (
    <>
    <button onClick={addMoveable}>Add Moveable1</button>
    <main style={{ height : "100vh", width: "100vw", display:"flex"}}>
     
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            updateMoveable={updateMoveable}
            key={index}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
      <div
        id="listComponents"
        style={{
          height: "80vh",
          width: "20vw",
          margin:20
        }}
      >
        {moveableComponents.map((item, index) => (
          <div
            key={index}
            style={{
              display:"flex",
              justifyContent: "space-around",
              margin:"10 0"
            }}
          >
            Componente {index+1}
            <button onClick={()=>{deleteItem(item.id)}}>Eliminar</button>
          </div>
        ))}
        </div>
      
    </main>
    </>
   
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  image,
  bgSize,
  bgRepeat,
  bgPosition,
  id,
  setSelected,
  isSelected = false,
}) => {
  const ref = useRef();

  let estilo ={}
  if(image){
    estilo.backgroundImage= `url(${image.url})`;
  }else{
    estilo.background= color;
  }


  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          ...estilo,
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          backgroundSize: bgSize,
          backgroundRepeat: bgRepeat,
          backgroundPosition: bgPosition
        }}
        onClick={() => setSelected(id)}
      />
      
      <Moveable
        target={isSelected && ref.current}
        origin={false}
        resizable
        draggable
        bounds={{left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
        onResizeStart={e => {
            e.setFixedDirection([0, 0]);
            updateMoveable(
              id,
              {
                top: e.clientX,
                left: e.clientY,
                width: e.width,
                height: e.height,
                color,
                image
              }
            )
        }}
        onDrag={e => {
            e.target.style.transform = e.transform;
            console.log(e);
        }}
        onResize={e => {
            e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
            e.target.style.transform = e.drag.transform;
            updateMoveable(
              id,
              {
                top: e.clientX,
                left: e.clientY,
                width: e.width,
                height: e.height,
                color,
                image
              }
            )
        }}
        />
    </>
  );
};
