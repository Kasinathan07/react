import { useState, useEffect } from "react";
import db from "../Db";
import { toast, Toaster } from "react-hot-toast";


const Pos = () => {
    const [catdata, setCatdata] = useState([])
    const [product, setProduct] = useState([])
    const [productcopy, setProductcopy] = useState([])
    const [cartdata, setCartdata] = useState([])
    //initial load in db
    useEffect(() => {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            setProduct(result.rows.filter((d) => d.doc.type === "product"))
            setCatdata(result.rows.filter((d) => d.doc.type === "category"))
            setProductcopy(result.rows.filter((d) => d.doc.type === "product").filter((d) =>
                d.doc.category === result.rows.filter((d) => d.doc.type === "category")[0].doc.name))
        }).catch(function (err) {
            console.log(err);
        });
    }, [])

    const handleFilter = (name) => {
        setProductcopy(product.filter((d) => d.doc.category === name))
    }

//saving the order finally
    const placeOrder = () =>{
        let order = {
            type:'saleorder',
            data:cartdata,
            created: new Date()
        }

        if(cartdata.length !==0){
            db.post(order).then((res) =>{
                setCartdata([])
                toast.success("Order placed")
            }).catch((err) =>{
                console.log(err)
                toast.error("something went wrong")
            })
        }
    }
    //adding product to the cart, same product clicked multiple times will increment qty
    const handleAdd = (data) => {
       
        if (cartdata.some((a, b) => a.id === data._id)) {
            const cart =  cartdata.map((d, i) => {
                if (d.id === data._id) {
                    return{
                        ...d,
                        qty: d.qty + 1,
                        price: d.price + parseInt(data.price)
                    }
                }else{
                    return d
                }
            })
            setCartdata(cart)
        } else {
            setCartdata([...cartdata, { id: data._id, name: data.name, qty: 1, price: parseInt(data.price) }])
        }

    }


    //remove product from cart

const removeFromcart = (id) =>{
   setCartdata(cartdata.filter((d) => d.id !== id))
}

    return (
        <div className="border" style={{ height: '85vh' }}>
            <Toaster />
            <div className="row ps-3 pt-1" style={{ width: '80vw' }}>
                <div className="col-2 border">
                    <div className="d-flex flex-column flex-wrap" style={{ height: '83vh', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}>
                        <ul className="dcatimg">
                            {
                                catdata && catdata.map((d) =>
                                    <li onClick={() => handleFilter(d.doc.name)}
                                    ><img style={{ width: '80px', height: '80px' }} alt={d.doc.name} src={d.doc.image} /><br />
                                        <h5>{d.doc.name}</h5></li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                {/* Main card section */}
                <div className="col-7 border">
                    <div className="d-flex flex-row flex-wrap">
                        {productcopy && productcopy.map((d) =>
                            <div className="card m-3" style={{ width: "18rem" }}>
                                <img src={d.doc.image} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{d.doc.name}</h5>
                                    <p className="card-text"><strong>&#x20B9;{d.doc.price}</strong></p>
                                    <button onClick={() => handleAdd(d.doc)}
                                        className="btn btn-lg btn-primary">Add</button>
                                </div>
                            </div>

                        )}

                    </div>
                </div>
                {/* Cart section */}
                <div className="col-3" style={{height:'70vh'}}>
                    <div className="d-flex flex-column flex-wrap" style={{height:'70vh'}}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartdata.map((cdata) =>
                                    <tr>
                                        <td>{cdata.name}</td>
                                        <td>{cdata.qty}</td>
                                        <td>{cdata.price}</td>
                                        <td><button onClick={() =>removeFromcart(cdata.id)} className="btn text-danger">X</button></td>
                                    </tr>
                                )}
                                {cartdata.length !==0 &&
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td>{cartdata.reduce((total,number) => total + number.qty, 0)}</td>
                                    <td>{cartdata.reduce((total,number) => total + number.price, 0)}</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <button onClick={() => placeOrder()} className="btn btn-lg btn-primary m-1">Order</button>
                    <button onClick={() => setCartdata([])} className="btn btn-lg btn-danger m-1">Clear</button>
                </div>
            </div>
        </div>
    )
}

export default Pos;