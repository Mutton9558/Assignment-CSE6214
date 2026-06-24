interface ResourceCounterProp{
    count: number;
    onChange: (newVal: number) => void;
}

export function EquipmentCounter({count, onChange}: ResourceCounterProp){
    function handleDecrement(){
        if (count > 0) {
            onChange(count-1);
        }
    }

    function handleIncrement(){
        onChange(count+1);
    }

    return(
        <div className="bg-accent rounded-full w-32 place-content-center grid grid-cols-3 grid-rows-1">
            <button type="button" onClick={handleDecrement} disabled={count <= 0} className="border-2 rounded-full cursor-pointer active:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:text-secondary disabled:active:scale-100 disabled:active:bg-accent">-</button>
            <p className="w-full flex justify-center">{count}</p>
            <button type="button" onClick={handleIncrement} className="border-2 rounded-full cursor-pointer  active:scale-95">+</button>
        </div>
    )
}