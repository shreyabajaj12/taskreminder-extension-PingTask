import React, { useEffect, useState } from 'react'
import add from '../assets/add.svg'
import exit from '../assets/logout.png'
import { supabase } from "../supabase-client";
import del from '../assets/del.svg'
import formatDate from './formatDate.js'

const Home = () => {
    const logout = async () => {
        await supabase.auth.signOut();
    };
    const [info, setInfo] = useState({
        email: "",
        task: "",
        ispending: true,
        due_date: "",
        important: false
    })
    const [addOpen, setAddOpen] = useState(false);
    const [content, setContent] = useState([]);
    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // console.log(user.email);
        setInfo(prev => ({
            ...prev,
            email: user?.email
        }));
        const { data, error } = await supabase.from("reminder").select("*").eq("email", user.email).order("due_date", { ascending: true });
        if (error) {
            console.log(error.message);
        }
        setContent(data);
        // console.log(data);
    }
    useEffect(() => {
        loadData();

    }, []);
    const addTask = async () => {
        // console.log(info);
        if (info.task.trim() === "" || info.date === "") {
            setInfo(prev => ({
                ...prev,
                task: "",
                ispending: true,
                due_date: "",
                important: false
            }));
            return;
        }
        const { error } = await supabase.from("reminder").insert([info]).select().single();
        if (error) {
            console.log("Error adding task", error.message);
        }
        setInfo(prev => ({
            ...prev,
            task: "",
            ispending: true,
            due_date: "",
            important: false
        }));
        setAddOpen(false);

        loadData();
    }
    const handleChange = async (id, currValue) => {
        const { error } = await supabase.from("reminder").update({
            "ispending": !currValue
        }).eq("id", id);
        if (error) {
            console.error("Update failed:", error.message);
            return;
        }
        setContent(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, ispending: !currValue }
                    : item
            )
        );
    }
    const remove = async (id) => {
        const { error } = await supabase.from("reminder").delete().eq("id", id);
        if (error) {
            console.log(error.message);
        }
        setContent(prev => prev.filter(item => item.id !== id));
    }
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className='text-gray-300 bg-black w-80 h-96 '>
                    <div className='cursor-pointer pt-2 pl-1' onClick={logout} >
                        <img src={exit} alt="" /></div>
                    {addOpen &&
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/60"
                                onClick={() => setAddOpen(false)}
                            />
                            <div className="relative bg-gray-100 mt-4 w-72 h-30 text-black rounded p-4">
                                <div className='flex justify-between'>
                                    <label className="text-sm">Task Name :</label>
                                    <input onChange={(e) =>
                                        setInfo({ ...info, task: e.target.value })
                                    } value={info.task} className="text-sm border-b" type="text" />
                                </div>
                                <div className='flex justify-between'>
                                    <label className="text-sm">Due Date :</label>
                                    <input onChange={(e) =>
                                        setInfo({ ...info, due_date: e.target.value })
                                    } value={info.due_date} type="date" min={new Date().toISOString().split("T")[0]} className='text-sm border-b' />
                                </div>
                                <div className='flex justify-between'>
                                    <label className="text-sm"
                                    >Is Important :</label>
                                    <input checked={info.important} onChange={(e) =>
                                        setInfo({ ...info, important: e.target.checked })
                                    } type="checkbox" className='mr-27 text-sm border-b' />
                                </div>

                                <div className='flex pt-1 items-center justify-around'>
                                    <button onClick={() => {
                                        setAddOpen(false)
                                    }} className='w-20 rounded cursor-pointer h-7 text-sm bg-slate-400'>Close</button>
                                    <button onClick={addTask} className='w-30 rounded cursor-pointer h-7 text-sm bg-slate-400'>Add Task</button></div>
                            </div>
                        </div>
                    }

                    <div className='px-3 flex flex-col'>
                        <div className='text-center pb-1 text-3xl'>Reminder</div>
                        <div className='border-b border-gray-400'></div>

                        <div className='border-b border-gray-400'></div>
                        <div className='flex justify-between'><img onClick={() => {
                            setAddOpen(true)
                        }} className=' cursor-pointer  w-6 h-6 ml-auto mr-2'
                            src={add} alt="add" /></div>
                        <div className="mt-2 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
                            {
                                content.map((content) => (
                                    <div key={content.id} className='flex justify-between mt-2'>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 accent-green-500"
                                                    onChange={() => {
                                                        handleChange(content.id, content.ispending)
                                                    }}
                                                    checked={!content.ispending}
                                                />
                                                <span className={`${!content.ispending ? "line-through" : ""} text-sm ${content.important ? "bg-yellow-500/60 rounded" : ""}`}>{content.task}</span>
                                            </label>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-sm text-gray-400'>{formatDate(content.due_date)}</div>
                                            <div onClick={() => remove(content.id)}><img className='w-5 h-5 ml-3 cursor-pointer' src={del} alt="delete" /></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>



                    </div>


                </div>

            </div>
        </>
    )
}

export default Home
