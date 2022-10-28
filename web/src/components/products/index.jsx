import { GlobalContext } from '../../context/Context';
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import "./style.css"


let Products = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [Name, setName] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState("")
    let [products, setProducts] = useState([]);
    let [toggleReload, setToggleReload] = useState(false);
    let [editProduct, setEditProduct] = useState(null)

    useEffect(() => {

        const getAllProducts = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/products`,
                    method: "get",
                    // withCredentials: true
                })
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setProducts(response.data.data.reverse());
                    // setProducts(response.data.data);

                } else {
                    console.log("error in api call")
                }
            } catch (e) {
                console.log("Error in api call: ", e);
            }
        }
        getAllProducts();

    }, [toggleReload])

    const handleSubmit = (e) => {
        e.preventDefault();

        let productImage = document.getElementById("productImage");
        console.log("fileInput: ", productImage.files);

        let formData = new FormData();
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax


        formData.append("name", Name); // this is how you add some text data along with file
        formData.append("description", Description); // this is how you add some text data along with file
        formData.append("price", Price); // this is how you add some text data along with file
        formData.append("productImage", productImage.files[0]); // file input is for browser only, use fs to read file in nodejs client

        axios({
            method: 'post',
            url: `${state.baseUrl}/product`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            // withCredentials: true
        })
            .then(res => {
                console.log(`upload Success` + res.data);
                setToggleReload(!toggleReload)
            })
            .catch(err => {
                console.log(err);
            })

    }

    let updateHandler = async (e) => {
        e.preventDefault();

        try {
            let updated = await axios.put(`${state.baseUrl}/product/${editProduct?._id}`,
                {
                    name: editProduct.name,
                    price: editProduct.price,
                    description: editProduct.description,
                    code: editProduct.code,
                }
                // {
                //     withCredentials: true
                // }
            )
            console.log("updated: ", updated.data);
            setToggleReload(!toggleReload);
            setEditProduct(null);

        } catch (e) {
            console.log("Error in api call: ", e);
        }

    }

    return (
        <div>
            <h1 className='header' >Form</h1>
            <div className='container'>
                <form className='form' onSubmit={handleSubmit}>
                    Name: <input type="text" name='name' placeholder='name' id='name' onChange={(e) => { setName(e.target.value) }} />
                    <br />
                    Description: <input type="text" name='description' placeholder='description' id='description' onChange={(e) => { setDescription(e.target.value) }} />
                    <br />
                    Price: <input type="number" name='price' placeholder='price' id='price' onChange={(e) => { setPrice(e.target.value) }} />
                    <br />
                    Product Image: <input type="file" name='productImage' id='productImage' accept='image/*'
                        onChange={() => {
                            //// to display images instantly on screen
                            var productImage = document.getElementById("productImage");
                            var url = URL.createObjectURL(productImage.files[0])
                            console.log("url: ", url);
                            document.getElementById("img").innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `
                        }} />

                    <div id="img"></div>
                    <br />

                    <button type='submit'>Submit</button>
                </form>
            </div>

            <hr />

            {(editProduct !== null) ? (<div>

                <h1 className='header'>update form</h1>
                <div className='container'>
                    <form className='form' onSubmit={updateHandler}>
                        Name: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, name: e.target.value }) }} value={editProduct.name} /> <br />
                        Price:<input type="text" onChange={(e) => { setEditProduct({ ...editProduct, price: e.target.value }) }} value={editProduct.price} /> <br />
                        Description:<input type="text" onChange={(e) => { setEditProduct({ ...editProduct, description: e.target.value }) }} value={editProduct.description} /> <br />
                        Code: <input type="text" onChange={(e) => { setEditProduct({ ...editProduct, code: e.target.value }) }} value={editProduct.code} /> <br />

                        <button type="submit" >Proceed Update</button>
                    </form>
                </div>
            </div>) : null}

            <hr />


            <h1 className='header'>Kids_Wishh </h1>
            <div className='main'>
                {products?.map(eachProduct => (
                    <div className='productsListDiv' key={eachProduct?._id}>
                        <div className='product'>
                            <div>
                                <img width="100px" src={eachProduct?.productImage} alt="" />
                                <div><b>{eachProduct?.name}</b></div>
                                <div>{eachProduct?.description}</div>
                                <div>{eachProduct?.price}</div>

                                <br />

                                <button className='delete' onClick={async () => {
                                    try {
                                        let deleted = await axios.delete(`${state.baseUrl}/product/${eachProduct?._id}`,

                                            // {
                                            //     withCredentials: true
                                            // }
                                        )
                                        console.log("deleted: ", deleted.data);
                                        setToggleReload(!toggleReload)

                                    } catch (e) {
                                        console.log("Error in api call: ", e);
                                    }

                                }}>Delete</button>


                                <button className='edit' onClick={() => {
                                    setEditProduct({
                                        _id: eachProduct._id,
                                        name: eachProduct?.name,
                                        price: eachProduct?.price,
                                        description: eachProduct?.description,
                                        code: eachProduct?.code
                                    })
                                }}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>

        </div>
    )
}

export default Products;