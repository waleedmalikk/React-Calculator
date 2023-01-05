import React, { useEffect } from "react";
import './App.css'
import {useState} from "react";
import Output from './Output';

function App(){

  const [currentOperand, setCurrentOperand] = useState("");
  const [previousOperand, setPreviousOperand] = useState("");

  useEffect(() => {
    answer()
  }, [currentOperand])

  const numops_arr=['0','1','2','3','4','5','6','7','8','9','.','+','-','*','÷','%']
  const remove_arr=['AC','⌫']
  const operations_string= ['+','-','*','÷','/']
  const numbers_string=['0','1','2','3','4','5','6','7','8','9','.']


  function getStrLastElement(s){
    return s.toString()[s.length-1]
  }

  function StrInArr(s,arr){
    if(s===undefined){
      return false
    }else{
      return arr.some(element=>s.toString().includes(element))
    }
  }

function strIndexesContainArr(s,arr){
  let inds=[]
  if(s!==undefined){
    for (let i = 0; i < s.toString().length; i++){
      if(arr.some(element=>s.toString()[i].includes(element))){
        inds.push(i)
        }
      }
    }
  return inds
}

function insertBeforeAfterDecimal(s){
  let indices=[]
  for(let i=0;i<s.length;i++){
      if(s[i]==='.'){
          indices.push(i)
      }
  }
  for (let i=0; i<indices.length;i++){
      if(!StrInArr(s[indices[i]-1],numbers_string) && !StrInArr(s[indices[i]+1],numbers_string)){
        s = s.split('')
          s[indices[i]] = '0'
          s = s.join('')
      }
  }
  return s.toString()
}

function backDemimalCheck(s){
  for(let i=s.length-1;i>=0;i--){
      if(StrInArr(s[i],['.'])){
          return true
      }else if(StrInArr(s[i],operations_string)){
          return false
      }
  }
}

function braketRemoval(s){
  let arr=[]
  for (let i= 0;i<s.length;i++){
    if(s[i]==='('){
      arr.push(i)
    }else if(s[i]===')'){
      arr.splice(arr.length-1,1)
    }
  }

  for (let i = 0; i < arr.length; i++) {
    s= s.slice(0,arr[i]) + s.slice(arr[i]+1)
  }
  return s
}

function starAdder(s){
  for(let i=0;i<s.length;i++){
  if(s[i]===')' && !StrInArr(s[i+1],operations_string) && i<s.length-1){
      s=s.slice(0,i+1) + '*'+ s.slice(i+1)
    }
  }
  return s
}

function zeroRemover(s){
  let iter=s.length-1
  while(iter>=0){
      if(s[iter]==='0'){
          iter--
      }else{
          break
      }
  }    
  if(iter===0 && s[iter]==='0'){
      return ''
  } 
  if(s[iter]!=='.' && !StrInArr(s[iter],numbers_string)){
      s= s.slice(0,iter+1)
  }
  return s
}


function equal(){
  if(previousOperand!=''){
    setCurrentOperand(previousOperand)
    // setPreviousOperand('')
  }
}


function plusMinusFunc(){
  if(currentOperand===''){
    return
  }
  let lastCharacter= getStrLastElement(currentOperand)
  if(StrInArr(lastCharacter,operations_string) ){
    return
  }else if(lastCharacter===')'){
    let inds=strIndexesContainArr(currentOperand,operations_string)
    setCurrentOperand(currentOperand.toString().substring(0,inds[inds.length-1]-1)+ currentOperand.toString().substring(inds[inds.length-1]+1, currentOperand.toString().length-1))
  }else{
    let insert_ind=0
    let indices=strIndexesContainArr(currentOperand,operations_string)
    if (indices.length!==0){
      insert_ind=indices[indices.length-1]+1
    }
    setCurrentOperand(currentOperand.toString().substring(0,insert_ind)+"(-"+ currentOperand.toString().substring(insert_ind)+")") 
    }
  }


  const setData = async (e) => {
    await setCurrentOperand(e) 
  }


 const appendNumOps =  (addition) => {
  let newData = '';
  if(currentOperand.toString().length>100){
    return
  }
  let lastCharacter= getStrLastElement(currentOperand)
  if(currentOperand.toString()===''){
    if( StrInArr(addition.toString(),operations_string) || addition==="%" ){
      return
    }
  }
  if(addition.toString()==='.'){
    if(lastCharacter==='.'){
      return
    }
    if(backDemimalCheck(currentOperand.toString())){
      return
    }
  }
  if(addition.toString()==='%' || addition.toString()==='÷'){
    if(lastCharacter==='÷' || lastCharacter==='%'){
      return
    }
  }
  if(StrInArr(lastCharacter,['0'])){
    setCurrentOperand(zeroRemover(currentOperand)) 
  }
  if(StrInArr(lastCharacter,operations_string) && StrInArr(addition,operations_string)){
    setCurrentOperand(currentOperand.toString().slice(0,-1)+ addition.toString()) 
  }else{
    setCurrentOperand(currentOperand.toString() + addition.toString())
  }
} 

function answer(){
  let current_query=currentOperand.toString()
  current_query=insertBeforeAfterDecimal(current_query)
  
  current_query=current_query.replaceAll('÷','/')

  for (let i=0;i<current_query.length;i++){
    if(current_query[i]==="%"){
      if(i!==current_query.length-1 && !StrInArr(current_query[i+1],operations_string)){
        current_query= current_query.slice(0,i)+'/100*'+current_query.slice(i+1)
      }else{
        current_query= current_query.slice(0,i)+'/100'+current_query.slice(i+1)
      }
    }
  }

  current_query=braketRemoval(current_query)

  if(current_query.length===1 && StrInArr(current_query,operations_string)){
    current_query=""
    }

  current_query= starAdder(current_query)

  let lastCharacter= getStrLastElement(current_query)
  
  if(StrInArr(lastCharacter,operations_string) ){
    current_query=current_query.slice(0,-1)
  }

   try{
    let ans= eval(current_query)
    console.log('ans:'+ans)
    setPreviousOperand(ans)

   }catch(error){
    setPreviousOperand("ERROR")
   }
}

const clickedButton = (str) => {
  str=str.toString()
  if(str==='+/-'){
    plusMinusFunc()
    return
  }else if(StrInArr(str,numops_arr)){
    appendNumOps(str)
  }else if(StrInArr(str, remove_arr)){
    if(str==="AC"){
      setCurrentOperand("")
      setPreviousOperand("")
    }else if(str==='⌫'){
      setCurrentOperand(currentOperand.slice(0,currentOperand.length-1))
    }
  }else if(StrInArr(str,['='])){
    equal()
  }
}

const calcButton =(str) => {
    return <button className="button-size" onClick={()=> clickedButton(str)}>{str}</button>  
}

return (
  <div className="calculator-grid">
    <Output currOp={currentOperand} prevOp={previousOperand}/>
    {calcButton("AC")}
    {calcButton("⌫")}
    {calcButton('+/-')}
    {calcButton("÷")}
    {calcButton("7")}
    {calcButton("8")}
    {calcButton("9")}
    {calcButton("*")}
    {calcButton("4")}
    {calcButton("5")}
    {calcButton("6")}
    {calcButton("-")}
    {calcButton("1")}
    {calcButton("2")}
    {calcButton("3")}
    {calcButton("+")}
    {calcButton("%")}
    {calcButton("0")}
    {calcButton(".")}
    {calcButton("=")}
  </div>
)
}

export default App;