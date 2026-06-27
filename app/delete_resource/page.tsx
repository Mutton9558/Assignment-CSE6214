"use client";

import { useSearchParams } from 'next/navigation';
import { deleteResource } from '@/app/actions/ResourceController';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteResourceConfirmation(){
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const router = useRouter();

    const [buffering, setBuffering] = useState(false);

    async function deleteItem(){
        setBuffering(true);
        if(id !== null){
            const success = await deleteResource(id);
            if(success.success){
                alert(`Successfully deleted resource ${name}`);
            } else {
                alert(`Failed to delete for reason: ${success.error}`);
            }
        }
        router.back();
    }

    return(
        <div className="w-full min-h-screen flex flex-col justify-center items-center">
            <h1>Are you sure you want to delete {name}?</h1>
            <div className='flex flex-row gap-2 mt-4'>
                <button disabled={buffering} onClick={deleteItem} className='w-24 h-16 bg-green-300 rounded-2xl cursor-pointer disabled:bg-gray-400 disabled:text-gray-600'>Confirm</button>
                <button disabled={buffering} onClick={() => {setBuffering(true);router.back()}} className='w-24 h-16 bg-red-300 rounded-2xl cursor-pointer disabled:bg-gray-400 disabled:text-gray-600'>Cancel</button>
            </div>
        </div>
    )
}