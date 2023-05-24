import { useState, useEffect } from "react"
import toast, { Toaster } from 'react-hot-toast';
import db from "../Db"


const Products = () => {
    const [showmodal, setShowmodal] = useState(true)
    const [showdelete, setShowdeletemodal] = useState(true)
    const [productname, setProductname] = useState('')
    const [productcat, setProductcat] = useState('')
    const [productimg, setProductimg] = useState()
    const [prodprice, setProdprice] = useState('')
    const [categorydata, setCategorydata] = useState()
    const [productdata, setProductdata] = useState([])
    const [prodid, setProdId] = useState()

    //initial load in db
    useEffect(() => {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            setProductdata(result.rows.filter((d) => d.doc.type === "product"))
            setCategorydata(result.rows.filter((d) => d.doc.type === "category"))
        }).catch(function (err) {
            console.log(err);
        });
    }, [productname, prodprice, productcat, prodid])

    //create a product in db
    const handleSave = (e) => {
        e.preventDefault();

        const product = {
            type: 'product',
            name: productname,
            category: productcat,
            price: prodprice,
            image: productimg.path,
            created: new Date()
        }

        if (productname !=='' & productcat !=='' & productimg !=='' & prodprice !== '' & productcat !=="None") {
            db.post(product).then((response) => {
                setProductname('')
                setProductcat('')
                setProdprice('')
                setProductimg('')
                toast.success('Product created')
            }).catch((err) => {
                setProductname('')
                setProductcat('')
                setProdprice('')
                setProductimg('')
                toast.error("Something went wrong")
                console.log(err);
            });
        } else {
                setProductname('')
                setProductcat('')
                setProdprice('')
                setProductimg('')
            toast.error("All fields required")
        }

    }

        //delete product in db
        const handleDelete = () =>{
            setTimeout(() => {
                db.get(prodid).then((doc) => {
                    return db.remove(doc._id, doc._rev);
                  }).then(function (result) {
                 toast.success("Product deleted")
                 setProdId('')
                }).catch(function (err) {
                    console.log(err);
                    toast.error("Something went wrong")
                    setProdId('')
                  });
            }, 300);
           
        }

    return (
        <div className="border" style={{ height: '80vh', overflowY: 'scroll' }}>
            <Toaster />
            <div style={{ marginLeft: '80%' }}>
                <button
                    onClick={() => setShowmodal(!showmodal)}
                    className="btn btn-primary m-2">Create product</button>
            </div>
            <h2 className="text-center">Product list</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Product image</th>
                        <th scope="col">Price</th>
                        <th scope="col">Created date</th>
                    </tr>
                </thead>
                <tbody>
                    {productdata && productdata.map((d, i) =>
                        <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{d.doc.name}</td>
                            <td>{d.doc.category}</td>
                            <td><img style={{ height: '120px', width: '150px' }} alt={d.doc.name} src={d.doc.image} /></td>
                            <td>{d.doc.price}</td>
                            <td>{new Date(d.doc.created).toLocaleString()}</td>
                            <td><button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setProdId(d.doc._id)
                                    setShowdeletemodal(!showdelete)
                                }}
                                className="btn text-danger">X</button></td>
                        </tr>
                    )
                    }
                </tbody>
            </table>

            {/* CREATE MODAL */}
            <div hidden={showmodal} className="bg-primary"
                style={{ width: '350px', height: '400px', position: 'absolute', left: '40%', top: '30%', borderRadius: '10%' }}>
                <div className="p-5">
                    <input value={productname} onChange={(e) => setProductname(e.target.value)}
                        className="form-control mb-2" placeholder="Product name" />
                    <input value={prodprice} onChange={(e) => setProdprice(e.target.value)}
                        className="form-control mb-2" placeholder="Product price" />
                    <label className="form-label"> Select Category</label>

                    <select value={productcat} onChange={(e) => setProductcat(e.target.value)} className="form-select mb-2">
                        <option>None</option>
                        {categorydata && categorydata.map((d,i) =>
                            <option key={i}>
                                {d.doc.name}
                            </option>
                        )}
                    </select>
                    <label className="form-label">Product image</label>
                    <input defaultValue=''
                        onChange={(e) => setProductimg(e.target.files[0])} className="form-control" type="file" />

                    <div className="mt-4 ms-4">
                        <button
                            onClick={(e) => {
                                handleSave(e)
                                setShowmodal(!showmodal)
                            }}
                            className="btn btn-success p-2 m-2">Create</button>
                        <button
                            onClick={() => {
                                setProductname('')
                                setProductcat('')
                                setProdprice('')
                                setProductimg('')
                                setShowmodal(!showmodal)
                            }}
                            className="btn btn-danger p-2 m-2">Cancel</button>
                    </div>
                </div>
            </div>


            {/* DELETE MODAL */}
            <div hidden={showdelete} className="bg-primary"
                style={{ width: '300px', height: '200px', position: 'absolute', left: '40%', top: '30%', borderRadius: '10%' }}>
                <div className="p-5">
                    <h4 className="text-center text-danger">Are you sure to delete ?</h4>
                    <div className="mt-4 ms-5">
                        <button  
                            onClick={(e) => {
                                handleDelete()
                                setShowdeletemodal(!showdelete)
                            }}
                            className="btn btn-success p-2 m-2">Yes</button>
                        <button
                            onClick={() => {
                                setProdId('')
                                setShowdeletemodal(!showdelete)
                            }}
                            className="btn btn-danger p-2 m-2">No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;