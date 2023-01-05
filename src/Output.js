import React from "react";

function Output({currOp,prevOp}){
    return (
        <div  className="output">
            <div className="current-operand">{currOp}</div>
            <div className="previous-operand">{prevOp}</div>
        </div>
    )
}

export default Output;