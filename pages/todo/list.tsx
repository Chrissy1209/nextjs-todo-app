import { useState, useEffect, useCallback } from "react";
import styles from '../../styles/list.module.scss'
import { GetServerSideProps } from "next";
import Link from "next/link";

import db from '../../firebase/clientApp'
import { doc, collection, onSnapshot, deleteDoc, query, getDocs, setDoc } from "firebase/firestore";

type listProps = {
  id: string,
  item: string,
  status: boolean
}
const List = () => {
    const [list, setList] = useState<listProps[]>([])

    useEffect(() => {
      const getData = () => {
        const q = query(collection(db, "newList"));
        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // console.log(snapshot.docChanges().length) // doc個數
            if (change.type === "added") {
                console.log("New item: ", change.doc.data());
                setList((pre) => 
                  [{
                    id: change.doc.id,
                    item: change.doc.data().item,
                    status: change.doc.data().status
                  }, ...pre]
                )
            }
            if (change.type === "modified") {
                console.log("Modified item: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed item: ", change.doc.data());
            }
          });
        });
      }
      getData() 
  }, [])

  //-----

    const handleAchieve = useCallback((index: number) => {
      const ref = doc(db, 'newList', list[index].id)
      setDoc(ref, { item: list[index].item, status: true })

      setList([...list].map((object) => {
        if(list[index].id === object.id) {
        return {
          ...object,
          status: true
        }
        } else return object
      }))

    }, [list])

    const handleDelete = useCallback((index: number) => {
        const handlingDelete = async () => {
            await deleteDoc(doc(db, "newList", list[index].id));
        }
        setList((pre) => {
          return pre.filter((item, id) => index !== id)
        })
        handlingDelete()
    }, [list])
    
    return (
        <div>
            {
              list.map((e: listProps, index: number) => {
                if(!e.status) {
                  return (
                    <div className={styles.container} key={e.item+index}> 
                        <Link href={'/todo/' + e.item}>
                          <p className={styles.clickText}>{e.item}</p>
                        </Link>
                        <button onClick={() => handleAchieve(index)}>完成</button>
                        <button onClick={() => handleDelete(index)}>刪除</button>
                    </div>
                  )
                }
              })
            }
            { list.length!==0 ? <p>完成：</p> : null }
            {
              list.map((e: listProps, index: number) => {
                if(e.status) {
                  return (
                    <div className={styles.container} key={e.item+index}> 
                        <p>{e.item}</p>
                        <button className={styles.achieveBtn} disabled>完成</button>
                        <button onClick={() => handleDelete(index)}>刪除</button>
                    </div>
                  )
                }
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


