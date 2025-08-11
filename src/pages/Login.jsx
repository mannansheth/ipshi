import React, { useEffect, useState } from 'react'

const Login = () => {
    const [countWrong, setCountWrong] = useState(0)
    const [isWrong, setIsWrong] = useState(JSON.parse(localStorage.getItem("isWrong")) || false);
    const [refreshCount, setRefreshCount] = useState(JSON.parse(localStorage.getItem("refreshCount") || "0"));
    useEffect(() => {
        if (isWrong) {
            localStorage.setItem("refreshCount",  JSON.stringify(refreshCount+1))
            setRefreshCount(refreshCount+1)
        }
    }, [])

    const handleSubmit = () => {
        const inpPass = document.getElementById("pass-input");
        const btn = document.getElementById("submit-btn");
        if (inpPass.value === "180421") {
            localStorage.setItem("code", "180421")
            window.location.pathname = "/"
        } else {
            if (countWrong >= 2) {
                setIsWrong(true);
            }
            else {
                inpPass.value = "";
                inpPass.focus();
                inpPass.style.width = (countWrong+1)*300 + "px";
                inpPass.style.fontSize = (countWrong+1)*30 + "px";
                btn.style.width = (countWrong+1)*200 + "px";
                btn.style.fontSize = (countWrong+1)*20 + "px";
                btn.innerText = "PLEASE INPUT CORRECT"
                setCountWrong(countWrong+1);
            }
        }
        localStorage.setItem("isWrong", JSON.stringify(countWrong >= 2))
    }
  return (
    <div>
        <center>
            {!isWrong ? 
            <>
            <h2>Enter password: </h2>
            <input type="password" placeholder="(its a special date)" id='pass-input'></input>
            <p>****3 tries only</p>
            <button onClick={handleSubmit} id="submit-btn">Submit</button>
            </>
            :
            <>
            <h1>ERROOORRRRR!!!!</h1>
             <h1>HOW DO YOU NOT KNOW THE PASSWORD</h1>
             
             {refreshCount === 0 ? <h6>dw you can refresh :)</h6>
            : refreshCount === 1 ? <h1>Aw sad! Refreshing doesn't help :(</h1> 
            : refreshCount === 2 ? <h1>Told you it doesnt help</h1>
            : refreshCount === 3 ? <h1>Are you just gonna keep trying?</h1>
            : refreshCount === 4 ? <h1>How long will you try?</h1>
            : refreshCount === 5 ? <h1>Can you figure out a way?</h1>
            : refreshCount === 6 ? <h1>This is getting sad</h1> : <h1>{"hehe".repeat(refreshCount)}</h1>}
            </>}
            
        </center>
    </div>
  )
}

export default Login
