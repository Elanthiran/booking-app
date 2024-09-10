const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(5000,()=>
{
    console.log("server started successfully")
})

//creating variables for storing data
let rooms = [{
    roomId:"B1",
    seatsAvailable:"4",
    amenities:"tv,ac,heater",
    pricePerhr:"200"
}];
let bookings = [{
    customer: "rajesh",
    bookingDate: "16/6/2024",
    startTime: "12:00pm",
    endTime: "11:59am",
    bookingID: "B1",
    roomId: "R1",
    status: "booked",
    booked_On: "25/6/2024"
}
];
let customers = [
    { name: 'rajesh',
     bookings: [ 
        {
            customer: 'rajesh',
            bookingDate: '16/6/2024',
            startTime: '12:00pm',
            endTime: '11:59am',
            bookingID: 'B1',
            roomId: 'R1',
            status: 'booked',
            booked_On: '25/6/2024'
          }
      ] }
];


//creating a room

app.post("/createroom",(request,response)=>
{
    const newRoom=request.body;
    const checking=rooms.find((e)=>e.roomId==newRoom.roomId)
    if(checking==undefined)
    {
        rooms.push(newRoom);
    response.status(201).json({message:"room created"});
    }
    else{
        return response.status(400).json({message:"room already exists."});
    }
})


//view all rooms avaliable

app.get("/view",(request,response)=>
{
    response.status(200).json({RoomsList : rooms});
    console.log(RoomsList)
})

//booking checking
app.post("/booking/createroom/:id", (req,res)=>{
    try{
      const {id} = req.params;
      let bookRoom = req.body; 
      let date = new Date();
      let dateFormat = date.toLocaleDateString();
      let checking = rooms.find((el)=> el.roomId === id)
      if(checking !== undefined){
          return res.status(400).json({message:"room does not exist.", RoomsList:rooms});
  
      }
//verifying the booked date      
      let matchID = bookings.filter((e)=> e.roomId===id) 
      if(matchID.length > 0){
          let dateCheck = matchID.filter((m)=>{ return m.bookingDate === bookRoom.bookingDate});
          if(dateCheck.length===0){
              let newID = "B"+(bookings.length + 1);
              let newbooking = {...bookRoom, bookingID: newID, roomId:id, status:"booked", booked_On: dateFormat}
              bookings.push(newbooking);
              return res.status(201).json({message:"hall booked", Bookings:bookings, added:newbooking});
          }
          else{
              return res.status(400).json({message:"hall already booked for this date, choose another hall", Bookings:bookings});
          }
      }
      else{
              let newID = "B"+(bookings.length + 1);
              let newbooking = {...bookRoom, bookingID: newID, roomId:id, status:"booked",booked_On: dateFormat}
              bookings.push(newbooking);
              const customerdetails = customers.find(cust => 
                cust.name === newbooking.customer);
                if (customerdetails) {
                    customerdetails.bookings.push(newbooking);
                } else {
                    customers.push({ name:newbooking.customer,bookings:[newbooking]});
                }
              return res.status(201).json({message:"hall booked", Bookings:bookings, added:newbooking});
  
      }
    }
    catch(error){
        res.status(400).json({message:"error booking room", error: error, data:bookings});
    }
});

app.get('/viewbooking',(req,res) => {
    const bookedRooms = bookings.map(booking => {
        const {roomId ,Status,customer,bookingDate,startTime,endTime} = booking;
        return {roomId ,Status,customer,bookingDate,startTime,endTime} 
    });
    res.status(201).json(bookedRooms);
});

//api to list all the customers with booked data
app.get('/customers', (req, res) => {
    const customerBookings = customers.map(customer => {
      const { name, bookings } = customer;
      const customerDetails = bookings.map(booking => {
        const { roomId, bookingDate, startTime, endTime } = booking;
        return { name, roomId, bookingDate, startTime, endTime };
      });
     
      return customerDetails;
    })
   
    res.json(customerBookings);
  });

// api to list how many times the user booked the room
  app.get('/customer/:name', (req, res) => {
    const { name } = req.params;
    const customer = customers.find(e => e.name === name);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    const customerBookings = customer.bookings.map(booking => {
      const { customer,roomId, startTime, endTime, bookingID, status, bookingDate,booked_On } = booking;
      return { customer, roomId, startTime, endTime, bookingID, status, bookingDate,booked_On };
    });
    res.json(customerBookings);
  });

  var router = express.Router();

  var route=router.get('/', function(req, res) {
   res.json(bookedRooms)
});


app.use('',route)

