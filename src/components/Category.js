import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import db from "../Db";


const Category = () => {
    const [showmodal, setShowmodal] = useState(true)
    const [catinput, setCatinput] = useState('')
    const [catvalue, setCatvalue] = useState([])
    const [catid, setCatId] = useState()
    const [showdelete, setShowdeletemodal] = useState(true)
    const [catimg, setCatimg] = useState()

    //initial load in db
    useEffect(() => {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            setCatvalue(result.rows.filter((d) => d.doc.type === "category"))
        }).catch(function (err) {
            console.log(err);
        });
    }, [catinput, catid])


//create a category in db
    const handleSave = (e) => {
        e.preventDefault();

        const cat = {
            type: 'category',
            name: catinput,
            image: catimg.path,
            created: new Date()
        }

        if (catinput !== '') {
            db.post(cat).then((response) => {
                setCatinput('')
                setCatimg('')
                toast.success('Category created')
            }).catch((err) => {
                setCatinput('')
                setCatimg('')
                toast.error("Something went wrong")
                console.log(err);
            });
        } else {
            toast.error("Category cannot be empty")
        }

    }

    //delete category in db
    const handleDelete = () =>{
        setTimeout(() => {
            db.get(catid).then((doc) => {
                return db.remove(doc._id, doc._rev);
              }).then(function (result) {
             toast.success("Category deleted")
             setCatId('')
            }).catch(function (err) {
                console.log(err);
                toast.error("Something went wrong")
                setCatId('')
              });
        }, 300);
       
    }
    return (
        // main section
        <div className="border" style={{ height: '80vh', overflowY: 'scroll' }}>
            <Toaster />
            <div style={{ marginLeft: '80%' }}>
                <button
                    onClick={() => setShowmodal(!showmodal)}
                    className="btn btn-primary m-2">Create category</button>
            </div>
            <h2 className="text-center">Category List</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Category name</th>
                        <th scope="col">Category image</th>
                        <th scope="col">Created date</th>
                    </tr>
                </thead>
                <tbody>
                    {catvalue && catvalue.sort((a,b) => new Date(b.doc.created) - new Date(a.doc.created)).map((d,i) => 
                        <tr key={i}>
                            <th scope="row">{i+1}</th>
                            <td>{d.doc.name}</td>
                            <td><img style={{height:'120px', width:'150px'}} alt={d.doc.name} src={d.doc.image}/></td>
                            <td>{new Date(d.doc.created).toLocaleString()}</td>
                            <td><button
                            onClick={(e) =>{    
                                e.preventDefault()
                                setCatId(d.doc._id)
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
                style={{ width: '350px', height: '250px', position: 'absolute', left: '40%', top: '30%', borderRadius: '10%' }}>
                <div className="p-5">
                    <input value={catinput} onChange={(e) => setCatinput(e.target.value)}
                        className="form-control mb-2" placeholder="Category name" />
                    <label className="form-label">Category image</label>

                    <input defaultValue=''
                    onChange={(e) =>setCatimg(e.target.files[0])} className="form-control" type="file" />
                    <div className="mt-4 ms-3">
                        <button
                            onClick={(e) => {
                                handleSave(e)
                                setShowmodal(!showmodal)
                            }}
                            className="btn btn-success p-2 m-2">Create</button>
                        <button
                            onClick={() => {
                                setCatinput('')
                                setCatimg('')
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
                                setCatId('')
                                setShowdeletemodal(!showdelete)
                            }}
                            className="btn btn-danger p-2 m-2">No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category;