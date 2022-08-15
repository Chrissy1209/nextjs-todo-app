import { useState, useCallback } from "react";
import styles from '../../style/edit.module.css'

import db from '../../firebase/clientApp'
import { collection, addDoc } from "firebase/firestore"; 

const Edit = () => {
    const [note, setNote] = useState('')

    const noteChange = useCallback((e: any) => {
        setNote(e.target.value)
    }, [])

    const handleAddItem = useCallback(() => {
        const handleingAddItem = async () => {
            if(note !== '') {
                // setList((pre) => [note, ...pre])
                try {
                    setNote('')
                    const docRef = await addDoc(collection(db, "List"), {
                        item: note
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        }
        handleingAddItem()
    }, [note])

    return (
        <div className={styles.container}>
            <p>記事：</p>
            <input type="text" value={note} onChange={noteChange}/>
            <br></br>
            <button onClick={handleAddItem}>新增</button>
        </div>
    )
}

export default Edit;