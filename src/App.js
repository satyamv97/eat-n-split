
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App(){
  const [showform,setShowForm] = useState(false)
  const [updFriends,setUpdFriends] = useState(initialFriends);
  const [selectedFriend,setSelectedFriend] = useState(null)


  function addFriendhandler(friend){
    setUpdFriends(friends => [...friends,friend])
  }

  // const friends = initialFriends
  function clickhandler(){
    setShowForm((e)=> !e) 
  }

  function handleSelection(friend){
    // setSelectedFriend(friend)
    setSelectedFriend((cur) =>
    (cur?.id=== friend.id ? null : friend))
    setShowForm(false)
  }

  function splitBillHandler(value){
      setUpdFriends (friends=>
        friends.map((friend) => 
        friend.id === selectedFriend.id 
        ? {...friend, balance : friend.balance + value}
        : friend ))

        setSelectedFriend(null)
  }

  return(
    <div className="app">
      <div className="sidebar">
        <Friendlist friends={updFriends} onSelection = {handleSelection} selectedFriend={selectedFriend}  />

        {showform ? <FormAddFriend onaddFriend={addFriendhandler}  /> : ""}

        <Button onClick={clickhandler} 
        >{showform ? "Close" : "Add Friend"  }</Button>

      </div>
      {selectedFriend &&
      <FormSplitBill 
      selectedFriend ={selectedFriend}
      onSplitBill = {splitBillHandler}
      key={selectedFriend.id}
      /> 
       }
    </div>
  )
}
export default App;

function Friendlist({friends, onSelection,selectedFriend}){
  
  return(
    <ul>
      {friends.map((friend) => (<Friends onSelection = {onSelection} selectedFriend={selectedFriend}  friend = {friend} key = {friend.id} />))}   
    </ul>

  )
}

function Friends({friend, onSelection,selectedFriend}){
  const isSelected = selectedFriend?.id === friend.id;

  return(
  <li className={isSelected ? "selected" :""}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    {friend.balance < 0 &&
     (<p className="red">
      You owes {friend.name} ${Math.abs(friend.balance)}
     </p>)}

     {friend.balance > 0 &&
     (<p className="green">
      {friend.name} owes you ${Math.abs(friend.balance)}
     </p>)}

     {friend.balance === 0 &&
     (<p >
      You and {friend.name} are even
     </p>)}
     <Button onClick={()=> onSelection(friend)} >{isSelected ? "Close" :"Select"}</Button> 
     
  </li>
  )
}



function FormAddFriend({onaddFriend}){
  const [name,setName] = useState ("")
  const [url,setUrl] = useState ("https://i.pravatar.cc/48")

  function addfriend(e){
    e.preventDefault();

    if(!name || !url) return;
    const id = crypto.randomUUID()
    const newFriend =  { 
      name,image:url ,
      balance : 0,id 
    }
    
    console.log(newFriend)
    onaddFriend(newFriend)
    setName("")
    setUrl("https://i.pravatar.cc/48")

  }
  return(
    <form className="form-add-friend" onSubmit={addfriend}>
      <label>
        Friend Name 
      </label>
          <input type="text" value={name} onChange={(e) =>setName(e.target.value)} />
      <label>
        Image URL 
      </label>
        <input type="text" value={url} onChange={(e) =>setUrl(e.target.value)}/>
        <Button >ADD</Button>
    </form>
  )
}

function Button({children,onClick}){
  return(
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}){
  const [bill,setBill] = useState("");
  const [paidByYou,setPaidByYou] = useState("");
  const paidByFriend = bill ? bill - paidByYou :""
  const [whoIsPaying,setWhoIsPaying] = useState("you");

 
  function splitBalanceHandler(e){
    e.preventDefault();
    // const paidByFriend = bill - paidByYou
    if(!bill || !paidByYou) return
    onSplitBill( whoIsPaying === "you" ? paidByFriend : -paidByYou )
  }

  return(
    <form className="form-split-bill" onSubmit={splitBalanceHandler}>
    <h2>SPLIT A BILL WITH {selectedFriend.name} </h2>
    
    <label> bill Value</label>
    <input type="number" value={bill}
     onChange={(e) => setBill(Number(e.target.value))}/>
    
    <label> Your Expense</label>
    <input type="number" value={paidByYou} 
    onChange={(e) => setPaidByYou(
      Number(e.target.value) > bill ? paidByYou : Number(e.target.value)
      )}/>
    
    <label> {selectedFriend.name}'S Expense </label>
    <input type="text" value={paidByFriend} disabled />

    <label> Who will paying the Bill? </label>
    <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
      <option value="you">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
    
    
    <Button >Split Bill</Button>

    </form>
  )
}
