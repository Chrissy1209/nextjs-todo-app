import { useState, useEffect, useCallback } from "react";
import styles from '../../style/list.module.css'
import { GetServerSideProps } from "next";
import Link from "next/link";

import db from '../../firebase/clientApp'
import { doc, collection, onSnapshot, deleteDoc, query, getDocs } from "firebase/firestore";

const List = () => {
    const [list, setList] = useState<string[]>([])
    const [id, setId] = useState<string[]>([])

    const getData = useCallback(() => {
        console.log("getData")
        // const gettingData = async () => {
        //     const querySnapshot = await getDocs(collection(db, "List"));
        //     setList([])
        //     querySnapshot.forEach((doc) => {
        //         setList((pre) => [...pre, doc.data().item])
        //         // console.log(doc.id);
        //     });
        // }   
        // gettingData()     
        const q = query(collection(db, "newList"));
        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // console.log(snapshot.docChanges().length) // doc個數
            if (change.type === "added") {
                console.log("New item: ", change.doc.data());
                setList((pre) => [change.doc.data().item, ...pre])
                setId((pre) => [change.doc.id, ...pre])
            }
            if (change.type === "modified") {
                console.log("Modified item: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed item: ", change.doc.data());
            }
          });
        });
    }, [setList])
    
    useEffect(() => {
        getData() 
    }, [getData])
    
    const handleDelete = useCallback((index: number) => {
        const handlingDelete = async () => {
            await deleteDoc(doc(db, "List", id[index]));
        }
        setList((pre) => {
            return pre.filter((item, id) => index !== id)
        })
        handlingDelete()
    }, [setList, id])
    
    return (
        <div>
            {
              list.map((e: string, index: number) => {
                return (
                  <div className={styles.container} key={e+index}> 
                      <Link href={'/todo/' + e}>
                        <p>{e}</p>
                      </Link>
                      <button onClick={() => handleDelete(index)}>刪除</button>
                  </div>
                )
              })
            }
        </div>
    )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [results, setResults] = useState<string[]>([]);

//   const querySnapshot = await getDocs(collection(db, "List"));
//   querySnapshot.forEach((doc) => {
//     setResults((pre) => [...pre, doc.data().item])
//       // console.log(doc.id);
//   });

//   console.log(results)
//   return {
//       props: {
//         results,
//       },
//   };
// };

export default List;
