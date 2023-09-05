import './App.css';
import React, { useEffect, useState, useCallback } from 'react';
import ItemCard from './components/ItemCard/ItemCard';
import AddItemCard from './components/AddItemCard/AddItemCard';
import EditItemCard from './components/EditItemCard/EditItemCard';

function App() {
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/products")
      const objData = await response.json();
      setData(objData)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const addItemHandler = async (item) => {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const addData = await response.json();
    console.log(addData);
    fetchUserData();
  }

  const deleteItemHandler = async (productId) => {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'DELETE',
    });
    const deleteData = await response.json();
    console.log(deleteData);
    fetchUserData();
  }

  const editItemCardShow = async (productId) => {
    setIsEdit(true);
    const response = await fetch(`http://localhost:5000/api/products/${productId}`)
    const currentData = await response.json();
    setSingleData(currentData);
    console.log("single pro--->", currentData)
    fetchUserData();
  }

  const editItemHandler = async (productId, item) => {
    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const updateData = await response.json();
    console.log("update pro--->", updateData)
    setSingleData(item)
    setIsEdit(false);
    fetchUserData();

  }

  let content;
  if (isLoading) {
    content = <h3 className='text-center'>Loading...</h3>;
  }

  return (
    <React.Fragment>
      <div className='container my-3'>

        {!isEdit &&
          <div>
            <h1 className='text-center'>Add Mobile Post</h1>
            <AddItemCard onAddItem={addItemHandler} />
          </div>
        }


        {isLoading && <div className='container my-3'>{content}</div>}


        {!isEdit && !isLoading && <div className="row">
          {data.map((data) => {
            return (
              <ItemCard title={data.title} price={data.price} image={data.image} details={data.details} key={data._id} id={data._id} onDelete={deleteItemHandler} onEditShow={editItemCardShow} />
            );
          })}
        </div>}

        {isEdit &&
          <div>
            <h1 className='text-center'>Edit Mobile Post</h1>
            <EditItemCard singleData={singleData} onEditeItem={editItemHandler} />

          </div>}

      </div>
    </React.Fragment>
  );
}

export default App;

