import { useState, useCallback } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../../firebase/clientApp";

import styles from "../../styles/edit.module.scss";

type EditPropsType = {
  userId: string;
};
const Edit = ({ userId }: EditPropsType) => {
  const [note, setNote] = useState("");

  const handleNoteChange = useCallback((e: any) => {
    setNote(e.target.value);
  }, []);

  const handleAddItem = useCallback(async () => {
    if (note !== "") {
      setNote("");
      try {
        const docRef = await addDoc(collection(db, "ToDoList"), {
          item: note,
          status: false,
          userId,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }, [note]);

  return (
    <div className={styles.container}>
      {/* <p>記事：</p> */}
      <input type="text" value={note} onChange={handleNoteChange} />
      <button onClick={handleAddItem}>新增</button>
    </div>
  );
};

export default Edit;
