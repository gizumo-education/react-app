import { useEffect, useState } from "react";
import { Layout } from "../../ui/Layout";

import styles from './index.module.css'
import axios from "axios";
import { data } from "react-router-dom";
import { ListItem } from "../../ui/ListItem";

export const Completed = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/todo')
            .then(({data}) => {
                const completedTodos = data.filter(todo => todo.isCompleted);
                setTodos(completedTodos);
            });
    }, [])

    return (
        <Layout>
            <h1 className={styles.heading}>完了済み一覧</h1>
            <ul>
                {todos.map(todo => {
                    return <ListItem key={todo.id} todo={todo}/>
                })}
            </ul>
        </Layout>
    );
}
