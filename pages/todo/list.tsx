import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { User } from "firebase/auth";
import {
  doc,
  collection,
  deleteDoc,
  query,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import db from "../../firebase/clientApp";

import styles from "../../styles/list.module.scss";

type listType = {
  id: string;
  item: string;
  status: boolean;
};

type ListPropsType = {
  user: User;
};
const List = ({ user }: ListPropsType) => {
  const [list, setList] = useState<listType[]>([]);

  useEffect(() => {
    const q = query(collection(db, "ToDoList"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setList((pre) => {
        let newList = [...pre];
        const changes = snapshot.docChanges();
        changes.forEach((change) => {
          const data = change.doc.data();
          if (data.userId === user.uid) {
            if (change.type === "added") {
              newList = [
                { id: change.doc.id, item: data.item, status: data.status },
                ...newList,
              ];
            }
            if (change.type === "modified") {
              newList = newList.map((item) =>
                item.id === change.doc.id ? { ...item, ...data } : item
              );
            }
            if (change.type === "removed") {
              newList = newList.filter((item) => item.id !== change.doc.id);
            }
          }
        });
        return newList;
      });
    });

    return () => unsubscribe();
  }, [user]);

  //-----

  const handleAchieve = useCallback(
    async (index: number) => {
      const ref = doc(db, "ToDoList", list[index].id);
      await setDoc(ref, {
        item: list[index].item,
        status: true,
        userId: user.uid,
      });
    },
    [list]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      const ref = doc(db, "ToDoList", list[index].id);
      await deleteDoc(ref);
    },
    [list]
  );

  return (
    <div className={styles.container}>
      {list.map((e: listType, index: number) => {
        if (!e.status) {
          return (
            <div className={styles.itemBox} key={e.item + index}>
              <Link href={"/todo/" + e.item}>
                <p className={styles.text}>{e.item}</p>
              </Link>
              <button onClick={() => handleAchieve(index)}>完成</button>
              <button onClick={() => handleDelete(index)}>刪除</button>
            </div>
          );
        }
      })}
      {list.length !== 0 ? <p>完成：</p> : null}
      {list.map((e: listType, index: number) => {
        if (e.status) {
          return (
            <div className={styles.itemBox} key={e.item + index}>
              <p>{e.item}</p>
              <button className={styles.disabledButton} disabled>
                完成
              </button>
              <button onClick={() => handleDelete(index)}>刪除</button>
            </div>
          );
        }
      })}
    </div>
  );
};

export default List;
